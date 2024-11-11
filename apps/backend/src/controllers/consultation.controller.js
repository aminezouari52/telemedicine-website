const Consultation = require("../models/consultation.model");
const catchAsync = require("../utils/catchAsync");
const { consultationService } = require("../services");
const httpStatus = require("http-status");

const createConsultation = catchAsync(async (req, res) => {
  const consultation = await consultationService.createConsultation(req.body);
  res.status(httpStatus.CREATED).send(consultation);
});

const updateConsultation = catchAsync(async (req, res) => {
  const consultation = await consultationService.updateConsultation(
    req.params.id,
    req.body,
  );
  res.status(httpStatus.OK).send(consultation);
});

const getConsultation = catchAsync(async (req, res) => {
  const consultation = await consultationService.getConsultation(req.params.id);
  res.status(httpStatus.OK).send(consultation);
});

const getPatientConsultations = catchAsync(async (req, res) => {
  const consultations = await consultationService.getPatientConsultations(
    req.params.patientId,
  );
  res.status(httpStatus.OK).send(consultations);
});

const getDoctorConsultations = catchAsync(async (req, res) => {
  const consultations = await consultationService.getDoctorConsultations(
    req.params.doctorId,
  );
  res.status(httpStatus.OK).send(consultations);
});

module.exports = {
  createConsultation,
  getPatientConsultations,
  updateConsultation,
  getDoctorConsultations,
  getConsultation,
};
