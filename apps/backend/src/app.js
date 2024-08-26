const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
// const passport = require('passport');
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
// const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const bodyParser = require("body-parser");
const os = require("os");
const formData = require("express-form-data");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// // parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize());

// gzip compression
app.use(compression());

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
// parse data with connect-multiparty.
app.use(formData.parse(options));

// enable cors
app.use(cors());
app.options("*", cors());

// // jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
