"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useLogout } from "@/hooks";
import { SIGN_IN_URL } from "@/constants/auth";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";

export const AdminLayout = ({ children }) => {
  const router = useRouter();
  const logoutHandler = useLogout();
  const { isLoaded, isSignedIn } = useAuth();
  const user = useSelector((state) => state.userReducer.user);
  const isLoading = !isLoaded || !isSignedIn;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(SIGN_IN_URL);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoading && user?.role && user.role !== "admin") {
      router.replace(SIGN_IN_URL);
    }
  }, [isLoading, user, router]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary-500" />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={logoutHandler}
            aria-label="logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
