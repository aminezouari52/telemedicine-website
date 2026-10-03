const catchAsync = require("../utils/catchAsync");
const { doctorService } = require("../services");
const cloudinary = require("cloudinary");
const config = require("../config/config");
const pick = require("../utils/pick");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const getCurrentUser = require("../utils/getCurrentUser");
const assertSelf = require("../utils/assertSelf");

cloudinary.config(config.cloudinary);

const getAllDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["hospital", "specialty", "text"]);
  const options = pick(req.query, ["sortBy"]);
  const doctors = await doctorService.getAllDoctors(filter, options);
  res.status(httpStatus.OK).send(doctors);
});

const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctor(req.params.doctorId);
  res.status(httpStatus.OK).send(doctor);
});

// The body only holds fields a doctor may edit (see doctor.validation.js).
const updateDoctor = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  assertSelf(user, req.params.id);
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);
  res.status(httpStatus.OK).send(doctor);
});

const uploadProfilePicture = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  if (user.role !== "doctor") {
    throw new ApiError(httpStatus.FORBIDDEN, "Only doctors have a photo");
  }
  const image = await doctorService.uploadProfilePicture(req.body.image);
  res.status(httpStatus.OK).send(image);
});

const getDoctorPatientsCount = catchAsync(async (req, res) => {
  const patientsCount = await doctorService.getDoctorPatientsCount(
    req.params.doctorId,
  );
  res.status(httpStatus.OK).send({ patientsCount });
});

module.exports = {
  updateDoctor,
  uploadProfilePicture,
  getAllDoctors,
  getDoctor,
  getDoctorPatientsCount,
};
