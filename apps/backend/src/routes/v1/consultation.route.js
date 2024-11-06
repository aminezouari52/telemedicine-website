const express = require("express");

const router = express.Router();

// middlewares
const consultationController = require("../../controllers/consultation.controller");

// routes
router.route("/").post(consultationController.submitConsultation);

router
  .route("/:id")
  .patch(consultationController.updateConsultation)
  .get(consultationController.getConsultation);

router
  .route("/patient/:patientId")
  .get(consultationController.getPatientConsultations);

router
  .route("/doctor/:doctorId")
  .get(consultationController.getDoctorConsultations);

module.exports = router;
