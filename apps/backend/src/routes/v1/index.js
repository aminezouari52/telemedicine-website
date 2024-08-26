const express = require("express");
const authRoute = require("./auth.route");
const patientRoute = require("./patient.route");
const doctorRoute = require("./doctor.route");
const docsRoute = require("./docs.route");
const config = require("../../config/config");

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
  // {
  //   path: "/patients",
  //   route: patientRoute,
  // },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
