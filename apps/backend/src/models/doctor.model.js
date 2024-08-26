const mongoose = require("mongoose");
const User = require("./user.model.js");

const doctorSchema = new mongoose.Schema({
  photo: String,
  firstName: String,
  lastName: String,
  age: {
    type: Number,
    min: [0, "Age must be a positive number"],
    max: [120, "Age cannot exceed 120"],
  },
  phone: {
    type: String,
    unique: true,
    match: [
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number with an optional leading + sign.",
    ],
  },
  address: String,
  city: String,
  zip: {
    type: Number,
    maxlength: 5,
  },
  description: String,
  hospital: {
    type: String,
    enum: [
      "",
      "Hôpital Mongi Slim",
      "Hôpital Charles Nicolle",
      "Hôpital La Rabta",
      "Hôpital Razi",
      "Hôpital Sahloul",
      "Hôpital Farhat Hached",
      "Hôpital Fattouma Bourguiba",
      "Hôpital Hédi Chaker",
      "Hôpital Habib Bourguiba",
    ],
  },
  specialty: {
    type: String,
    enum: [
      "Généraliste",
      "Cardiologue",
      "Dermatologue",
      "Endocrinologue",
      "Gastro-entérologue",
      "Neurologue",
      "Pédiatre",
      "Psychiatre",
    ],
    default: "Généraliste",
  },
  price: Number,
  degrees: [String],
  certifications: [String],
  schedule: [String],
  experience: {
    type: String,
    enum: ["Moins qu'une année", "1 - 5 ans", "+5 ans"],
  },

  patients: Number,
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
