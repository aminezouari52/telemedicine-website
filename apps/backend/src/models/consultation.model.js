const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultationSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{2}-\d{2}-\d{4}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid date format! Expected format: DD-MM-YYYY`,
      },
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! Expected format: HH:MM`,
      },
    },
    firstName: String,
    lastName: String,
    address: String,
    phone: String,
    age: String,
    weight: String,
    type: String,
    dateInsurance: String,
    provider: String,
    police: String,
    status: {
      type: String,
      enum: ["completed", "pending", "in-progress", "canceled"],
      default: "pending",
    },
    doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
