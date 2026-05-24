"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { logout } from "@/reducers/userReducer";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, LogOut } from "lucide-react";

export const AdminLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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
    if (!isLoading && user?.role && user.role !== "admin") {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      queryClient.removeQueries();
      router.push("/auth/login");
    } catch (err) {
      console.log(err);
    }
  };

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
