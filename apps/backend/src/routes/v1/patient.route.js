const express = require("express");
const authCheck = require("../../middlewares/auth");

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

router.route("/:id").patch(authCheck, patientController.updatePatient);

module.exports = router;
