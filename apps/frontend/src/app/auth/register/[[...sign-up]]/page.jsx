"use client";

// hooks
import { usePathname } from "next/navigation";
import { useAuthFormAppearance } from "@/hooks";

// Clerk's <SignUp /> handles every sign-up step (including email
// verification) on sub-paths of this route, which is why it lives in an
// optional catch-all segment.
import { SignUp } from "@clerk/nextjs";

// constants
import { DOCTOR_SIGN_UP_URL, SIGN_UP_URL } from "@/constants/auth";

// components
import Link from "next/link";

// style
import { Stethoscope } from "lucide-react";

export default function RegisterPage() {
  const pathname = usePathname();
  const appearance = useAuthFormAppearance();

  // Only show the doctor link on the first step, not on verification sub-steps.
  const isFirstStep = pathname === SIGN_UP_URL;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Saved on the Clerk user; the backend reads it when it creates the
          MongoDB user on first sign-in. Doctors use DOCTOR_SIGN_UP_URL. */}
      <SignUp
        path={SIGN_UP_URL}
        unsafeMetadata={{ role: "patient" }}
        appearance={appearance}
      />

      {isFirstStep && (
        <Link
          href={DOCTOR_SIGN_UP_URL}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700"
        >
          <Stethoscope className="h-4 w-4" />
          Are you a doctor?
          <span className="font-semibold text-primary-700">
            Join as a doctor
          </span>
        </Link>
      )}
    </div>
  );
}
