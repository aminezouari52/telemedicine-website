const express = require("express");
const authCheck = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const patientValidation = require("../../validations/patient.validation");

const router = express.Router();

const patientController = require("../../controllers/patient.controller");

router
  .route("/conversations")
  .get(authCheck, patientController.listConversations)
  .post(authCheck, patientController.createConversation);

router
  .route("/conversations/:convId")
  .patch(authCheck, patientController.updateConversation)
  .delete(authCheck, patientController.deleteConversation);

router
  .route("/medical-context")
  .post(authCheck, patientController.getMedicalContext);

router
  .route("/ai-usage")
  .post(
    authCheck,
    validate(patientValidation.consumeAiUsage),
    patientController.consumeAiUsage,
  );

router
  .route("/:id")
  .patch(
    authCheck,
    validate(patientValidation.updatePatient),
    patientController.updatePatient,
  );

module.exports = router;
