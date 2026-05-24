import axios from "axios";

const authHeaders = () => ({
  headers: { authtoken: JSON.parse(localStorage.getItem("user"))?.token },
});

export const getDoctors = async (status) => {
  const params = status ? `?status=${status}` : "";
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/doctors${params}`,
    authHeaders(),
  );
};

export const updateDoctorStatus = async (id, status) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/doctors/${id}/status`,
    { status },
    authHeaders(),
  );
};

export const updateDoctorProfile = async (id, body) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/doctors/${id}/profile`,
    body,
    authHeaders(),
  );
};

export const getPatients = async (name) => {
  const params = name ? `?name=${encodeURIComponent(name)}` : "";
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/patients${params}`,
    authHeaders(),
  );
};

export const getPatient = async (id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/patients/${id}`,
    authHeaders(),
  );
};

export const updatePatient = async (id, body) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/patients/${id}`,
    body,
    authHeaders(),
  );
};

export const deletePatient = async (id) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/admin/patients/${id}`,
    authHeaders(),
  );
};
