const mongoose = require("mongoose");
const User = require("./user.model.js");

const doctorSchema = new mongoose.Schema({
  photo: String,
  firstName: String,
  lastName: String,
  age: {
    type: Number,
    min: [18, "Age must be greater than 17"],
    max: [100, "Age cannot exceed 100"],
  },
  phone: {
    type: String,
    unique: true,
    match: [
      /^\+?[1-9]\d{8,15}$/,
      "Please enter a valid phone number with an optional leading + sign.",
    ],
  },
  address: String,
  city: String,
  zip: {
    type: Number,
    match: [
      /^[0-9]+$/,
      "Please enter a valid zip code which contains only numbers",
    ],
    minlength: 5,
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
  price: {
    type: Number,
    min: [0, "Le prix ne peut pas être négatif"],
    max: [1000, "Le prix ne doit pas dépasser 1000dt/hr"],
  },
  degrees: [String],
  certifications: [String],
  schedule: [String],
  experience: {
    type: String,
    enum: ["Moins qu'une année", "1 - 5 ans", "+5 ans"],
  },
  isProfileCompleted: {
    type: Boolean,
    default: false,
  },
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
