"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import BlurText from "@/components/ui/BlurText";
import ShinyText from "@/components/ui/ShinyText";
import FloatingLines from "@/components/ui/FloatingLines";

function HeroSection() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center relative min-h-screen">
      {/* Navigation Bar */}
      <PublicNavbar />

      {/* Floating Lines Background */}
      <FloatingLines
        animationSpeed={0.6}
        enabledWaves={["middle", "bottom"]}
        lineCount={[8, 6]}
        lineDistance={[8, 6]}
        bendRadius={4}
        bendStrength={-0.3}
        interactive={true}
        parallax={true}
        parallaxStrength={0.15}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="flex flex-wrap justify-center gap-x-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <BlurText
                text="Precision Focused"
                delay={80}
                direction="top"
                className="inline-flex text-white"
                animateBy="words"
              />
              <ShinyText
                text="Healthcare"
                speed={3}
                color="#9896fd"
                shineColor="#dfdffe"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
              />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              AI-powered consultations with qualified professionals, wherever
              you are.
            </p>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 flex justify-center"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 opacity-75 blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-shadow"
                onClick={() => router.push("/auth/register")}
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
