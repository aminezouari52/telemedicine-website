const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Doctor, Consultation, Patient } = require("../models");

const documentNumbers = 20;

async function seedConsultationCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await Consultation.collection.drop();

        let consultations = [];

        const doctors = await Doctor.find();
        const patients = await Patient.find();

        const doctorsIds = doctors.map((doctor) => doctor._id);
        const patientsIds = patients.map((patient) => patient._id);

        for (let i = 0; i < documentNumbers; i++) {
          const doctorIndex = Math.floor(Math.random() * doctorsIds.length);
          const patientIndex = Math.floor(Math.random() * patientsIds.length);

          let newConsultation = {
            date: new Date(new Date(faker.date.anytime()).setMinutes(0, 0, 0)),
            status: "pending",
            doctor: doctorsIds[doctorIndex],
            patient: patientsIds[patientIndex],
          };

          consultations.push(newConsultation);
        }

        await Consultation.create(consultations);

        console.log("Consultation collection seeded! :)");

        // close database and exit process
        server.close();
        process.exit();
      });
    });
  } catch (err) {
    console.log(err.stack);
  }
}

seedConsultationCollection();
