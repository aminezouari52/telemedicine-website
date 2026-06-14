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

// Re-index the patient's profile embedding whenever the profile is updated
// (updatePatient uses findByIdAndUpdate -> "findOneAndUpdate"). Fire-and-forget
// so an embedding failure never breaks the update; lazy require avoids a
// models <-> services cycle.
patientSchema.post("findOneAndUpdate", (doc) => {
  if (!doc?._id) return;
  require("../services/medicalEmbedding.service")
    .syncPatientEmbedding(doc._id)
    .catch((err) => {
      require("../config/logger").error(
        `Patient embedding sync failed: ${err.message}`,
      );
    });
});

const Patient = User.discriminator("patient", patientSchema);

module.exports = Patient;
