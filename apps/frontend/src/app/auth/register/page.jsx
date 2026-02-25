"use client";

// hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks";
import Link from "next/link";

// functions
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { validateEmail } from "@/utils/helpers";
import { registerUser } from "@/services/authService";

// components
import Logo from "@/components/Logo";

// style
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error("Invalid Email");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await sendEmailVerification(user);
      toast("Verification email sent! Please check your inbox.", "info");

      await registerUser({
        role,
        email,
      });
      router.push("/auth/login");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-[325px] flex flex-col items-center justify-center gap-12"
      onSubmit={handleSubmit}
    >
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Logo className="w-[280px]" />
      </div>
      <div className="flex gap-1.5 flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold">Join Us Now!</h1>
        <p className="text-gray-500">Welcome! Please create your account</p>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Input
          className="focus-visible:ring-primary-500 mt-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          autoFocus
        />

        <Input
          className="focus-visible:ring-primary-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
        />
        <div className="w-full flex gap-4 items-center">
          <span className="whitespace-nowrap">You are a </span>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="focus:ring-primary-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!email || password.length < 6 || loading}
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </div>

      <div className="text-sm">
        <span className="text-gray-500 mr-1">Already have an account?</span>
        <Link
          href="/auth/login"
          className="text-primary-500 font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
