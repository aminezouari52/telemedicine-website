const Consultation = require("../models/consultation.model");
const catchAsync = require("../utils/catchAsync");
const { consultationService } = require("../services");
const httpStatus = require("http-status");

const updateConsultation = async (req, res) => {
  const consultation = await consultationService.updateConsultation(
    req.params.id,
    req.body,
  );
  res.json(consultation);
};

const createConsultation = async (req, res) => {
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

const getConsultation = catchAsync(async (req, res) => {
  const consultation = await consultationService.getConsultation(req.params.id);
  res.json(consultation);
});

module.exports = {
  createConsultation,
  getPatientConsultations,
  updateConsultation,
  getDoctorConsultations,
  getConsultation,
};
