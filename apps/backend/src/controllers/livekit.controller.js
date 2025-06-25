const httpStatus = require("http-status");
const { livekitService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const token = catchAsync(async (req, res) => {
  const { room, identity } = req.query;
  const token = await livekitService.generateToken(room, identity);
  res.status(httpStatus.CREATED).send(token);
});

module.exports = {
  token,
};
