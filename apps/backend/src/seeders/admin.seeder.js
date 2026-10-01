const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const express = require("express");
const app = express();
const { User } = require("../models");

// No fallbacks: a default admin login is a backdoor waiting to be deployed.
// ADMIN_PASSWORD must not be in a public breach list, or Clerk rejects it.
const { email: adminEmail, password: adminPassword } = config.admin;

async function createClerkUser() {
  const { ensureClerkUser, clerkErrorMessage } = require("../clerk");
  try {
    const { created } = await ensureClerkUser(adminEmail, adminPassword);
    logger.info(
      created
        ? `Clerk account created: ${adminEmail}`
        : `Clerk account already exists for ${adminEmail}; password reset`,
    );
  } catch (err) {
    logger.warn(`Could not create Clerk account (${clerkErrorMessage(err)})`);
    logger.warn("You can register manually via the signup page.");
  }
}

async function seedAdmin() {
  if (!adminEmail || !adminPassword) {
    logger.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in apps/backend/.env to seed the admin.",
    );
    process.exit(1);
  }

  let server;
  try {
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
      server = app.listen(config.port, async () => {
        logger.info(`Listening to port ${config.port}`);

        logger.info(`Seeding admin: ${adminEmail}`);

        await createClerkUser();

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
