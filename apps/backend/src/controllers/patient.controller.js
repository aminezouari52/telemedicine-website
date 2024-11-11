const catchAsync = require("../utils/catchAsync");
const { patientService } = require("../services");
const httpStatus = require("http-status");

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  res.status(httpStatus.OK).send(patient);
});

module.exports = {
  updatePatient,
};
