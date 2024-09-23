const catchAsync = require("../utils/catchAsync");
const { doctorService } = require("../services");
const cloudinary = require("cloudinary");
const config = require("../config/config");
const pick = require("../utils/pick");

cloudinary.config(config.cloudinary);

const getAllDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["hospital", "specialty", "text"]);
  const options = pick(req.query, ["sortBy"]);
  const doctors = await doctorService.getAllDoctors(filter, options);
  res.json(doctors);
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctorById(req.params.id, req.body);
  res.json(doctor);
});

const uploadProfilePicture = catchAsync(async (req, res) => {
  const image = await doctorService.uploadProfilePicture(req.body.image);
  res.json(image);
});

const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  res.send(doctor);
});

module.exports = {
  updateDoctor,
  uploadProfilePicture,
  getAllDoctors,
  getDoctor,
};
