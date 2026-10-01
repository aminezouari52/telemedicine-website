import axios from "axios";

// The Clerk session token is attached by the interceptor in lib/axiosAuth.js.

// Returns the MongoDB user, creating it on the first sign-in.
export const loginUser = async () => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/auth/login-user`,
  );
};

export const getCurrentUser = async () => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/auth/current-user`,
    {},
  );
};
