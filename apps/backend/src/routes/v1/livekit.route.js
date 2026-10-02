const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const livekitController = require("../../controllers/livekit.controller");

router.route("/token").get(authCheck, livekitController.token);

module.exports = router;
