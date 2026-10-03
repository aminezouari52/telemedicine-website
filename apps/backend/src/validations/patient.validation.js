const Joi = require("joi");
const { Patient } = require("../models");
const { objectId } = require("./custom.validation");

const enumOf = (path) => Patient.schema.path(path).enumValues;

const textList = Joi.array().items(Joi.string().max(200)).max(50);

// The fields a patient may change on their own profile, from the profile page
// and the booking form. Joi rejects any other key.
const updatePatient = {
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
    weight: Joi.string().allow("").max(10),
    height: Joi.string().allow("").max(10),
    gender: Joi.string()
      .valid(...enumOf("gender"))
      .allow(""),
    bloodType: Joi.string()
      .valid(...enumOf("bloodType"))
      .allow(""),
    allergies: textList,
    chronicConditions: textList,
    currentMedications: textList,
    emergencyContactName: Joi.string().allow("").max(80),
    emergencyContactPhone: Joi.string()
      .allow("")
      .pattern(/^[0-9]+$/)
      .max(20),
    isProfileCompleted: Joi.boolean(),
  }),
};

const consumeAiUsage = {
  body: Joi.object().keys({
    kind: Joi.string().valid("chat", "suggestions").required(),
  }),
};

module.exports = {
  updatePatient,
  consumeAiUsage,
};
