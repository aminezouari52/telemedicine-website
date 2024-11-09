const httpStatus = require("http-status");
const { Patient } = require("../models");
const ApiError = require("../utils/ApiError");

const updatePatient = async (id, body) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  Object.assign(patient, body);
  await patient.save();
  return patient;
};

module.exports = {
  updatePatient,
};
