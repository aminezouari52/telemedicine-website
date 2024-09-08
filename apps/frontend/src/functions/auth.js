import axios from "axios";

export const createOrUpdateUser = async (user) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/auth/create-or-update-user`,
    { role: user.role },
    {
      headers: {
        authtoken: user.token,
      },
    }
  );
};

export const getCurrentUser = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/auth/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};
