const express = require("express");

const router = express.Router();

// middlewares
const { createDoctor } = require("../controllers/doctor");

// routes
router.post("/doctor/create", createDoctor);

module.exports = router;
