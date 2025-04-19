import axios from "axios";

export const updateDoctor = async (user, body) =>
  await axios.patch(
    `${import.meta.env.VITE_API_V1_URL}/doctor/${user.id}`,
    body,
    {
      headers: {
        authtoken: user.token,
      },
    },
  );

export const uploadProfilePicture = async (user, formData) =>
  await axios.post(
    `${import.meta.env.VITE_API_V1_URL}/doctor/profile-image`,
    { image: formData },
    {
      headers: {
        authtoken: user ? user.token : "",
      },
    },
  );

export const getAllDoctors = async (filters, options) =>
  await axios.get(
    `${import.meta.env.VITE_API_V1_URL}/doctor?${filters}&sortBy=${options}`,
  );

export const getDoctor = async (id) =>
  await axios.get(`${import.meta.env.VITE_API_V1_URL}/doctor/${id}`);

export const getDoctorPatientsCount = async (id) =>
  await axios.get(`${import.meta.env.VITE_API_V1_URL}/doctor/patients/${id}`);
