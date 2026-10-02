const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("./ApiError");

const getCurrentUser = async (req) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

module.exports = getCurrentUser;
