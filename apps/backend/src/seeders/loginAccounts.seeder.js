// Seeds two stable login accounts (a doctor and a patient) so they can always
// sign in with a known password. It guarantees BOTH layers the app requires:
//   1. A Firebase Auth user (email + password) — the frontend signs in here.
//   2. A MongoDB `users` record with the correct role — the backend looks it up.
//
// Idempotent: re-running creates missing accounts and resets the password on
// existing ones. Run with: pnpm -F=backend seed:logins
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const { Doctor, Patient } = require("../models");

const PASSWORD = "testtest";

const accounts = [
  {
    email: "freddie24@yahoo.com",
    model: Doctor,
    fields: {
      firstName: "Freddie",
      lastName: "Doctor",
      role: "doctor",
      specialty: "Generalist",
      hospital: "Hospital Mongi Slim",
      experience: "+5 years",
      price: 50,
      description: "Stable demo doctor account.",
      degrees: ["Docteur en Médecine (MD)"],
      certifications: ["Certificat en Médecine Interne"],
      schedule: ["Monday", "Wednesday", "Friday"],
      approvalStatus: "approved",
      isProfileCompleted: true,
    },
  },
  {
    email: "christop_hagenes21@gmail.com",
    model: Patient,
    fields: {
      firstName: "Christop",
      lastName: "Hagenes",
      role: "patient",
      gender: "Male",
      bloodType: "O+",
      isProfileCompleted: true,
    },
  },
];

async function ensureFirebaseUser(email) {
  const admin = require("../firebase");
  try {
    const existing = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(existing.uid, { password: PASSWORD });
    logger.info(`Firebase password reset for ${email}`);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      await admin.auth().createUser({ email, password: PASSWORD });
      logger.info(`Firebase account created for ${email}`);
    } else {
      logger.warn(
        `Could not set Firebase account for ${email}: ${err.message}`,
      );
    }
  }
}

async function seedLoginAccounts() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info("Connected to MongoDB");

    for (const { email, model, fields } of accounts) {
      await ensureFirebaseUser(email);
      await model
        .findOneAndUpdate(
          { email },
          { $set: fields },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        )
        .exec();
      logger.info(`MongoDB ${fields.role} record ready: ${email}`);
    }

    logger.info(`Login accounts seeded! Password for all: ${PASSWORD}`);
    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
}

seedLoginAccounts();
