const mongoose = require("mongoose");
const User = require("./user.model.js");

const patientSchema = new mongoose.Schema({
  weight: String,
  height: String,
  gender: {
    type: String,
    enum: ["", "Male", "Female", "Other"],
    default: "",
  },
  bloodType: {
    type: String,
    enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    default: "",
  },
  allergies: {
    type: [String],
    default: [],
  },
  chronicConditions: {
    type: [String],
    default: [],
  },
  currentMedications: {
    type: [String],
    default: [],
  },
  emergencyContactName: String,
  emergencyContactPhone: {
    type: String,
    match: [/^[0-9]*$/, "Please enter a valid emergency contact phone number."],
  },
});

const Patient = User.discriminator("patient", patientSchema);

module.exports = Patient;
