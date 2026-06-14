const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Patient } = require("../models");
const randomPhone = require("../utils/randomPhone");

const documentNumbers = 20;

async function seedPatientCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await Patient.deleteMany({ role: "patient" }).exec();

        const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        const genders = ["Male", "Female", "Other"];
        const allergyPool = [
          "Penicillin",
          "Peanuts",
          "Pollen",
          "Latex",
          "Aspirin",
          "Shellfish",
          "Dust mites",
        ];
        const conditionPool = [
          "Hypertension",
          "Type 2 diabetes",
          "Asthma",
          "Hypothyroidism",
          "Migraine",
          "Arthritis",
        ];
        const medicationPool = [
          "Metformin",
          "Lisinopril",
          "Atorvastatin",
          "Levothyroxine",
          "Ventolin",
          "Ibuprofen",
        ];

        // Keep a stable testing account (must match a Firebase Auth user)
        // so it survives reseeds and can always log in.
        const testPatientEmail = "christop_hagenes21@gmail.com";

        let patients = [];

        for (let i = 0; i < documentNumbers; i++) {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();

          let newPatient = {
            email:
              i === 0
                ? testPatientEmail
                : faker.internet.email(firstName, lastName),
            firstName,
            lastName,
            age: faker.number.int({ min: 18, max: 100 }),
            address: faker.location.streetAddress(true),
            city: faker.location.city(),
            zip: faker.location.zipCode("#####"),
            weight: faker.number.int({ min: 20, max: 150 }).toString(),
            height: faker.number.int({ min: 150, max: 200 }).toString(),
            gender: faker.helpers.arrayElement(genders),
            bloodType: faker.helpers.arrayElement(bloodTypes),
            allergies: faker.helpers.arrayElements(allergyPool, {
              min: 0,
              max: 3,
            }),
            chronicConditions: faker.helpers.arrayElements(conditionPool, {
              min: 0,
              max: 2,
            }),
            currentMedications: faker.helpers.arrayElements(medicationPool, {
              min: 0,
              max: 2,
            }),
            emergencyContactName: faker.person.fullName(),
            emergencyContactPhone: randomPhone(),
            phone: randomPhone(),
            role: "patient",
            isProfileCompleted: true,
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
