const mongoose = require("mongoose");
const { Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const assertValidObjectId = (id, field) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} id`);
  }
};

const createConsultation = async (body) => {
  const consultation = await Consultation.create(body);
  return consultation;
};

const updateConsultation = async (id, body) => {
  const consultation = await Consultation.findByIdAndUpdate(id, body, {
    new: true,
  }).exec();
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return consultation;
};

const getConsultation = async (id) => {
  assertValidObjectId(id, "consultation");
  const consultation = await Consultation.findById(id).exec();
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return consultation;
};

const getPatientConsultations = async (patientId) => {
  assertValidObjectId(patientId, "patient");
  const consultations = await Consultation.find({
    patient: patientId,
  }).populate(["doctor", "patient", "payment"]);
  return consultations;
};

const getDoctorConsultations = async (doctorId) => {
  assertValidObjectId(doctorId, "doctor");
  const consultations = await Consultation.find({
    doctor: doctorId,
  }).populate(["doctor", "patient", "payment"]);
  return consultations;
};

module.exports = {
  createConsultation,
  updateConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  getConsultation,
};
