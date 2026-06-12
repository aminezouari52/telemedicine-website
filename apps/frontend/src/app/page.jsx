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

  return (
    <div className="overflow-x-hidden relative">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="relative z-[10]">
            <HeroSection />
            <StatisticsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <FAQSection />
            <Footer />
          </div>
        </>
      )}
      <ScrollToTop />
    </div>
  );
}
