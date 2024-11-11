import debounce from "lodash/debounce";

// debounced field value function
export const debounceFieldValue = debounce((name, value, setValue) => {
  setValue(name, value);
}, 200);

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// won't run in SSR
export const isBrowser = () => {
  return typeof window !== "undefined";
};
