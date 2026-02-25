import axios from "axios";

export const generateToken = async (room, email) =>
  await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/livekit/token?room=${room}&identity=${email}`,
  );
