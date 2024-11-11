const httpStatus = require("http-status");
const { User } = require("../models");
const { authService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const createOrUpdateUser = catchAsync(async (req, res) => {
  const { email } = req.user;
  const role = req.body.role;
  const user = await authService.createOrUpdateUser(email, role);
  res.status(httpStatus.CREATED).send(user);
});

const getCurrentUser = catchAsync(async (req, res) => {
  const email = req.user.email;
  const user = await authService.getCurrentUser(email);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  createOrUpdateUser,
  getCurrentUser,
};
