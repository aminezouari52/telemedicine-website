const mongoose = require("mongoose");
const { Consultation, Doctor } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const config = require("../config/config");

const assertValidObjectId = (id, field) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} id`);
  }
};

const assertParticipant = (consultation, user) => {
  const isParticipant = [consultation.doctor, consultation.patient].some((id) =>
    id.equals(user._id),
  );
  if (!isParticipant) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not part of this consultation",
    );
  }
};

const createFreeConsultation = async (patient, { doctor: doctorId, date }) => {
  if (patient.role !== "patient") {
    throw new ApiError(httpStatus.FORBIDDEN, "Only patients can book");
  }
  assertValidObjectId(doctorId, "doctor");
  const doctor = await Doctor.findById(doctorId).exec();
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  // Without Stripe every booking is free, whatever the doctor's price.
  if (doctor.price > 0 && config.features.payments) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This doctor requires payment through checkout",
    );
  }
  return Consultation.create({
    date,
    doctor: doctor._id,
    patient: patient._id,
  });
};

const getConsultation = async (id) => {
  assertValidObjectId(id, "consultation");
  const consultation = await Consultation.findById(id).exec();
  if (!consultation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return consultation;
};

const markInProgress = (id) =>
  Consultation.findOneAndUpdate(
    { _id: id, status: "pending" },
    { status: "in-progress" },
  ).exec();

const completeConsultation = async (id, user) => {
  const consultation = await getConsultation(id);
  assertParticipant(consultation, user);
  // Only a consultation under way can end. The status is checked in the update
  // itself, as markInProgress does, so two requests cannot race past it.
  const completed = await Consultation.findOneAndUpdate(
    { _id: consultation._id, status: "in-progress" },
    { status: "completed" },
    { new: true },
  ).exec();
  if (completed) return completed;
  // Leaving a consultation the other participant has already ended still works.
  const current = await getConsultation(id);
  if (current.status === "completed") return current;
  throw new ApiError(
    httpStatus.CONFLICT,
    `Only a consultation in progress can be completed; this one is ${current.status}`,
  );
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
  assertParticipant,
  createFreeConsultation,
  getConsultation,
  markInProgress,
  completeConsultation,
  getPatientConsultations,
  getDoctorConsultations,
};
