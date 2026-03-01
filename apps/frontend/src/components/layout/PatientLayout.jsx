"use client";

// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// FUNCTIONS
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

// COMPONENTS
import { PatientHeader } from "@/components/header";
import Spinner from "@/components/Spinner";
import ConsultationAlert from "./ConsultationAlert";

export const PatientLayout = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        router.push("/auth/login");
      }
      setIsLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (user?.role !== "patient") {
      router.push("/auth/login");
    }
  }, [user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="h-screen max-w-[1440px] mx-auto">
      <ConsultationAlert />
      <PatientHeader />
      {children}
    </div>
  );
};
