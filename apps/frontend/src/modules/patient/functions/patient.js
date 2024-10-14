import axios from "axios";

export const submitConsultation = async (body) =>
  await axios.post(`${import.meta.env.VITE_REACT_APP_API}/consultation`, body);

export const getPatientConsultations = async (id) =>
  await axios.get(
    `${import.meta.env.VITE_REACT_APP_API}/consultation/patient/${id}`
  );
