"use client";

// HOOKS
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// CONSTANTS
import { SIGN_IN_URL } from "@/constants/auth";

// COMPONENTS
import { DoctorHeader } from "@/components/header";
import Spinner from "@/components/Spinner";

export const DoctorLayout = ({ children }) => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const user = useSelector((state) => state.userReducer.user);
  const isLoading = !isLoaded || !isSignedIn;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(SIGN_IN_URL);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoading && user?.role && user.role !== "doctor") {
      router.replace(SIGN_IN_URL);
    }
  }, [isLoading, user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="max-w-[1550px] mx-auto my-">
      <DoctorHeader />
      {children}
    </div>
  );
};
