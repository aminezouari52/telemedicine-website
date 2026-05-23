const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
