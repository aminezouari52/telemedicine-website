const Stripe = require("stripe");
const config = require("../config/config");
const { Payment, Doctor, Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const stripe = Stripe(config.stripe.secretKey);

const WEB_FRONTEND_URL = config.webFrontendUrl;

const createCheckoutSession = async (patient, { doctorId, date }) => {
  if (patient.role !== "patient") {
    throw new ApiError(httpStatus.FORBIDDEN, "Only patients can book");
  }
  const patientId = patient._id;
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

// Called by both the success page and the webhook; the conditional update runs it once.
// If creating the consultation fails, the payment goes back to its previous
// status so a later confirm or webhook retry can fulfill it again.
const fulfillPayment = async (stripeSessionId, paymentIntentId) => {
  const previous = await Payment.findOneAndUpdate(
    { stripeSessionId, status: { $ne: "paid" } },
    {
      status: "paid",
      ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
    },
  );
  if (!previous) return;

  try {
    const existing = await Consultation.findOne({ payment: previous._id });
    const consultation =
      existing ||
      (await Consultation.create({
        date: new Date(previous.metadata.date),
        doctor: previous.doctor,
        patient: previous.patient,
        payment: previous._id,
      }));
    await Payment.updateOne(
      { _id: previous._id },
      { consultation: consultation._id },
    );
  } catch (err) {
    await Payment.updateOne(
      { _id: previous._id, status: "paid", consultation: { $in: [null] } },
      { status: previous.status },
    );
    throw err;
  }
};

const confirmPayment = async (sessionId) => {
  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  if (payment.status === "paid") return payment;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new ApiError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment has not been completed",
    );
  }
  await fulfillPayment(sessionId, session.payment_intent);

  return Payment.findById(payment._id);
};

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await fulfillPayment(session.id, session.payment_intent);
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

module.exports = {
  createCheckoutSession,
  handleWebhookEvent,
  confirmPayment,
};
