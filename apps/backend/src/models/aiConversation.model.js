const mongoose = require("mongoose");

const toolCallSchema = new mongoose.Schema(
  {
    toolCallId: String,
    toolName: String,
    args: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const toolResultSchema = new mongoose.Schema(
  {
    toolCallId: String,
    toolName: String,
    result: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

// AI SDK v5 keeps a tool call's input + output on a single part. Persist both
// together so the result survives the round-trip.
const toolInvocationSchema = new mongoose.Schema(
  {
    toolCallId: String,
    toolName: String,
    state: String,
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    toolInvocations: [toolInvocationSchema],
    // Legacy fields, kept for reading conversations saved before the v5 migration.
    toolCalls: [toolCallSchema],
    toolResults: [toolResultSchema],
    reasoning: String,
    pdfName: String,
    pdfSize: Number,
  },
  { _id: false },
);

const aiConversationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New conversation",
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("AiConversation", aiConversationSchema);
