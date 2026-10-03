const express = require("express");
const authCheck = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const doctorValidation = require("../../validations/doctor.validation");

const router = express.Router();

const doctorController = require("../../controllers/doctor.controller");

router.route("/").get(doctorController.getAllDoctors);

router
  .route("/:id")
  .patch(
    authCheck,
    validate(doctorValidation.updateDoctor),
    doctorController.updateDoctor,
  );

router
  .route("/profile-image")
  .post(
    authCheck,
    validate(doctorValidation.uploadProfilePicture),
    doctorController.uploadProfilePicture,
  );

router.route("/:doctorId").get(doctorController.getDoctor);

router
  .route("/patients/:doctorId")
  .get(doctorController.getDoctorPatientsCount);

module.exports = router;
