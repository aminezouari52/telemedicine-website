const { Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const updateConsultationById = async (consultationId, updateBody) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  Object.assign(consultation, updateBody);
  await consultation.save();
  return consultation;
};

const getConsultation = async (consultationId) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return consultation;
};

const getPatientConsultations = async (patientId) => {
  const consultations = await Consultation.find({
    patient: patientId,
  }).populate(["doctor", "patient"]);
  return consultations;
};

const getDoctorConsultations = async (doctorId) => {
  const consultations = await Consultation.find({
    doctor: doctorId,
  }).populate(["doctor", "patient"]);
  return consultations;
};

module.exports = {
  updateConsultationById,
  getPatientConsultations,
  getDoctorConsultations,
  getConsultation,
};
