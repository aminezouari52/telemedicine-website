export const authErrorMessage = (error) => {
  let errorMessage = "An unexpected error occurred. Please try again.";
  if (error?.message === "Firebase: Error (auth/invalid-login-credentials).") {
    errorMessage = "Invalid email or password.";
  } else if (
    error?.message === "Email not verified. Please verify your email."
  ) {
    errorMessage = error.message;
  }
  return errorMessage;
};
