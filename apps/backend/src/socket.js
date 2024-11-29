const { Server } = require("socket.io");
const cron = require("node-cron");
const { Consultation } = require("./models");
const config = require("./config/config");
const logger = require("./config/logger");
const getHourRange = require("./utils/getHourRange");

const scheduleCronJob = (io) => {
  cron.schedule("*/2 * * * *", async () => {
    logger.info("Cron job: Schedule consultation");

    const { startHour, endHour } = getHourRange();

    const consultations = await Consultation.find({
      date: {
        $gte: startHour,
        $lt: endHour,
      },
      status: "pending",
    });

    consultations.forEach((consultation) => {
      const { patient, doctor, _id } = consultation;

      io.emit("start", {
        consultationId: _id,
        patientId: patient,
        doctorId: doctor,
      });

      consultation.status = "in-progress";
      consultation.save();
    });
  });

  cron.schedule("0 * * * *", async () => {
    logger.info("Cron job: Clean old consultations");

    const { startHour } = getHourRange();

    const consultations = await Consultation.find({
      date: { $lt: startHour },
      status: { $in: ["pending", "in-progress"] },
    });

    consultations.forEach((consultation) => {
      consultation.status = "canceled";
      consultation.save();
    });
  });
};

const connectedUsers = {};

function initializeSocket(server) {
  const io = new Server(server, config.socket);

  io.on("connection", (socket) => {
    logger.info("socket.io connected");

    scheduleCronJob(io);

    socket.on("join", ({ roomId, role, name }) => {
      io.to(roomId).emit("joined", {
        role,
        name,
      });
      connectedUsers[roomId] = {
        ...connectedUsers[roomId],
        [role]: name,
      };
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ roomId, message, name }) => {
      io.to(roomId).emit("receiveMessage", {
        name,
        message,
      });
    });

    socket.on("getUsers", (roomId) => {
      io.to(roomId).emit("sendUsers", connectedUsers[roomId]);
    });

    socket.on("exitPage", ({ roomId, role }) => {
      if (connectedUsers[roomId]) delete connectedUsers[roomId][role];

      io.to(roomId).emit("sendUsers", connectedUsers[roomId]);
    });

    socket.on("leave", (roomId) => {
      io.to(roomId).emit("userLeft");
    });

    socket.on("disconnect", () => {
      logger.warn("socket.io disconnected");
    });
  });
}

module.exports = initializeSocket;
