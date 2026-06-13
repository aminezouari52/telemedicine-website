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

export const PatientLayout = ({ children }) => {
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
    if (!isLoading && user?.role && user.role !== "patient") {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col md:flex-row h-screen max-w-[1550px] mx-auto">
      <PatientHeader />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
