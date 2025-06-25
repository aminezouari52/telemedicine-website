const express = require("express");

const router = express.Router();

const livekitController = require("../../controllers/livekit.controller");

router.route("/token").get(livekitController.token);

module.exports = router;
