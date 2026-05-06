import axios from "axios";

export const askPatientAi = async ({
  input,
  pdfContent,
  context,
  conversationHistory = [],
}) =>
  await axios.post(`${process.env.NEXT_PUBLIC_API_V1_URL}/patient/ai`, {
    input,
    pdfContent,
    context,
    conversationHistory,
  });
