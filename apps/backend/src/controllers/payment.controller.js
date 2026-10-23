const Stripe = require("stripe");
const catchAsync = require("../utils/catchAsync");
const { paymentService } = require("../services");
const httpStatus = require("http-status");
const config = require("../config/config");
const getCurrentUser = require("../utils/getCurrentUser");

// Null when Stripe isn't configured; the payment routes answer 503 then.
const stripe = config.features.payments
  ? Stripe(config.stripe.secretKey)
  : null;

const createCheckoutSession = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  const { doctorId, date } = req.body;
  const result = await paymentService.createCheckoutSession(user, {
    doctorId,
    date,
  });
  res.status(httpStatus.OK).send(result);
});

const handleWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret,
    );
  } catch (err) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(`Webhook Error: ${err.message}`);
  }

  await paymentService.handleWebhookEvent(event);
  res.status(httpStatus.OK).send({ received: true });
});

const confirmPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.body;
  const payment = await paymentService.confirmPayment(sessionId);
  res.status(httpStatus.OK).send(payment);
});

module.exports = {
  createCheckoutSession,
  handleWebhook,
  confirmPayment,
};
