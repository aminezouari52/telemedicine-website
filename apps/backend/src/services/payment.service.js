const Stripe = require("stripe");
const config = require("../config/config");
const { Payment, Doctor, Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Null when Stripe isn't configured; the payment routes answer 503 then.
const stripe = config.features.payments
  ? Stripe(config.stripe.secretKey)
  : null;

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

// A payment counts as fulfilled only once it has a consultation.
const isFulfilled = (payment) =>
  payment.status === "paid" && Boolean(payment.consultation);

// A paid payment that still has no consultation after this long is treated as
// left behind by a crashed fulfillment and is reconciled.
const STALE_FULFILLMENT_MS = 60 * 1000;

const createConsultationFor = async (payment) => {
  // Atomic upsert keyed on the payment; the unique index on
  // Consultation.payment turns a concurrent insert into a duplicate-key error,
  // in which case the other caller's consultation is used.
  let consultation;
  try {
    consultation = await Consultation.findOneAndUpdate(
      { payment: payment._id },
      {
        $setOnInsert: {
          date: new Date(payment.metadata.date),
          doctor: payment.doctor,
          patient: payment.patient,
          payment: payment._id,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch (err) {
    if (err?.code !== 11000) throw err;
    consultation = await Consultation.findOne({ payment: payment._id });
  }
  await Payment.updateOne(
    { _id: payment._id },
    { consultation: consultation._id },
  );
};

// Called by both the success page and the webhook; the conditional update
// picks one caller to fulfill. Throws a retryable 503 while another caller is
// still creating the consultation, so the webhook is retried instead of acked.
const fulfillPayment = async (stripeSessionId, paymentIntentId) => {
  const previous = await Payment.findOneAndUpdate(
    { stripeSessionId, status: { $ne: "paid" } },
    {
      status: "paid",
      ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
    },
  );

  if (previous) {
    try {
      await createConsultationFor(previous);
    } catch (err) {
      await Payment.updateOne(
        { _id: previous._id, status: "paid", consultation: { $in: [null] } },
        { status: previous.status },
      );
      throw err;
    }
    return;
  }

  const payment = await Payment.findOne({ stripeSessionId });
  if (!payment || isFulfilled(payment)) return;

  // Paid but no consultation yet: either another caller is mid-fulfillment or
  // a previous attempt crashed. Reconcile stale ones, otherwise ask to retry.
  const linked = await Consultation.findOne({ payment: payment._id });
  const age = Date.now() - new Date(payment.updatedAt).getTime();
  if (linked || age > STALE_FULFILLMENT_MS) {
    await createConsultationFor(payment);
    return;
  }
  throw new ApiError(
    httpStatus.SERVICE_UNAVAILABLE,
    "Payment fulfillment is still in progress",
  );
};

const confirmPayment = async (sessionId) => {
  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  if (isFulfilled(payment)) return payment;

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
