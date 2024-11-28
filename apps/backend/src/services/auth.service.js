const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const loginUser = async (email) => {
  const user = await User.findOne({ email }).exec();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const registerUser = async (email, role) => {
  const user = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true }
  ).exec();

  if (!user) {
    return await User.create({
      email,
      role,
    });
  }
  return user;
};

const getCurrentUser = async (email) => {
  const user = await User.findOne({ email }).exec();
  return user;
};

module.exports = {
  loginUser,
  registerUser,
  getCurrentUser,
};
