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
    onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) router.push("/auth/login");
      setIsLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (user?.role !== "doctor") {
      router.push("/auth/login");
    }
  }, [user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="h-screen overflow-x-hidden">
      <ConsultationAlert />
      <DoctorHeader />
      {children}
    </div>
  );
};
