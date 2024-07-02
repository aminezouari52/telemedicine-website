import axios from "axios";

export const submitReservation = async (body) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/patient/submit`,
    body
  );
