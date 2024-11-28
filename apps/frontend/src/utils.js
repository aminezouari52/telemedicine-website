import debounce from "lodash/debounce";

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

export const generateAvailableHours = (consultationsData, selectedDate) => {
  const isHourUnavailable = (hour) => {
    return consultationsData
      ?.filter(
        (c) =>
          (c.status === "pending" || c.status === "in-progress") &&
          new Date(c.date).toISOString().slice(0, 10) === selectedDate
      )
      .some((c) => new Date(c.date).getHours() === hour);
  };

  return Array.from({ length: 24 }, (_, i) => ({
    value: `${i}`,
    name: `${i.toString().padStart(2, "0")}h`,
  })).filter((option) => !isHourUnavailable(parseInt(option.value)));
};

export const consultationsMonthlyGrowth = (consultations) => {
  return (
    ((consultations?.filter((consultation) => {
      const date = new Date(consultation.date);
      const now = new Date();
      return (
        consultation.status === "pending" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })?.length -
      consultations?.filter((consultation) => {
        const date = new Date(consultation.date);
        const now = new Date();
        return (
          consultation.status === "pending" &&
          date.getMonth() === now.getMonth() - 1 &&
          date.getFullYear() === now.getFullYear()
        );
      })?.length) /
      100) *
    100
  );
};
