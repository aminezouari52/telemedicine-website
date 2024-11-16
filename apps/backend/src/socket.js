const { Server } = require("socket.io");
const cron = require("node-cron");
const { Consultation } = require("./models");
const config = require("./config/config");
const logger = require("./config/logger");

const scheduleCronJob = (io) => {
  cron.schedule("* * * * *", async () => {
    logger.info("Cron job: Schedule consultation");

    const consultations = await Consultation.find({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date(),
      },
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

  cron.schedule("* * * * *", async () => {
    logger.info("Cron job: Clean old consultations");

    const consultations = await Consultation.find({
      date: { $lt: new Date().setHours(0, 0, 0, 0) },
      status: "pending",
    });

    consultations.forEach((consultation) => {
      consultation.status = "canceled";
      consultation.save();
    });
  });
};

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://bucolic-malabi-07ed64.netlify.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("socket.io connected");

    scheduleCronJob(io);

    socket.on("joinConsultation", ({ consultationId }) => {
      socket.join(consultationId);
    });

    socket.on("sendMessage", ({ consultationId, message, userFirstName }) => {
      io.to(consultationId).emit("receiveMessage", {
        userFirstName,
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
