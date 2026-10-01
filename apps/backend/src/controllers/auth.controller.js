const httpStatus = require("http-status");
const { authService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const loginUser = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.user);
  res.status(httpStatus.CREATED).send(user);
});

const getCurrentUser = catchAsync(async (req, res) => {
  const email = req.user.email;
  const user = await authService.getCurrentUser(email);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  loginUser,
  getCurrentUser,
};
