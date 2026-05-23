const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const os = require("os");
const formData = require("express-form-data");
const { paymentController } = require("./controllers");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

// Stripe webhook needs raw body — must be before express.json()
app.post(
  "/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(mongoSanitize());
app.use(compression());

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
app.use(formData.parse(options));

app.use(cors());
app.options("*", cors());

app.set("trust proxy", true);

if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

app.use(function (req, res) {
  res.send({ test: "hello world!" });
});

// error handling
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
