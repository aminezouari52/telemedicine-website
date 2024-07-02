const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const doctorSchema = new mongoose.Schema({
  doctor: {
    type: ObjectId,
    ref: "Doctor",
  },
  firstName: String,
  lastName: String,
  patients: String,
  hospital: String,
  image: String,
  price: String,
  specialty: String,
  address: String,
  phone: String,
  age: String,
  role: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
