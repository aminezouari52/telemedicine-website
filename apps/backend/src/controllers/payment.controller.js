const Stripe = require("stripe");
const catchAsync = require("../utils/catchAsync");
const { paymentService } = require("../services");
const httpStatus = require("http-status");
const config = require("../config/config");

const stripe = Stripe(config.stripe.secretKey);

const createCheckoutSession = catchAsync(async (req, res) => {
  const { doctorId, patientId, date } = req.body;
  const result = await paymentService.createCheckoutSession({
    doctorId,
    patientId,
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

const getPaymentStatus = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const payment = await paymentService.getPaymentBySessionId(sessionId);
  res.status(httpStatus.OK).send(payment);
});

const confirmPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.body;
  const payment = await paymentService.confirmPayment(sessionId);
  res.status(httpStatus.OK).send(payment);
});

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus,
  confirmPayment,
};
