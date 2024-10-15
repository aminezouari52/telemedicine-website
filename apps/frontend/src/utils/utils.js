import debounce from "lodash/debounce";

// debounced field value function
export const debounceFieldValue = debounce((name, value, setValue) => {
  setValue(name, value);
}, 200);

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDateTime = (inputDate) => {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid Date");
  }

  const formattedDate = date
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-"); // Replace '/' with '-' to match the format

  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `le ${formattedDate} à ${formattedTime}`;
};
