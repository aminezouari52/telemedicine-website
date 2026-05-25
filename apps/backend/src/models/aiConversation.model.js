const mongoose = require("mongoose");

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
