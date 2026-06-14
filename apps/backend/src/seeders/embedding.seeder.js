const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Patient, Consultation, MedicalEmbedding } = require("../models");
const {
  syncPatientEmbedding,
  syncConsultationEmbedding,
} = require("../services/medicalEmbedding.service");

// Cap consultations so a test backfill doesn't fire thousands of embedding
// calls (the consultation seeder generates ~4000). Raise as needed.
const CONSULTATION_LIMIT = 100;

async function seedEmbeddingCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await MedicalEmbedding.deleteMany({});

        const patients = await Patient.find({ role: "patient" });
        const consultations = await Consultation.find()
          .sort({ date: -1 })
          .limit(CONSULTATION_LIMIT);

        // Sequential to respect embedding rate limits.
        for (const patient of patients) {
          await syncPatientEmbedding(patient._id);
        }
        console.log(`Embedded ${patients.length} patient profiles.`);

        for (const consultation of consultations) {
          await syncConsultationEmbedding(consultation._id);
        }
        console.log(`Embedded ${consultations.length} consultations.`);

        console.log("Embedding collection seeded! :)");

        server.close();
        process.exit();
      });
    });
  } catch (err) {
    console.log(err.stack);
  }
}

seedEmbeddingCollection();
