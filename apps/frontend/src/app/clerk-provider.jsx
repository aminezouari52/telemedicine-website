"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import {
  AFTER_AUTH_URL,
  DOCTOR_SIGN_UP_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "@/constants/auth";

// Matches the Tailwind `primary-500` and `font-sans` theme values.
const clerkAppearance = {
  variables: {
    colorPrimary: "#615EFC",
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    borderRadius: "0.5rem",
  },
};

// Patients and doctors share Clerk's <SignUp />, so the card's heading comes
// from the provider-level localization, picked by route.
const PATIENT_LOCALIZATION = {
  signUp: {
    start: {
      title: "Create your patient account",
      subtitle: "Book online consultations with certified doctors",
    },
  },
};

const DOCTOR_LOCALIZATION = {
  signUp: {
    start: {
      title: "Join as a doctor",
      subtitle: "An admin reviews new doctors before patients can find you",
    },
  },
};

// A client component (rather than the server ClerkProvider in the root
// layout) so the localization can follow the current route; Clerk applies
// localization changes without remounting.
export function AppClerkProvider({ children }) {
  const pathname = usePathname();
  const isDoctorSignUp = pathname?.startsWith(DOCTOR_SIGN_UP_URL);

  // Stable object identity: Clerk re-applies its options whenever the
  // localization reference changes.
  const localization = useMemo(
    () => (isDoctorSignUp ? DOCTOR_LOCALIZATION : PATIENT_LOCALIZATION),
    [isDoctorSignUp],
  );

  return (
    // Every sign-in/sign-up goes through AFTER_AUTH_URL, which creates the
    // MongoDB user on first sign-in and routes by role.
    <ClerkProvider
      signInUrl={SIGN_IN_URL}
      signUpUrl={SIGN_UP_URL}
      signInForceRedirectUrl={AFTER_AUTH_URL}
      signUpForceRedirectUrl={AFTER_AUTH_URL}
      afterSignOutUrl={SIGN_IN_URL}
      appearance={clerkAppearance}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}
