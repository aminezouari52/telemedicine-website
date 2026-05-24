const express = require("express");
const authCheck = require("../../middlewares/auth");
const adminCheck = require("../../middlewares/adminAuth");

const router = express.Router();

const adminController = require("../../controllers/admin.controller");

router.use(authCheck, adminCheck);

router.route("/doctors").get(adminController.getDoctors);

router.route("/doctors/:id/status").patch(adminController.updateDoctorStatus);

router.route("/doctors/:id/profile").patch(adminController.updateDoctorProfile);

router.route("/patients").get(adminController.getPatients);

router.route("/patients/:id").get(adminController.getPatient);

router.route("/patients/:id").patch(adminController.updatePatient);

router.route("/patients/:id").delete(adminController.deletePatient);

module.exports = router;
