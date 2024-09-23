const express = require("express");

const router = express.Router();

// middlewares
const {
  submitConsultation,
} = require("../../controllers/consultation.controller");

// routes
router.post("/", submitConsultation);

module.exports = router;
