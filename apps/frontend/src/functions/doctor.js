import axios from "axios";

export const updateDoctor = async (user, body) =>
  await axios.patch(
    `${import.meta.env.VITE_REACT_APP_API}/doctors/${user.id}`,
    body,
    {
      headers: {
        authtoken: user.token,
      },
    }
  );

export const uploadProfilePicture = async (user, formData) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/doctors/profile-image`,
    { image: formData },
    {
      headers: {
        authtoken: user ? user.token : "",
      },
    }
  );

export const getAllDoctors = async (filters, options) =>
  await axios.get(
    `${import.meta.env.VITE_REACT_APP_API}/doctors?${filters}&sortBy=${options}`
  );

export const getDoctorById = async (id) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/doctors/${id}`);
