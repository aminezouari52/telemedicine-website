const express = require("express");
const { paymentController } = require("../../controllers");
const authCheck = require("../../middlewares/auth");
const requireFeature = require("../../middlewares/requireFeature");

const router = express.Router();

router.use(requireFeature("payments"));

router.post(
  "/create-checkout-session",
  authCheck,
  paymentController.createCheckoutSession,
);

router.post("/confirm-payment", paymentController.confirmPayment);

module.exports = router;
