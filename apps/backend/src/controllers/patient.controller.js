const catchAsync = require("../utils/catchAsync");
const { patientService } = require("../services");

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  res.json(patient);
});

module.exports = {
  updatePatient,
};
