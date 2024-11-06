// socket.js
const { Server } = require("socket.io");
const cron = require("node-cron");
const getCurrentDateAndTime = require("./utils/utils");
const { Consultation } = require("./models");
const config = require("./config/config");
const logger = require("./config/logger");

const scheduleCronJob = (io) => {
  cron.schedule("*/5 * * * * *", async () => {
    logger.info("Cron job: Schedule consultation");

    const { currentDate, currentTime } = getCurrentDateAndTime();
    const consultations = await Consultation.find({
      // TODO: make sure this works after the dates updates
      date: currentDate,
      time: { $lte: currentTime },
      status: "pending",
    });

    consultations.forEach((consultation) => {
      const { patient, doctor, _id } = consultation;

      io.emit("startConsultation", {
        consultationId: _id,
        patientId: patient,
        doctorId: doctor,
      });

      consultation.status = "in-progress";
      consultation.save();
    });
  });

  /* TODO: update date in all the app
   * - make sure dates are stored in `Date` format in mongoDB (and mongoose)
   * - make sure in frontend all dates are stored in the database in the javascript Date format
   * - when consumed dates should be formatted in the approriate way
   * - ideally in frontend dates should be displayed as "DD-MM-YYYY" , "HH:MM"
   * - after that done make sure the  "Cron job: Clean old consultations" works as expected
   */

  // cron.schedule("*/5 * * * * *", async () => {
  //   logger.info("Cron job: Clean old consultations");

  //   const { currentDate } = getCurrentDateAndTime();

  //   const consultations = await Consultation.find({
  //     date: { $lte: currentDate },
  //     status: "pending",
  //   });

  //   consultations.forEach((consultation) => {
  //     console.log(consultation.date);

  //     consultation.status = "canceled";
  //     consultation.save();
  //   });
  // });
};

function initializeSocket(server) {
  const io = new Server(server, config.socket);

  io.on("connection", (socket) => {
    logger.info("socket.io connected");

    scheduleCronJob(io);

    socket.on("joinConsultation", ({ consultationId, userId }) => {
      socket.join(consultationId);
    });

    socket.on("sendMessage", ({ consultationId, message, userId }) => {
      io.to(consultationId).emit("receiveMessage", {
        userId,
        message,
      });
    });

    socket.on("leaveConsultation", ({ consultationId }) => {
      io.to(consultationId).emit("userLeft");
    });

    socket.on("disconnect", () => {
      logger.warn("socket.io disconnected");
    });
  });
}

module.exports = initializeSocket;
