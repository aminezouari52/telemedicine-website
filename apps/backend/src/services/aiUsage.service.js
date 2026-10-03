const httpStatus = require("http-status");
const config = require("../config/config");
const { AiUsage } = require("../models");
const ApiError = require("../utils/ApiError");
const getHourRange = require("../utils/getHourRange");

/**
 * Counts one AI request for the user in the current clock hour, and throws 429
 * once they are over AI_MESSAGES_PER_HOUR. Chat messages and follow-up
 * suggestions are counted separately, so suggestions never use up chat turns.
 */
const consumeAiUsage = async (userId, kind) => {
  const { startHour, endHour } = getHourRange();
  const usage = await AiUsage.findOneAndUpdate(
    { user: userId, kind, windowStart: startHour },
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  ).exec();

  const limit = config.ai.messagesPerHour;
  if (usage.count > limit) {
    const minutesLeft = Math.ceil((endHour - Date.now()) / 60_000);
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      `You've reached the limit of ${limit} AI messages per hour. Try again in ${minutesLeft} min.`,
    );
  }

  return { limit, remaining: limit - usage.count, resetAt: endHour };
};

module.exports = {
  consumeAiUsage,
};
