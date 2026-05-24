const httpStatus = require("http-status");
const { adminService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getDoctors = catchAsync(async (req, res) => {
  const { status } = req.query;
  const doctors = await adminService.getDoctors(status);
  res.status(httpStatus.OK).send(doctors);
});

const updateDoctorStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const doctor = await adminService.updateDoctorStatus(id, status);
  res.status(httpStatus.OK).send(doctor);
});

const updateDoctorProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doctor = await adminService.updateDoctorProfile(id, req.body);
  res.status(httpStatus.OK).send(doctor);
});

const getPatients = catchAsync(async (req, res) => {
  const { name } = req.query;
  const patients = await adminService.getPatients(name);
  res.status(httpStatus.OK).send(patients);
});

const getPatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const patient = await adminService.getPatient(id);
  res.status(httpStatus.OK).send(patient);
});

const updatePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const patient = await adminService.updatePatient(id, req.body);
  res.status(httpStatus.OK).send(patient);
});

const deletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const patient = await adminService.deletePatient(id);
  res.status(httpStatus.OK).send(patient);
});

module.exports = {
  getDoctors,
  updateDoctorStatus,
  updateDoctorProfile,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
