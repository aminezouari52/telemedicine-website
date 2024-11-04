const Consultation = require("../models/consultation.model");
const catchAsync = require("../utils/catchAsync");
const { consultationService } = require("../services");
const httpStatus = require("http-status");

const updateConsultation = async (req, res, next) => {
  const consultation = await consultationService.updateConsultationById(
    req.params.id,
    req.body,
  );
  res.json(consultation);
};

const submitConsultation = async (req, res, next) => {
  res.status(httpStatus.CREATED).send(await new Consultation(req.body).save());
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
  updateConsultation,
  getDoctorConsultations,
};
