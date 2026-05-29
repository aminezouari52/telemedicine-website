"use client";

import { motion } from "framer-motion";
import { Stethoscope, Microscope, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import FadeInOnScroll from "./FadeInOnScroll";
import BlurText from "@/components/ui/BlurText";

function FeaturesSection() {
  const router = useRouter();
  const features = [
    {
      icon: Stethoscope,
      title: "Primary Care",
      description:
        "Comprehensive primary healthcare services delivered virtually with personalized attention to your needs.",
      color: "text-blue-400",
    },
    {
      icon: Microscope,
      title: "Diagnostics",
      description:
        "Advanced diagnostic capabilities and test result analysis to help you understand your health better.",
      color: "text-blue-400",
    },
    {
      icon: Activity,
      title: "Advanced Diagnostics",
      description:
        "Cutting-edge diagnostic tools and continuous health monitoring for proactive care management.",
      color: "text-blue-400",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <BlurText
              text="Holistic Health Infrastructure."
              delay={60}
              direction="top"
              className="justify-center"
              animateBy="words"
            />
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A comprehensive healthcare ecosystem designed to provide seamless,
            integrated medical services that prioritize your well-being.
          </p>
        </FadeInOnScroll>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const gradientFrom = "from-blue-500/20";
            const borderColor = "border-blue-500/20";
            const glowColor = "shadow-blue-500/5";

            return (
              <FadeInOnScroll key={index} direction="up" delay={index * 0.15}>
                <motion.div className="h-full group">
                  <div
                    className={`relative h-full rounded-2xl border ${borderColor} bg-gradient-to-b ${gradientFrom} to-gray-800/50 backdrop-blur-sm shadow-lg ${glowColor} hover:shadow-xl hover:${glowColor.replace("/5", "/20")} transition-all duration-500 overflow-hidden`}
                  >
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-60" />
                    {/* Glow dot in corner */}
                    <div
                      className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${
                        index === 0
                          ? "from-blue-500/10 to-transparent"
                          : index === 1
                            ? "from-green-500/10 to-transparent"
                            : "from-purple-500/10 to-transparent"
                      } blur-2xl`}
                    />
                    <div className="p-8 relative z-10">
                      <div className="inline-flex p-3 rounded-xlbg-blue-500/10 text-blue-400">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mt-6 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeInOnScroll>
            );
          })}
        </div>

        {/* Read More Button */}
        <FadeInOnScroll direction="up" delay={0.6} className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              className="bg-primary-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-600 transition-colors"
              onClick={() => {
                router.push("/auth/register");
              }}
            >
              Read More
            </button>
          </motion.div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

export default FeaturesSection;
