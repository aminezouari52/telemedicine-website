const httpStatus = require("http-status");
const { Doctor, Patient } = require("../models");
const ApiError = require("../utils/ApiError");

const getDoctors = async (status) => {
  const filter = {};
  if (status) {
    filter.approvalStatus = status;
  }
  const doctors = await Doctor.find(filter).sort({ createdAt: -1 }).exec();
  return { results: doctors, totalResults: doctors.length };
};

const updateDoctorStatus = async (id, status) => {
  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { approvalStatus: status },
    { new: true },
  ).exec();

  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  return doctor;
};

const updateDoctorProfile = async (id, body) => {
  const doctor = await Doctor.findByIdAndUpdate(id, body, { new: true }).exec();

  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  return doctor;
};

const getPatients = async (name) => {
  const filter = { role: "patient" };
  if (name && name.trim()) {
    filter.$or = [
      { firstName: { $regex: name, $options: "i" } },
      { lastName: { $regex: name, $options: "i" } },
      { email: { $regex: name, $options: "i" } },
    ];
  }
  const patients = await Patient.find(filter).sort({ createdAt: -1 }).exec();
  return { results: patients, totalResults: patients.length };
};

const getPatient = async (id) => {
  const patient = await Patient.findById(id).exec();
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

const updatePatient = async (id, body) => {
  const patient = await Patient.findByIdAndUpdate(id, body, {
    new: true,
  }).exec();
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndDelete(id).exec();
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  return patient;
};

module.exports = {
  getDoctors,
  updateDoctorStatus,
  updateDoctorProfile,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
