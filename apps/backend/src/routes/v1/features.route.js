const express = require("express");
const httpStatus = require("http-status");
const config = require("../../config/config");

const router = express.Router();

// Public: tells the frontend which optional services are configured.
router.get("/", (req, res) => {
  res.status(httpStatus.OK).send(config.features);
});

module.exports = router;
