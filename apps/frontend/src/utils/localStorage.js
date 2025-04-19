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
