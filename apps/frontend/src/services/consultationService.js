import axios from "axios";

export const createConsultation = async (body) =>
  await axios.post(`${process.env.NEXT_PUBLIC_API_V1_URL}/consultation`, body);

export const completeConsultation = async (id) =>
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/consultation/${id}/complete`,
  );

export const getDoctorConsultations = async (id) =>
  await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/consultation/doctor/${id}`,
  );

export const getPatientConsultations = async (id) =>
  await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/consultation/patient/${id}`,
  );
