"use client";

// hooks
import { useState } from "react";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

// firebase
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// components
import Logo from "@/components/Logo";

// style
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmail("");
      toast("Link sent successfully", "Please check your inbox");
      router.push("/auth/login");
    } catch (err) {
      toast("Failed to send password reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="h-screen w-[325px] flex flex-col justify-center items-center gap-12"
      onSubmit={handleSubmit}
    >
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Logo className="w-[280px]" />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-center">
          Forgotten password
        </h1>
        <p className="text-gray-500 text-center">
          Enter your email below to receive a link
        </p>
      </div>
      <div className="w-full flex flex-col items-end gap-2">
        <Input
          className="focus-visible:ring-primary-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          autoFocus
        />

        <Button type="submit" className="w-full" disabled={!email || loading}>
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            "Reset"
          )}
        </Button>
      </div>
      <div className="text-sm">
        <span className="text-gray-500 mr-1">Don&apos;t have an account?</span>
        <Link
          href="/auth/register"
          className="text-primary-500 font-semibold hover:underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
}
