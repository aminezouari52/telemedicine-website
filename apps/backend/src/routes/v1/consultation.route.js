const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const consultationController = require("../../controllers/consultation.controller");

router.route("/").post(authCheck, consultationController.createConsultation);

router
  .route("/:id/complete")
  .post(authCheck, consultationController.completeConsultation);

router
  .route("/patient/:patientId")
  .get(authCheck, consultationController.getPatientConsultations);

router
  .route("/doctor/:doctorId")
  .get(authCheck, consultationController.getDoctorConsultations);

module.exports = router;
