const cron = require("node-cron");
const { Consultation } = require("../models");
const logger = require("../config/logger");
const getHourRange = require("../utils/getHourRange");

// save(), not updateMany(): the post-save hook re-syncs the RAG embedding.
const setStatus = async (filter, status) => {
  const consultations = await Consultation.find(filter);
  await Promise.all(
    consultations.map((consultation) => {
      consultation.status = status;
      return consultation.save();
    }),
  );
};

const closePastConsultations = async () => {
  const { startHour } = getHourRange();
  const past = { date: { $lt: startHour } };
  await setStatus({ ...past, status: "in-progress" }, "completed");
  await setStatus({ ...past, status: "pending" }, "canceled");
};

const scheduleConsultationJobs = () => {
  cron.schedule("0 * * * *", async () => {
    logger.info("Cron job: Close past consultations");
    try {
      await closePastConsultations();
    } catch (err) {
      logger.error(
        `Cron job "Close past consultations" failed: ${err.message}`,
      );
    }
  });
};

module.exports = { scheduleConsultationJobs, closePastConsultations };
