// Seeds two stable login accounts (a doctor and a patient) so they can always
// sign in with a known password. It guarantees BOTH layers the app requires:
//   1. A Clerk user (email + password) — the frontend signs in here.
//   2. A MongoDB `users` record with the correct role — the backend looks it up.
//
// Idempotent: re-running creates missing accounts and resets the password on
// existing ones. Run with: pnpm -F=backend seed:logins
//
// Demo-only: the emails and password come from DEMO_DOCTOR_EMAIL,
// DEMO_PATIENT_EMAIL and DEMO_PASSWORD (see .env.example). Delete this file
// and the `seed:logins` script to drop the demo accounts entirely.
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const { Doctor, Patient } = require("../models");
const {
  syncPatientEmbedding,
} = require("../services/medicalEmbedding.service");

// DEMO_PASSWORD must not appear in public breach lists: Clerk forces a
// password reset at sign-in for breached passwords (e.g. "testtest"), which
// breaks demo logins.
const { doctorEmail, patientEmail, password: PASSWORD } = config.demo;

const accounts = [
  {
    email: doctorEmail,
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
    email: patientEmail,
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

async function ensureLoginUser(email) {
  const { ensureClerkUser, clerkErrorMessage } = require("../clerk");
  try {
    const { created } = await ensureClerkUser(email, PASSWORD);
    logger.info(
      created
        ? `Clerk account created for ${email}`
        : `Clerk password reset for ${email}`,
    );
  } catch (err) {
    logger.warn(
      `Could not set Clerk account for ${email}: ${clerkErrorMessage(err)}`,
    );
  }
}

// Keeps the AI chat's medical-history search in sync with the seeded profile.
// A failure (e.g. embedding rate limit) is logged but doesn't fail the seed.
async function syncLoginPatientEmbedding(email) {
  try {
    const patient = await Patient.findOne({ email }).select("_id").exec();
    await syncPatientEmbedding(patient._id);
    logger.info(`Embedding synced for ${email}`);
  } catch (err) {
    logger.warn(`Could not sync embedding for ${email}: ${err.message}`);
  }
}

async function seedLoginAccounts() {
  if (!doctorEmail || !patientEmail || !PASSWORD) {
    logger.error(
      "Set DEMO_DOCTOR_EMAIL, DEMO_PATIENT_EMAIL and DEMO_PASSWORD in apps/backend/.env to seed the demo logins.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info("Connected to MongoDB");

    for (const { email, model, fields } of accounts) {
      await ensureLoginUser(email);
      // updateOne rather than findOneAndUpdate: the latter fires the Patient
      // model's fire-and-forget embedding hook, which the disconnect below
      // would cut off. The embedding is synced (and awaited) explicitly instead.
      await model
        .updateOne(
          { email },
          { $set: fields },
          { upsert: true, setDefaultsOnInsert: true },
        )
        .exec();
      logger.info(`MongoDB ${fields.role} record ready: ${email}`);

      if (model === Patient) await syncLoginPatientEmbedding(email);
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
