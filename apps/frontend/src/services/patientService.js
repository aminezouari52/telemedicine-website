import axios from "axios";

export const updatePatient = async (user, body) =>
  await axios.patch(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/patient/${user.id}`,
    body,
    {
      headers: {
        authtoken: user.token,
      },
    },
  );
