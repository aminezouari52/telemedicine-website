"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Spinner from "@/components/Spinner";

// Home sections
import HeroSection from "@/components/home/HeroSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/home/ScrollToTop";
import AnimatedGridBackground from "@/components/home/AnimatedGridBackground";

export default function HomePage() {
  const user = useSelector((state) => state.userReducer.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!!user?.token);

  useEffect(() => {
    if (user?.token) {
      if (user.role === "doctor") {
        router.replace("/doctor/home");
        return;
      }
      if (user.role === "patient") {
        router.replace("/patient/home");
        return;
      }
    }
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="overflow-x-hidden relative">
      <AnimatedGridBackground />
      <div className="relative z-[10]">
        <HeroSection />
        <StatisticsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}
