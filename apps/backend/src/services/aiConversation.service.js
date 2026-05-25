const { AiConversation } = require("../models");

const listConversations = async (patientId) => {
  const conversations = await AiConversation.find({ patient: patientId })
    .select("title updatedAt messages")
    .sort({ updatedAt: -1 })
    .lean();

  return conversations.map((conv) => ({
    id: conv._id.toString(),
    title: conv.title,
    updatedAt: conv.updatedAt.getTime(),
    messages: conv.messages || [],
  }));
};

const createConversation = async (patientId, { title, messages }) => {
  const conversation = await AiConversation.create({
    patient: patientId,
    title: title || "New conversation",
    messages: messages || [],
  });

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    updatedAt: conversation.updatedAt.getTime(),
    messages: conversation.messages || [],
  };
};

const updateConversation = async (patientId, convId, { title, messages }) => {
  const update = {};

  if (title !== undefined) update.title = title;
  if (messages !== undefined) update.messages = messages;

  const conversation = await AiConversation.findOneAndUpdate(
    { _id: convId, patient: patientId },
    { $set: update },
    { new: true },
  ).lean();

  if (!conversation) return null;

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    updatedAt: conversation.updatedAt.getTime(),
    messages: conversation.messages || [],
  };
};

const deleteConversation = async (patientId, convId) => {
  const result = await AiConversation.findOneAndDelete({
    _id: convId,
    patient: patientId,
  });

  return !!result;
};

module.exports = {
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
};
