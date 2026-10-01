"use client";

// hooks
import { usePathname } from "next/navigation";
import { useAuthFormAppearance } from "@/hooks";

// Same optional catch-all setup as the patient sign-up: Clerk's <SignUp />
// renders its verification steps on sub-paths of this route. Its heading
// ("Join as a doctor") comes from the localization in AppClerkProvider.
import { SignUp } from "@clerk/nextjs";

// constants
import { DOCTOR_SIGN_UP_URL, SIGN_UP_URL } from "@/constants/auth";

// components
import Link from "next/link";

export default function DoctorRegisterPage() {
  const pathname = usePathname();
  const appearance = useAuthFormAppearance();

  // Only show the patient link on the first step, not on verification sub-steps.
  const isFirstStep = pathname === DOCTOR_SIGN_UP_URL;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* The backend only accepts patient/doctor from this metadata, and new
          doctors start with approvalStatus "pending". */}
      <SignUp
        path={DOCTOR_SIGN_UP_URL}
        unsafeMetadata={{ role: "doctor" }}
        appearance={appearance}
      />

      {isFirstStep && (
        <Link
          href={SIGN_UP_URL}
          className="text-sm text-gray-600 hover:text-primary-700"
        >
          Looking for care?{" "}
          <span className="font-semibold text-primary-700">
            Sign up as a patient
          </span>
        </Link>
      )}
    </div>
  );
}
