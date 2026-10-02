const catchAsync = require("../utils/catchAsync");
const { consultationService } = require("../services");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const getCurrentUser = require("../utils/getCurrentUser");

const assertSelf = (user, id) => {
  if (String(user._id) !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
};

const createConsultation = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  const consultation = await consultationService.createFreeConsultation(
    user,
    req.body,
  );
  res.status(httpStatus.CREATED).send(consultation);
});

const completeConsultation = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  const consultation = await consultationService.completeConsultation(
    req.params.id,
    user,
  );
  res.status(httpStatus.OK).send(consultation);
});

const getPatientConsultations = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  assertSelf(user, req.params.patientId);
  const consultations = await consultationService.getPatientConsultations(
    req.params.patientId,
  );
  res.status(httpStatus.OK).send(consultations);
});

const getDoctorConsultations = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req);
  assertSelf(user, req.params.doctorId);
  const consultations = await consultationService.getDoctorConsultations(
    req.params.doctorId,
  );
  res.status(httpStatus.OK).send(consultations);
});

module.exports = {
  createConsultation,
  completeConsultation,
  getPatientConsultations,
  getDoctorConsultations,
};
