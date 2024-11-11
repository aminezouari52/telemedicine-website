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
    if (localStorage.getItem(name)) {
      localStorage.setItem(name, JSON.stringify(value));
    } else {
      console.log(`localstorage: ${name} item not found`);
      return false;
    }
  }
};

export const getLocalStorage = (name) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name));
    } else {
      console.log(`localstorage: ${name} item not found`);
      return false;
    }
  }
};

export const removeLocalStorage = (name) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem(name)) {
      localStorage.removeItem(name);
    } else {
      console.log(`localstorage: ${name} item not found`);
      return false;
    }
  }
};
