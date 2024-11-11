const { Consultation } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createConsultation = async (body) => {
  const consultation = await Consultation.create(body);
  return consultation;
};

const updateConsultation = async (id, body) => {
  const consultation = await Consultation.findById(id).exec();
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return await Consultation.create(body);
};

const getConsultation = async (id) => {
  const consultation = await Consultation.findById(id).exec();
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
  createConsultation,
  updateConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  getConsultation,
};
