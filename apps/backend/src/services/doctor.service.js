const httpStatus = require("http-status");
const { Doctor, User } = require("../models");
const ApiError = require("../utils/ApiError");
const cloudinary = require("cloudinary");

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Update Doctor by id
 * @param {ObjectId} doctorId
 * @param {Object} updateBody
 * @returns {Promise<Doctor>}
 */
const updateDoctorById = async (doctorId, updateBody) => {
  const doctor = await getUserById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  Object.assign(doctor, updateBody);
  await doctor.save();
  return doctor;
};

const uploadProfilePicture = async (image) => {
  const result = await cloudinary.uploader.upload(image, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

module.exports = {
  updateDoctorById,
  uploadProfilePicture,
};
