const express = require("express");
const { paymentController } = require("../../controllers");

const router = express.Router();

router.post(
  "/create-checkout-session",
  paymentController.createCheckoutSession,
);

router.post("/confirm-payment", paymentController.confirmPayment);

router.get("/session/:sessionId", paymentController.getPaymentStatus);

module.exports = router;
