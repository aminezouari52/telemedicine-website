const Joi = require("joi");
const { Doctor } = require("../models");
const { objectId } = require("./custom.validation");

const enumOf = (path) => Doctor.schema.path(path).enumValues;

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Base64 data URL of the resized profile photo (components/ImageUpload.jsx).
const MAX_IMAGE_DATA_URL_LENGTH = 5 * 1024 * 1024;

// The fields a doctor may change on their own profile. Joi rejects any other
// key, so approvalStatus, email and role can only be changed by an admin.
const updateDoctor = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    firstName: Joi.string().trim().max(50),
    lastName: Joi.string().trim().max(50),
    age: Joi.number().integer().min(18).max(100),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .max(20),
    address: Joi.string().allow("").max(100),
    city: Joi.string().allow("").max(50),
    zip: Joi.string().pattern(/^[0-9]{4,5}$/),
    description: Joi.string().allow("").max(500),
    hospital: Joi.string().valid(...enumOf("hospital")),
    specialty: Joi.string().valid(...enumOf("specialty")),
    degrees: Joi.array().items(Joi.string().allow("").max(200)).max(10),
    certifications: Joi.array().items(Joi.string().allow("").max(200)).max(10),
    price: Joi.number().min(0).max(1000),
    experience: Joi.string().valid(...enumOf("experience")),
    schedule: Joi.array()
      .items(Joi.string().valid(...WEEKDAYS))
      .unique(),
    photo: Joi.string().uri({ scheme: ["https"] }),
    isProfileCompleted: Joi.boolean(),
  }),
};

const uploadProfilePicture = {
  body: Joi.object().keys({
    image: Joi.string()
      .required()
      .max(MAX_IMAGE_DATA_URL_LENGTH)
      .pattern(/^data:image\/(jpeg|png|webp);base64,/),
  }),
};

module.exports = {
  updateDoctor,
  uploadProfilePicture,
};
