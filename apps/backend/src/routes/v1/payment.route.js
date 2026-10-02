const express = require("express");
const { paymentController } = require("../../controllers");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/create-checkout-session",
  authCheck,
  paymentController.createCheckoutSession,
);

router.post("/confirm-payment", paymentController.confirmPayment);

module.exports = router;
