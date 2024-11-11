const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const consultationController = require("../../controllers/consultation.controller");

router.route("/").post(consultationController.createConsultation);

router
  .route("/:id")
  .patch(authCheck, consultationController.updateConsultation)
  .get(consultationController.getConsultation);

router
  .route("/patient/:patientId")
  .get(consultationController.getPatientConsultations);

router
  .route("/doctor/:doctorId")
  .get(consultationController.getDoctorConsultations);

module.exports = router;
