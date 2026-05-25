import axios from "axios";

const API = `${process.env.NEXT_PUBLIC_API_V1_URL}/patient`;

export const PATIENT_AI_API = `${API}/ai`;

function authHeaders() {
  const user = JSON.parse(localStorage.getItem("user"));
  return { authtoken: user?.token || "" };
}

export const listConversations = async () =>
  await axios.get(`${API}/conversations`, { headers: authHeaders() });

export const createConversation = async (data) =>
  await axios.post(`${API}/conversations`, data, { headers: authHeaders() });

export const updateConversation = async (convId, data) =>
  await axios.patch(`${API}/conversations/${convId}`, data, {
    headers: authHeaders(),
  });

export const deleteConversation = async (convId) =>
  await axios.delete(`${API}/conversations/${convId}`, {
    headers: authHeaders(),
  });
