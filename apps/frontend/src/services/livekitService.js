import axios from "axios";

export const generateToken = async (consultationId) =>
  await axios.get(`${process.env.NEXT_PUBLIC_API_V1_URL}/livekit/token`, {
    params: { consultationId },
  });
