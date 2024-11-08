import axios from "axios";

export const createConsultation = async (body) =>
  await axios.post(`${import.meta.env.VITE_API_V1_URL}/consultation`, body);

export const updateConsultation = async (id, body) =>
  await axios.patch(
    `${import.meta.env.VITE_API_V1_URL}/consultation/${id}`,
    body
  );

export const getConsultation = async (id) =>
  await axios.get(`${import.meta.env.VITE_API_V1_URL}/consultation/${id}`);

export const getDoctorConsultations = async (id) =>
  await axios.get(
    `${import.meta.env.VITE_API_V1_URL}/consultation/doctor/${id}`
  );

export const getPatientConsultations = async (id) =>
  await axios.get(
    `${import.meta.env.VITE_API_V1_URL}/consultation/patient/${id}`
  );
