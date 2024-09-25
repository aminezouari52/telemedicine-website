const { Consultation, Doctor } = require("../models");
var ObjectId = require("mongoose").Types.ObjectId;

const getPatientConsultations = async (patientId) => {
  const consultations = await Consultation.find({
    patient: patientId,
  }).populate("doctor");
  return consultations;
};

module.exports = {
  getPatientConsultations,
};
