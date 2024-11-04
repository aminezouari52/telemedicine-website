import axios from "axios";

export const updateConsultation = async (id, body) =>
  await axios.patch(
    `${import.meta.env.VITE_API_V1_URL}/consultation/${id}`,
    body
  );
