const mongoose = require("mongoose");
const User = require("./user.model.js");

const patientSchema = new mongoose.Schema({
  weight: String,
});

const Patient = User.discriminator("patient", patientSchema);

module.exports = Patient;
