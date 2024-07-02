import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/create-or-update-user`,
    { role: authtoken.role },
    {
      headers: {
        authtoken: authtoken.token,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/current-admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};
