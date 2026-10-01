export const SIGN_IN_URL = "/auth/login";
export const SIGN_UP_URL = "/auth/register";
// Doctors sign up on their own page; the static `doctor` segment takes
// precedence over the patient sign-up's catch-all route.
export const DOCTOR_SIGN_UP_URL = "/auth/register/doctor";

// Clerk sends users here after sign-in/sign-up; it loads (or, on first sign-in,
// creates) the MongoDB user and forwards them to their role's home page.
export const AFTER_AUTH_URL = "/auth/redirect";

export const ROLE_REDIRECTS = {
  admin: "/admin",
  doctor: "/doctor/home",
  patient: "/patient/dashboard",
};
