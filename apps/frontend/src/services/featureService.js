import axios from "axios";

export const getFeatures = async () =>
  await axios.get(`${process.env.NEXT_PUBLIC_API_V1_URL}/features`);
