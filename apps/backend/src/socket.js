// socket.js
const { Server } = require("socket.io");
const cron = require("node-cron");
const getCurrentDateAndTime = require("./utils/utils");
const { Consultation } = require("./models");
const config = require("./config/config");
const logger = require("./config/logger");

const scheduleCronJob = (io) => {
  cron.schedule("* * * * *", async () => {
    logger.info("Cron job run");

    const { currentDate, currentTime } = getCurrentDateAndTime();
    const consultations = await Consultation.find({
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
};

function initializeSocket(server) {
  const io = new Server(server, config.socket);

  io.on("connection", (socket) => {
    logger.info("socket.io connected");

    scheduleCronJob(io);

    socket.on("joinConsultation", ({ consultationId, userId }) => {
      socket.join(consultationId);
      logger.info(`User ${userId} joined consultation: ${consultationId}`);
      socket.to(consultationId).emit("notifyJoin", userId);
    });

    socket.on("sendMessage", ({ consultationId, message, user }) => {
      io.to(consultationId).emit("receiveMessage", {
        user: user,
        message: message,
      });
    });

    socket.on("leaveConsultation", ({ consultationId, userId }) => {
      socket.leave(consultationId);
      io.to(consultationId).emit("otherUserLeft", {
        userId,
      });
      logger.info(`User left consultation: ${consultationId}`);
    });

    socket.on("disconnect", () => {
      logger.warn("socket.io disconnected");
    });
  });
}

module.exports = initializeSocket;
