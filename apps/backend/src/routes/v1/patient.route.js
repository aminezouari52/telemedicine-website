const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const patientController = require("../../controllers/patient.controller");

router.route("/:id").patch(authCheck, patientController.updatePatient);

module.exports = router;
