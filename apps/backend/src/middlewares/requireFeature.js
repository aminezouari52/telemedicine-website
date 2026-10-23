const httpStatus = require("http-status");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

const SERVICE_NAMES = {
  payments: "Stripe (payments)",
  video: "LiveKit (video consultations)",
  uploads: "Cloudinary (image uploads)",
  ai: "Gemini (AI assistant)",
};

// Answers 503 when the optional service behind a route has no keys set
// (see `features` in config/config.js).
const requireFeature = (feature) => (req, res, next) => {
  if (config.features[feature]) return next();
  next(
    new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      `${SERVICE_NAMES[feature]} is not configured on this server`,
    ),
  );
};

module.exports = requireFeature;
