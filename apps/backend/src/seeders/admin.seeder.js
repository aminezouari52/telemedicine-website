const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { User } = require("../models");

const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "adminadmin";

async function createFirebaseUser() {
  try {
    const admin = require("../firebase");
    const firebaseUser = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
    });
    logger.info(`Firebase account created: ${firebaseUser.email}`);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      logger.warn(`Firebase account already exists for ${adminEmail}`);
    } else {
      logger.warn(`Could not create Firebase account (${err.message})`);
      logger.warn("You can register manually via the signup page.");
    }
  }
}

async function seedAdmin() {
  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        logger.info(`Seeding admin: ${adminEmail}`);

        await createFirebaseUser();

        await User.deleteOne({ email: adminEmail }).exec();

        await User.collection.insertOne({
          email: adminEmail,
          role: "admin",
          isProfileCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        logger.info(`Admin user seeded: ${adminEmail}`);
        logger.info(`Password: ${adminPassword}`);

        server.close();
        process.exit();
      });
    });
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
}

seedAdmin();
