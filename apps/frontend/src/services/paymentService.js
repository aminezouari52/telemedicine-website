import axios from "axios";

export const createCheckoutSession = async (body) =>
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/payment/create-checkout-session`,
    body,
  );

export const confirmPayment = async (sessionId) =>
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/payment/confirm-payment`,
    { sessionId },
  );
