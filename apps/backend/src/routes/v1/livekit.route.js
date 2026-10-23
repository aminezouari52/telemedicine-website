const express = require("express");
const authCheck = require("../../middlewares/auth");
const requireFeature = require("../../middlewares/requireFeature");

const router = express.Router();

const livekitController = require("../../controllers/livekit.controller");

router
  .route("/token")
  .get(requireFeature("video"), authCheck, livekitController.token);

module.exports = router;
