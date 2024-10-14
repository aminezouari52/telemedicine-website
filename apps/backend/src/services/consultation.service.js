const { Consultation } = require("../models");

const getPatientConsultations = async (patientId) => {
  const consultations = await Consultation.find({
    patient: patientId,
  }).populate("doctor");
  return consultations;
};

const getDoctorConsultations = async (doctorId) => {
  const consultations = await Consultation.find({
    doctor: doctorId,
  });
  return consultations;
};

module.exports = {
  getPatientConsultations,
  getDoctorConsultations,
};
