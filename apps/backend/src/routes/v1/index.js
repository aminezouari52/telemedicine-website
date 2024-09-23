const express = require("express");
const authRoute = require("./auth.route");
const consultationRoute = require("./consultation.route");
const doctorRoute = require("./doctor.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/doctors",
    route: doctorRoute,
  },
  {
    path: "/consultation",
    route: consultationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
