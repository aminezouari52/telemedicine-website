const httpStatus = require("http-status");
const ApiError = require("./ApiError");

// Throws 403 unless `id` (a route param) is the signed-in user's own id.
const assertSelf = (user, id) => {
  if (String(user._id) !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
};

module.exports = assertSelf;
