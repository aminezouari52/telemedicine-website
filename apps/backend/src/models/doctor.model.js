const mongoose = require("mongoose");
const User = require("./user.model.js");

const doctorSchema = new mongoose.Schema({
  photo: String,
  description: String,
  hospital: {
    type: String,
    enum: [
      "",
      "Hospital Mongi Slim",
      "Hospital Charles Nicolle",
      "Hospital La Rabta",
      "Hospital Razi",
      "Hospital Sahloul",
      "Hospital Farhat Hached",
      "Hospital Fattouma Bourguiba",
      "Hospital Hédi Chaker",
      "Hospital Habib Bourguiba",
    ],
  },
  specialty: {
    type: String,
    enum: [
      "Generalist",
      "Cardiologist",
      "Dermatologist",
      "Endocrinologist",
      "Gastroenterologist",
      "Neurologist",
      "Pediatrician",
      "Psychiatrist",
    ],
    default: "Generalist",
  },
  price: {
    type: Number,
    min: [0, "Price cannot be negative"],
    max: [1000, "Price must not exceed 1000dt/hr"],
  },
  degrees: [String],
  certifications: [String],
  schedule: [String],
  experience: {
    type: String,
    enum: ["Less than a year", "1 - 5 years", "+5 years"],
  },
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
