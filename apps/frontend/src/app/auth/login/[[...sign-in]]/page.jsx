"use client";

// Clerk's <SignIn /> handles every sign-in step (password, email codes,
// forgot password, MFA, social providers) on sub-paths of this route, which
// is why it lives in an optional catch-all segment. Enable providers and
// factors in the Clerk dashboard — no code changes needed.
import { SignIn } from "@clerk/nextjs";

// hooks
import { useAuthFormAppearance } from "@/hooks";

// constants
import { SIGN_IN_URL } from "@/constants/auth";

export default function LoginPage() {
  const appearance = useAuthFormAppearance();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <SignIn path={SIGN_IN_URL} appearance={appearance} />
    </div>
  );
}
