const mongoose = require("mongoose");

const message = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", message);

module.exports = Message;
