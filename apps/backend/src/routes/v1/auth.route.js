const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const authController = require("../../controllers/auth.controller");

router.route("/login-user").get(authCheck, authController.loginUser);

router.route("/register-user").post(authController.registerUser);

router.route("/current-user").post(authCheck, authController.getCurrentUser);

module.exports = router;
