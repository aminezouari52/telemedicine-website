const mongoose = require("mongoose");
const User = require("./user.model.js");

const doctorSchema = new mongoose.Schema({
  photo: String,
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
});

const Doctor = User.discriminator("doctor", doctorSchema);

module.exports = Doctor;
