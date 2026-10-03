const mongoose = require("mongoose");

const WINDOW_TTL_SECONDS = 2 * 60 * 60;

// One counter per user, kind of AI request and clock hour, for the hourly
// limit in aiUsage.service.js. MongoDB deletes old windows through the TTL index.
const aiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  kind: {
    type: String,
    enum: ["chat", "suggestions"],
    required: true,
  },
  windowStart: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

aiUsageSchema.index({ user: 1, kind: 1, windowStart: 1 }, { unique: true });
aiUsageSchema.index(
  { windowStart: 1 },
  { expireAfterSeconds: WINDOW_TTL_SECONDS },
);

module.exports = mongoose.model("AiUsage", aiUsageSchema);
