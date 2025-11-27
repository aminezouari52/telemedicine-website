const footerEmailInputValidations = {
  required: "The email address is required",
  minLength: {
    value: 8,
    message: "The email address should have at least 8 characters",
  },
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gi,
    message: "Invalid email address",
  },
};

export { footerEmailInputValidations };
