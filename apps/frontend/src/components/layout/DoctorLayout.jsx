"use client";

// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

// COMPONENTS
import { DoctorHeader } from "@/components/header";
import Spinner from "@/components/Spinner";
import ConsultationAlert from "./ConsultationAlert";

export const DoctorLayout = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        router.replace("/auth/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isLoading && user?.role && user.role !== "doctor") {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="max-w-[1550px] mx-auto my-">
      <ConsultationAlert />
      <DoctorHeader />
      {children}
    </div>
  );
};
