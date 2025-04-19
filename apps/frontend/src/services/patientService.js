import axios from "axios";

export const updatePatient = async (user, body) =>
  await axios.patch(
    `${import.meta.env.VITE_API_V1_URL}/patient/${user.id}`,
    body,
    {
      headers: {
        authtoken: user.token,
      },
    },
  );
