import axios from "axios";

export const loginUser = async (user) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/auth/login-user`,
    {
      headers: {
        authtoken: user.token,
      },
    },
  );
};

export const registerUser = async (user) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/auth/register-user`,
    { role: user.role, email: user.email },
  );
};

export const getCurrentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_V1_URL}/auth/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    },
  );
};
