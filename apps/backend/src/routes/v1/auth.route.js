const express = require("express");
const authCheck = require("../../middlewares/auth");
// const { adminCheck } = require("../../middlewares/auth");

const router = express.Router();

const authController = require("../../controllers/auth.controller");

router
  .route("/create-or-update-user")
  .post(authCheck, authController.createOrUpdateUser);

router.route("/current-user").post(authCheck, authController.currentUser);

module.exports = router;
