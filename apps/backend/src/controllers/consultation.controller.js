const Consultation = require("../models/consultation.model");
const catchAsync = require("../utils/catchAsync");
const { consultationService } = require("../services");

const submitConsultation = async (req, res) => {
  try {
    res.json(await new Consultation(req.body).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

const getPatientConsultations = catchAsync(async (req, res) => {
  const consultations = await consultationService.getPatientConsultations(
    req.params.patientId,
  );
  res.send(consultations);
});

const getDoctorConsultations = catchAsync(async (req, res) => {
  const consultations = await consultationService.getDoctorConsultations(
    req.params.doctorId,
  );
  res.send(consultations);
});

module.exports = {
  submitConsultation,
  getPatientConsultations,
  getDoctorConsultations,
};
