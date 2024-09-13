const catchAsync = require("../utils/catchAsync");
const { doctorService } = require("../services");
const cloudinary = require("cloudinary");
const config = require("../config/config");
const pick = require("../utils/pick");

cloudinary.config(config.cloudinary);

const getAllDoctors = catchAsync(async (req, res) => {
  console.log("req.query", req.query);

  const filter = pick(req.query, ["hospital", "specialty"]);
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

module.exports = {
  updateDoctor,
  uploadProfilePicture,
  getAllDoctors,
};
