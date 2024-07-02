const express = require("express");

const router = express.Router();

// middlewares
const { submitReservation } = require("../controllers/patient");

// routes
router.post("/patient/submit", submitReservation);

module.exports = router;
