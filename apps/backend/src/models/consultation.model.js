const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const consultationSchema = new mongoose.Schema({
  date: String,
  time: String,
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
  doctor: { type: ObjectId, ref: "Doctor" },
  patient: { type: ObjectId, ref: "Patient" },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
