const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/recommendation");

router.get("/recommendations", getRecommendations);

module.exports = router;
