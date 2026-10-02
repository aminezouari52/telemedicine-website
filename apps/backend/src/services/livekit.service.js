const httpStatus = require("http-status");
const { AccessToken } = require("livekit-server-sdk");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const getHourRange = require("../utils/getHourRange");
const {
  assertParticipant,
  getConsultation,
  markInProgress,
} = require("./consultation.service");

const isJoinable = ({ status, date }) => {
  if (status === "in-progress") return true;
  if (status !== "pending") return false;
  const { startHour, endHour } = getHourRange();
  return date >= startHour && date < endHour;
};

const generateConsultationToken = async (consultationId, user) => {
  const consultation = await getConsultation(consultationId);
  assertParticipant(consultation, user);
  if (!isJoinable(consultation)) {
    throw new ApiError(httpStatus.FORBIDDEN, "This consultation is not open");
  }
  await markInProgress(consultation._id);

  const at = new AccessToken(
    config.livekit.api_key,
    config.livekit.api_secret,
    {
      identity: String(user._id),
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    },
  );
  at.addGrant({
    roomJoin: true,
    room: String(consultation._id),
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
};

module.exports = {
  generateConsultationToken,
};
