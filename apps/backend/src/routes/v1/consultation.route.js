const express = require("express");

const router = express.Router();

// middlewares
const {
  submitConsultation,
  getPatientConsultations,
} = require("../../controllers/consultation.controller");

// routes
router.post("/", submitConsultation);

router.get("/:patientId", getPatientConsultations);

module.exports = router;
