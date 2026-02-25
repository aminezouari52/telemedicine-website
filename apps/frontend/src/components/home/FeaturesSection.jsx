"use client";

import { motion } from "framer-motion";
import { Stethoscope, Microscope, Activity, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FadeInOnScroll from "./FadeInOnScroll";

function FeaturesSection() {
  const router = useRouter();
  const features = [
    {
      icon: Stethoscope,
      title: "Primary Care",
      description:
        "Comprehensive primary healthcare services delivered virtually with personalized attention to your needs.",
      color: "text-blue-500",
    },
    {
      icon: Microscope,
      title: "Diagnostics",
      description:
        "Advanced diagnostic capabilities and test result analysis to help you understand your health better.",
      color: "text-green-500",
    },
    {
      icon: Activity,
      title: "Advanced Diagnostics",
      description:
        "Cutting-edge diagnostic tools and continuous health monitoring for proactive care management.",
      color: "text-purple-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg
          width="100%"
          height="200"
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 150 Q300 50 500 150 T900 150"
            stroke="#615EFC"
            strokeWidth="2"
          />
          <circle cx="200" cy="100" r="30" fill="#615EFC" />
          <path
            d="M400 50 L450 100 L400 150"
            stroke="#615EFC"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Holistic Health{" "}
            <span className="text-gray-500">Infrastructure.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive healthcare ecosystem designed to provide seamless,
            integrated medical services that prioritize your well-being.
          </p>
        </FadeInOnScroll>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeInOnScroll key={index} direction="up" delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="h-full group"
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
                    <CardHeader className="pb-4">
                      <div
                        className={`inline-flex p-3 rounded-lg bg-gray-50 group-hover:bg-primary-50 transition-colors ${feature.color}`}
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-8 w-8" />
                        </motion.div>
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mt-4">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeInOnScroll>
            );
          })}
        </div>

        {/* Read More Button */}
        <FadeInOnScroll direction="up" delay={0.6} className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8"
              onClick={() => router.push("/services")}
            >
              Read More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

export default FeaturesSection;
