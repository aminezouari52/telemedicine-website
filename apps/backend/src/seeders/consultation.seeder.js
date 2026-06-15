const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { Doctor, Consultation, Patient, Payment } = require("../models");

const documentNumbers = 4000;

// Drop a collection without throwing when it doesn't exist yet (fresh DB).
async function dropIfExists(model) {
  try {
    await model.collection.drop();
  } catch (err) {
    // 26 / NamespaceNotFound: collection was never created — nothing to drop.
    if (err.code !== 26 && err.codeName !== "NamespaceNotFound") {
      throw err;
    }
  }
}

// In this app a consultation only exists after its payment is confirmed, so
// seeded consultations should always carry a payment. Correlate the payment
// status with the consultation status: a canceled consult may have been
// refunded, everything else is paid.
function paymentStatusFor(consultationStatus) {
  if (consultationStatus === "canceled") {
    return faker.helpers.arrayElement(["refunded", "paid"]);
  }
  return "paid";
}

async function seedConsultationCollection() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        await dropIfExists(Consultation);
        await dropIfExists(Payment);

        let consultations = [];
        let payments = [];

        // Only assign consultations to presentable accounts: approved,
        // profile-completed doctors and profile-completed patients. Real
        // (incomplete) signups otherwise surface in the consultation lists as
        // "Dr. " with no name, photo, or specialty.
        const doctors = await Doctor.find({
          approvalStatus: "approved",
          isProfileCompleted: true,
        });
        const patients = await Patient.find({ isProfileCompleted: true });

        if (!doctors.length || !patients.length) {
          throw new Error(
            `Cannot seed consultations: need at least one complete doctor and patient ` +
              `(have ${doctors.length} doctors, ${patients.length} patients). Seed doctors/patients first.`,
          );
        }

        // A consultation's status has to agree with its date: a slot in the
        // past can only be completed (mostly) or canceled, while a future slot
        // is still pending (mostly) or canceled. Anything within the current
        // hour is in-progress. Randomising status independently of the date is
        // what produced nonsense like a "pending" appointment months ago.
        const HOUR_MS = 60 * 60 * 1000;
        const now = Date.now();
        const statusForDate = (date) => {
          const t = date.getTime();
          if (t < now - HOUR_MS) {
            return faker.helpers.weightedArrayElement([
              { value: "completed", weight: 8 },
              { value: "canceled", weight: 2 },
            ]);
          }
          if (t > now + HOUR_MS) {
            return faker.helpers.weightedArrayElement([
              { value: "pending", weight: 8 },
              { value: "canceled", weight: 2 },
            ]);
          }
          return "in-progress";
        };

        for (let i = 0; i < documentNumbers; i++) {
          const doctor = doctors[Math.floor(Math.random() * doctors.length)];
          const patient = patients[Math.floor(Math.random() * patients.length)];

          const date = new Date(
            new Date(
              faker.date.between({
                from: "2026-01-01T00:00:00.000Z",
                to: "2026-12-01T00:00:00.000Z",
              }),
            ).setMinutes(0, 0, 0),
          );

          const status = statusForDate(date);

          // Pre-generate ids so consultation <-> payment can reference each
          // other without a second pass of updates.
          const consultationId = new mongoose.Types.ObjectId();
          const paymentId = new mongoose.Types.ObjectId();

          // Bill the doctor's configured rate; fall back to a sane range for
          // any doctor seeded without a price.
          const amount =
            doctor.price && doctor.price > 0
              ? doctor.price
              : faker.number.int({ min: 20, max: 300 });
          const paymentStatus = paymentStatusFor(status);

          consultations.push({
            _id: consultationId,
            date,
            status,
            doctor: doctor._id,
            patient: patient._id,
            payment: paymentId,
          });

          payments.push({
            _id: paymentId,
            stripeSessionId: `cs_test_seed_${i}_${faker.string.alphanumeric(20)}`,
            stripePaymentIntentId: `pi_seed_${i}_${faker.string.alphanumeric(20)}`,
            amount,
            currency: "usd",
            status: paymentStatus,
            patient: patient._id,
            doctor: doctor._id,
            consultation: consultationId,
            metadata: { date, seeded: true },
          });
        }

        await Payment.create(payments);
        await Consultation.create(consultations);

        console.log("Consultation + Payment collections seeded! :)");

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
