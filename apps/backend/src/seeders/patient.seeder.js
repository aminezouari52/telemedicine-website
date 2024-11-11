const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Patient } = require("../models");
const { generatePhoneNumber } = require("../utils/utils");

const documentNumbers = 20;

async function seedPatientCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await Patient.deleteMany({ role: "patient" }).exec();

        let patients = [];

        for (let i = 0; i < documentNumbers; i++) {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();

          let newPatient = {
            email: faker.internet.email(firstName, lastName),
            firstName,
            lastName,
            age: faker.number.int({ min: 18, max: 100 }),
            address: faker.location.streetAddress(true),
            city: faker.location.city(),
            zip: faker.location.zipCode("#####"),
            weight: faker.number.int({ min: 20, max: 150 }).toString(),
            phone: generatePhoneNumber(),
            role: "patient",
          };

          patients.push(newPatient);
        }

        await Patient.create(patients);

        console.log("Patient model seeded! :)");

        // close database and exit process
        server.close();
        process.exit();
      });
    });
  } catch (err) {
    console.log(err.stack);
  }
}

seedPatientCollection();
