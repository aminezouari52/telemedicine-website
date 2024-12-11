// require the necessary libraries
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Doctor } = require("../models");
const randomPhone = require("../utils/randomPhone");

const documentNumbers = 20;

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const specialities = [
  "Generalist",
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
];

const experiences = ["Less than a year", "1 - 5 years", "+5 years"];
const hospitals = [
  "Hospital Mongi Slim",
  "Hospital Charles Nicolle",
  "Hospital La Rabta",
  "Hospital Razi",
  "Hospital Sahloul",
  "Hospital Farhat Hached",
  "Hospital Fattouma Bourguiba",
  "Hospital Hédi Chaker",
  "Hospital Habib Bourguiba",
];

const degrees = [
  "Docteur en Médecine (MD)",
  "Docteur en Médecine Ostéopathique (DO)",
  "Licence de Médecine et de Chirurgie (MBBS)",
  "Docteur en Chirurgie Dentaire (DDS)",
  "Docteur en Pharmacie (PharmD)",
  "Docteur en Médecine Podiatrique (DPM)",
  "Docteur en Optométrie (OD)",
  "Docteur en Médecine Vétérinaire (DVM)",
  "Docteur en Santé Publique (DrPH)",
];

const certificats = [
  "Certificat en Cardiologie",
  "Certificat en Chirurgie Générale",
  "Certificat en Dermatologie",
  "Certificat en Pédiatrie",
  "Certificat en Gynécologie-Obstétrique",
  "Certificat en Anesthésiologie",
  "Certificat en Médecine Interne",
  "Certificat en Radiologie",
  "Certificat en Oncologie",
];

const schedule = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

async function seedDoctorCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await Doctor.deleteMany({ role: "doctor" }).exec();

        let doctors = [];

        for (let i = 0; i < documentNumbers; i++) {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          const specialtyIndex = Math.floor(
            Math.random() * specialities.length
          );
          const experienceIndex = Math.floor(
            Math.random() * experiences.length
          );
          const hospitalIndex = Math.floor(Math.random() * hospitals.length);
          const randomParam = Math.random();
          const gender = randomParam > 0.3 ? "male" : "female";
          const profileUrl = `https://xsgames.co/randomusers/avatar.php?g=${gender}&random=${randomParam}`;

          let newDoctor = {
            specialty: specialities[specialtyIndex],
            degrees: [],
            certifications: [],
            schedule: [],
            email: faker.internet.email(firstName, lastName),
            role: "doctor",
            address: faker.location.streetAddress(true),
            age: faker.number.int({ min: 18, max: 100 }),
            city: faker.location.city(),
            description: faker.lorem.lines({ min: 2, max: 4 }),
            experience: experiences[experienceIndex],
            firstName,
            hospital: hospitals[hospitalIndex],
            lastName,
            phone: randomPhone(),
            price: faker.number.int({ min: 1, max: 1000 }),
            zip: faker.location.zipCode("#####"),
            photo: profileUrl,
            isProfileCompleted: true,
          };

          // array
          for (let j = 0; j < randomIntFromInterval(1, 5); j++) {
            const newDegree =
              degrees[Math.floor(Math.random() * degrees.length)];
            const newCertfication =
              certificats[Math.floor(Math.random() * certificats.length)];
            newDoctor.degrees.push(newDegree);
            newDoctor.certifications.push(newCertfication);
          }

          for (let k = 0; k < randomIntFromInterval(1, 7); k++) {
            const emploiDisponible = schedule.filter(
              (jour) => !newDoctor.schedule.includes(jour)
            );
            const nouvelEmploi =
              emploiDisponible[
                Math.floor(Math.random() * emploiDisponible.length)
              ];
            newDoctor.schedule.push(nouvelEmploi);
          }

          doctors.push(newDoctor);
        }

        await Doctor.create(doctors);

        logger.info("Doctor model seeded! :)");

        server.close();
        process.exit();
      });
    });
  } catch (err) {
    console.log(err.stack);
  }
}

seedDoctorCollection();
