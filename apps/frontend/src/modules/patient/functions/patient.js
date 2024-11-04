import axios from "axios";

export const submitConsultation = async (body) =>
  await axios.post(`${import.meta.env.VITE_API_V1_URL}/consultation`, body);

export const getPatientConsultations = async (id) =>
  await axios.get(
    `${import.meta.env.VITE_API_V1_URL}/consultation/patient/${id}`
  );
