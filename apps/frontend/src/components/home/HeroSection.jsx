"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/navbar/PublicNavbar";

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

function HeroSection() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center relative min-h-screen">
      {/* Navigation Bar */}
      <PublicNavbar transparent={true} />

      {/* Video Background */}
      <div className="absolute inset-0 h-screen w-full">
        <video loop muted autoPlay playsInline style={videoStyle}>
          <source
            src="https://res.cloudinary.com/dfzx2pdi3/video/upload/v1739200039/dn3xyzxsq8qruqojnpkj.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Precision Focused{" "}
              <span className="text-primary-400">Healthcare</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Access online consultations with qualified professionals, wherever
              you are. Simplify your procedures and get personalized advice in
              just a few clicks.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-primary-500 text-white px-8 py-6 text-lg font-semibold rounded-full hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push("/auth/register")}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
