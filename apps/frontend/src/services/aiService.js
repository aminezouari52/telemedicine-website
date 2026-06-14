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

/**
 * Fetches contextual follow-up question suggestions from the Next.js API route.
 * Returns an empty array on any failure — suggestions are non-critical.
 */
export const fetchSuggestions = async (messages) => {
  try {
    const res = await fetch("/api/ai/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch {
    return [];
  }
};
