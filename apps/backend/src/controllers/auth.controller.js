const httpStatus = require("http-status");
const { authService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const loginUser = catchAsync(async (req, res) => {
  const { email } = req.user;
  const user = await authService.loginUser(email);
  res.status(httpStatus.CREATED).send(user);
});

const registerUser = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const user = await authService.registerUser(email, role);
  res.status(httpStatus.CREATED).send(user);
});

const getCurrentUser = catchAsync(async (req, res) => {
  const email = req.user.email;
  const user = await authService.getCurrentUser(email);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  loginUser,
  registerUser,
  getCurrentUser,
};
