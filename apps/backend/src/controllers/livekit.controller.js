const httpStatus = require("http-status");
const { livekitService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const getCurrentUser = require("../utils/getCurrentUser");

const token = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  const token = await livekitService.generateConsultationToken(
    req.query.consultationId,
    user,
  );
  res.status(httpStatus.OK).send(token);
});

module.exports = {
  token,
};
