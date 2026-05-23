const Stripe = require("stripe");
const config = require("../config/config");
const { Payment, Doctor, Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const stripe = Stripe(config.stripe.secretKey);

const WEB_FRONTEND_URL = config.socket.cors.origin || "http://localhost:5173";

const createCheckoutSession = async ({ doctorId, patientId, date }) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const amount = doctor.price || 0;
  if (amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor price is not set");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Consultation with Dr. ${doctor.firstName} ${doctor.lastName}`,
            description: `Specialty: ${doctor.specialty}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      doctorId,
      patientId,
      date: date.toISOString
        ? date.toISOString()
        : new Date(date).toISOString(),
    },
    success_url: `${WEB_FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${WEB_FRONTEND_URL}/patient/consultation/${doctorId}`,
  });

  const payment = await Payment.create({
    stripeSessionId: session.id,
    amount,
    currency: "usd",
    status: "pending",
    patient: patientId,
    doctor: doctorId,
    metadata: {
      date,
    },
  });

  return {
    sessionUrl: session.url,
    paymentId: payment._id,
  };
};

const confirmPayment = async (sessionId) => {
  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "paid") {
    return payment.populate(["doctor", "patient", "consultation"]);
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new ApiError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment has not been completed",
    );
  }

  payment.stripePaymentIntentId =
    session.payment_intent || payment.stripePaymentIntentId;
  payment.status = "paid";
  await payment.save();

  const consultation = await Consultation.create({
    date: new Date(payment.metadata.date),
    status: "pending",
    doctor: payment.doctor,
    patient: payment.patient,
    payment: payment._id,
  });

  payment.consultation = consultation._id;
  await payment.save();

  return payment.populate(["doctor", "patient", "consultation"]);
};

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const existingPayment = await Payment.findOne({
        stripeSessionId: session.id,
      });
      if (!existingPayment) {
        return;
      }

      if (existingPayment.status === "paid") {
        return;
      }

      existingPayment.stripePaymentIntentId =
        session.payment_intent || existingPayment.stripePaymentIntentId;
      existingPayment.status = "paid";
      await existingPayment.save();

      const consultation = await Consultation.create({
        date: new Date(existingPayment.metadata.date),
        status: "pending",
        doctor: existingPayment.doctor,
        patient: existingPayment.patient,
        payment: existingPayment._id,
      });

      existingPayment.consultation = consultation._id;
      await existingPayment.save();

      break;
    }

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "failed" },
      );
      break;
    }

    default:
      break;
  }
};

const getPaymentBySessionId = async (sessionId) => {
  const payment = await Payment.findOne({
    stripeSessionId: sessionId,
  }).populate(["doctor", "patient", "consultation"]);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};

module.exports = {
  createCheckoutSession,
  handleWebhookEvent,
  getPaymentBySessionId,
  confirmPayment,
};
