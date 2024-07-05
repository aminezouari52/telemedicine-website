const mongoose = require("mongoose");
const User = require("./user.js");

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  title: String,
  hospital: String,
  description: String,
  // image: String,
  price: String,
  specialty: String,
  address: String,
  phone: String,
  age: Number,
  patients: Number,
  degree: [String],
  schedule: String,
  experience: String,
  certifications: [String],
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
