const express = require("express");
const authRoute = require("./auth.route");
const consultationRoute = require("./consultation.route");
const doctorRoute = require("./doctor.route");
const messageRoute = require("./message.route");

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
    path: "/consultation",
    route: consultationRoute,
  },
  { path: "/", route: messageRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
