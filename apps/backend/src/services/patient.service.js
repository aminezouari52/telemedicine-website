const httpStatus = require("http-status");
const { Patient } = require("../models");
const ApiError = require("../ApiError");

const updatePatient = async (id, body) => {
  const patient = await Patient.findByIdAndUpdate(id, body, {
    new: true,
  }).exec();
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

module.exports = {
  updatePatient,
};
