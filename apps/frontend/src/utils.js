import debounce from "lodash/debounce";

// debounced field value function
export const debounceFieldValue = debounce((name, value, setValue) => {
  setValue(name, value);
}, 200);

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const setLocalStorage = (name, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(name, JSON.stringify(value));
  }
};

export const getLocalStorage = (name) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(name));
  }
};

export const removeLocalStorage = (name) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(name);
  }
};
