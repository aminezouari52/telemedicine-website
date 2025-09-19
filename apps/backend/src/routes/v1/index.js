const express = require("express");
const authRoute = require("./auth.route");
const doctorRoute = require("./doctor.route");
const patientRoute = require("./patient.route");
const consultationRoute = require("./consultation.route");
const livekitRoute = require("./livekit.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/doctor",
    route: doctorRoute,
  },
  {
    path: "/patient",
    route: patientRoute,
  },
  {
    path: "/consultation",
    route: consultationRoute,
  },
  {
    path: "/livekit",
    route: livekitRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
