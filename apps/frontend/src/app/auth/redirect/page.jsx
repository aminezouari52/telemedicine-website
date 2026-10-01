"use client";

// hooks
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "@/hooks";

// functions
import { sessionUserQuery } from "@/lib/sessionUser";
import { ROLE_REDIRECTS, SIGN_IN_URL } from "@/constants/auth";

// style
import { Button } from "@/components/ui/button";
import PulseOrb from "@/components/PulseOrb";

// Clerk lands here after every sign-in/sign-up. Loading the session user
// creates the MongoDB record on first sign-in; then we route by role.
export default function AuthRedirectPage() {
  const router = useRouter();
  const logoutHandler = useLogout();
  const { isLoaded, isSignedIn, userId } = useAuth();

  const {
    data: user,
    isError,
    refetch,
  } = useQuery({
    ...sessionUserQuery(userId),
    enabled: isLoaded && !!isSignedIn,
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace(SIGN_IN_URL);
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (user?.role) router.replace(ROLE_REDIRECTS[user.role] ?? "/");
  }, [user?.role, router]);

  return (
    <div className="w-[325px] flex flex-col items-center justify-center gap-4">
      {isError ? (
        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-gray-500 text-center">
            We couldn&apos;t load your account. Please try again.
          </p>
          <div className="w-full flex gap-2">
            <Button className="flex-1" onClick={() => refetch()}>
              Try again
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={logoutHandler}
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-500">
          <PulseOrb size="sm" floating={false} />
          Signing you in...
        </div>
      )}
    </div>
  );
}
