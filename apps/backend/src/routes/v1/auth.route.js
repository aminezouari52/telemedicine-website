const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const authController = require("../../controllers/auth.controller");

// Creates the MongoDB user on first sign-in (see authService.loginUser).
router.route("/login-user").get(authCheck, authController.loginUser);

router.route("/current-user").post(authCheck, authController.getCurrentUser);

module.exports = router;
