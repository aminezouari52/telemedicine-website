"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Spinner from "@/components/Spinner";
import StoryExperience from "@/components/telemedicine-story/StoryExperience";

export default function HomePage() {
  const user = useSelector((state) => state.userReducer.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      if (user.role === "doctor") {
        router.replace("/doctor/home");
        return;
      }
      if (user.role === "patient") {
        router.replace("/patient/dashboard");
        return;
      }
    }
    setIsLoading(false);
  }, [user, router]);

  // Hold the spinner until the auth check resolves so logged-in users are
  // redirected to their dashboard rather than flashing the public landing.
  if (isLoading) return <Spinner />;

  return <StoryExperience />;
}
