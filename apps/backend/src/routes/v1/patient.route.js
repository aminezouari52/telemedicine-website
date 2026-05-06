const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const patientController = require("../../controllers/patient.controller");

router.route("/ai").post(patientController.askAi);
router.route("/:id").patch(authCheck, patientController.updatePatient);

module.exports = router;
