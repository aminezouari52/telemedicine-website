const config = require("../config/config");
const { AccessToken } = require("livekit-server-sdk");

const generateToken = async (room, identity) => {
  const at = new AccessToken(
    config.livekit.api_key,
    config.livekit.api_secret,
    {
      identity,
    },
  );
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

  return await at.toJwt();
};

module.exports = {
  generateToken,
};
