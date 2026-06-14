const catchAsync = require("../utils/catchAsync");
const {
  patientService,
  aiConversationService,
  medicalEmbeddingService,
} = require("../services");
const { User } = require("../models");
const httpStatus = require("http-status");

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  res.status(httpStatus.OK).send(patient);
});

const listConversations = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
  }

  const conversations = await aiConversationService.listConversations(user._id);
  res.status(httpStatus.OK).send(conversations);
});

const createConversation = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
  }

  const conversation = await aiConversationService.createConversation(
    user._id,
    req.body,
  );
  res.status(httpStatus.CREATED).send(conversation);
});

const updateConversation = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
  }

  const conversation = await aiConversationService.updateConversation(
    user._id,
    req.params.convId,
    req.body,
  );

  if (!conversation) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ error: "Conversation not found" });
  }

  res.status(httpStatus.OK).send(conversation);
});

const deleteConversation = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
  }

  const deleted = await aiConversationService.deleteConversation(
    user._id,
    req.params.convId,
  );

  if (!deleted) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ error: "Conversation not found" });
  }

  res.status(httpStatus.NO_CONTENT).send();
});

// Semantic search over the logged-in patient's own data (profile +
// consultations). Called by the AI's search_medical_history tool. Scoping is
// enforced here from the authenticated user, never trusted from the request.
const getMedicalContext = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ error: "User not found" });
  }

  const results = await medicalEmbeddingService.searchMedicalContext(
    user._id,
    req.body.query,
  );
  res.status(httpStatus.OK).send({ results });
});

module.exports = {
  updatePatient,
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  getMedicalContext,
};
