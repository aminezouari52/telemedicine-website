const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Doctor, Consultation, User } = require("../models");
const { DateTime } = require("luxon");

const documentNumbers = 20;

function generateRandomNumber() {
  const countryCode = faker.datatype.boolean() ? "+" : "";
  const randomNumber = faker.string.numeric(
    faker.number.int({ min: 8, max: 15 }),
  );
  return `${countryCode}${randomNumber}`;
}

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
        const patients = await User.find();

        const doctorsIds = doctors.map((doctor) => doctor._id);
        const patientsIds = patients
          .map((patient) => {
            if (patient.role === "patient") {
              return patient._id;
            }
          })
          .filter((p) => p);

        for (let i = 0; i < documentNumbers; i++) {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          const doctorIndex = Math.floor(Math.random() * doctorsIds.length);
          const patientIndex = Math.floor(Math.random() * patientsIds.length);

          let newConsultation = {
            date: DateTime.fromJSDate(faker.date.anytime()).toFormat(
              "dd-MM-yyyy",
            ),
            time: DateTime.now(faker.date.anytime()).toFormat("HH:mm"),
            firstName,
            lastName,
            address: faker.location.streetAddress(true),
            phone: generateRandomNumber(),
            age: faker.number.int({ min: 18, max: 100 }).toString(),
            weight: faker.number.int({ min: 20, max: 150 }).toString(),
            dateInsurance: DateTime.fromJSDate(faker.date.anytime()).toFormat(
              "dd-MM-yyyy",
            ),
            doctor: doctorsIds[doctorIndex],
            patient: patientsIds[patientIndex],
            type: "type",
            provider: "provider",
            police: "police",
          };

          consultations.push(newConsultation);
        }

        await Consultation.collection.insertMany(consultations);

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
