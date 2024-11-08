const catchAsync = require("../utils/catchAsync");
const { doctorService } = require("../services");
const cloudinary = require("cloudinary");
const config = require("../config/config");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

cloudinary.config(config.cloudinary);

const getAllDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["hospital", "specialty", "text"]);
  const options = pick(req.query, ["sortBy"]);
  const doctors = await doctorService.getAllDoctors(filter, options);
  res.json(doctors);
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);
  res.json(doctor);
});

const uploadProfilePicture = catchAsync(async (req, res) => {
  const image = await doctorService.uploadProfilePicture(req.body.image);
  res.json(image);
});

const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctor(req.params.doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  res.send(doctor);
});

const getDoctorPatientsCount = catchAsync(async (req, res) => {
  const patientsCount = await doctorService.getDoctorPatientsCount(
    req.params.doctorId,
  );
  res.send({ patientsCount });
});

module.exports = {
  updateDoctor,
  uploadProfilePicture,
  getAllDoctors,
  getDoctor,
  getDoctorPatientsCount,
};
