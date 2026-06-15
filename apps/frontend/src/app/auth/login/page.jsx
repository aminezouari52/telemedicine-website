"use client";

// firebase
import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

// hooks
import { useState } from "react";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";

// functions
import { loginUser } from "@/services/authService";
import { setUser } from "@/reducers/userReducer";
import { authErrorMessage } from "@/utils/auth";

// components
import Logo from "@/components/Logo";

// style
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PulseOrb from "@/components/PulseOrb";

// assets
import { Mail } from "lucide-react";

// passowrd admin: "adminadmin"
const demoAccounts = [
  "freddie24@yahoo.com",
  "christop_hagenes21@gmail.com",
  "admin@gmail.com",
];

export default function LoginPage() {
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);

  const roleBasedRedirect = (role) => {
    if (role === "admin") {
      router.push("/admin");
      return;
    }
    if (role === "doctor") {
      router.push("/doctor/home");
      return;
    }
    if (role === "patient") {
      router.push("/patient/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;

      if (!demoAccounts.includes(email) && !user.emailVerified) {
        setUnverifiedEmail(email);
        await signOut(auth);
        throw new Error("Email not verified. Please verify your email.");
      }

      const idTokenResult = await user.getIdTokenResult();
      const response = await loginUser({ token: idTokenResult.token });

      dispatch(
        setUser({
          ...response.data,
          token: idTokenResult.token,
        }),
      );

      roleBasedRedirect(response.data.role);
    } catch (error) {
      toast(authErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail || !password) return;
    setResending(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        unverifiedEmail,
        password,
      );
      await sendEmailVerification(result.user);
      await signOut(auth);
      toast("Verification email sent! Check your inbox.", "success");
      setUnverifiedEmail(null);
    } catch (err) {
      toast(authErrorMessage(err), "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <form
      className="w-[325px] flex flex-col items-center justify-center gap-12"
      onSubmit={handleSubmit}
    >
      <Link href="/" className="cursor-pointer">
        <Logo className="w-[280px]" />
      </Link>

      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-center">Welcome Back!</h1>
        <p className="text-gray-500 text-center">
          Login to access the platform
        </p>
      </div>

      <div className="w-full flex flex-col items-end gap-2">
        <Input
          className="mt-2"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setUnverifiedEmail(null);
          }}
          placeholder="your email"
          autoFocus
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setUnverifiedEmail(null);
          }}
          placeholder="your password"
        />
        <Link
          href="/auth/forgot-password"
          className="text-primary-500 hover:underline text-sm"
        >
          Forgot your password?
        </Link>

        <Button
          type="submit"
          className="w-full"
          disabled={!email || password.length < 6 || loading}
        >
          {loading ? (
            <>
              <PulseOrb size="sm" floating={false} className="mr-2" />
              Logging in...
            </>
          ) : (
            <>
              <Mail className="mr-2" />
              Login
            </>
          )}
        </Button>

        {unverifiedEmail && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resending}
            onClick={handleResendVerification}
          >
            {resending ? (
              <>
                <PulseOrb size="sm" floating={false} className="mr-2" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        )}
      </div>

      <div className="text-sm w-full flex justify-center">
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
