const catchAsync = require("../utils/catchAsync");
const { doctorService } = require("../services");
const cloudinary = require("cloudinary");
const config = require("../config/config");

cloudinary.config(config.cloudinary);

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctorById(req.params.id, req.body);
  res.json(doctor);
});

const uploadProfilePicture = catchAsync(async (req, res) => {
  const image = await doctorService.uploadProfilePicture(req.body.image);
  res.json(image);
});

module.exports = {
  updateDoctor,
  uploadProfilePicture,
};
