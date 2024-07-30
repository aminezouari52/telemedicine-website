const express = require("express");

const router = express.Router();

// middlewares
const { submitConsultation } = require("../../controllers/patient");

// routes
router.post("/patient/submit", submitConsultation);

module.exports = router;
