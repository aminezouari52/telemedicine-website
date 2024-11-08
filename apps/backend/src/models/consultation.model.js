const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultationSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "in-progress", "canceled"],
      default: "pending",
    },
    doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient", required: true },
  },
  {
    timestamps: true,
  },
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
