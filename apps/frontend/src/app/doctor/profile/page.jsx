"use client";

// hooks
import { useState } from "react";

// components
import Spinner from "@/components/Spinner";
import General from "@/features/doctor/DoctorProfile/General";

export default function DoctorProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-8 py-10 px-40">
      <div>
        <h1 className="text-lg font-semibold leading-6">Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete your profile to be visible to patients and to offer
          up-to-date details.
        </p>
      </div>
      <div className="border-t border-gray-300" />
      <General setIsLoading={setIsLoading} />
    </div>
  );
}
