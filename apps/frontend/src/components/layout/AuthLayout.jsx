"use client";

// HOOKS
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/nextjs";

// CONSTANTS
import { ROLE_REDIRECTS } from "@/constants/auth";

// COMPONENTS
import Spinner from "@/components/Spinner";
import DemoCredentials from "@/components/demo/DemoCredentials";

// ASSETS
import Image from "next/image";

export const AuthLayout = ({ children }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const user = useSelector((state) => state.userReducer.user);

  // Already signed in with a known role: skip the auth pages.
  const redirectPath = isSignedIn ? ROLE_REDIRECTS[user?.role] : undefined;

  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [router, redirectPath]);

  return redirectPath ? (
    <Spinner />
  ) : (
    <div className="flex h-screen bg-white">
      {/* `md` (960px) is also where useAuthFormAppearance flattens the Clerk
          card, so the form and the layout switch together. The logo is
          rendered by Clerk inside the card, above the form title. */}
      <div className="w-full md:w-1/2 lg:w-[42%] h-screen overflow-y-auto flex flex-col">
        <header className="flex justify-end px-4 pt-4 empty:hidden">
          <DemoCredentials />
        </header>
        <div className="flex-1 flex justify-center items-center px-4 py-4">
          {children}
        </div>
      </div>
      {/* Illustration only fits beside the form on large screens. */}
      <div className="hidden md:block flex-1 h-screen relative">
        <Image
          src="/assets/login.webp"
          alt="Login illustration"
          fill
          sizes="(min-width: 1400px) 58vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};
