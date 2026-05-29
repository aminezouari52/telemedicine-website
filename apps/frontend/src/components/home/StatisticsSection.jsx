"use client";

import { motion } from "framer-motion";
import { Heart, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import TiltedCard from "@/components/ui/TiltedCard";
import AnimatedCounter from "./AnimatedCounter";
import ChartAnimation from "./ChartAnimation";
import FadeInOnScroll from "./FadeInOnScroll";
import BlurText from "@/components/ui/BlurText";

function StatisticsSection() {
  const router = useRouter();
  const stats = [
    {
      value: 99.9,
      suffix: "%",
      label: "patient satisfaction rate",
      description: "Our commitment to excellence ensures exceptional care.",
      icon: Heart,
      iconColor: "text-red-500",
    },
    {
      value: 35,
      suffix: "%",
      label: "reduction in readmission rates",
      description: "Better outcomes through continuous monitoring.",
      icon: TrendingDown,
      iconColor: "text-green-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(97, 94, 252, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(97, 94, 252, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <BlurText
              text="Data-driven care, measurable results."
              delay={60}
              direction="top"
              className="justify-center"
              animateBy="words"
            />
          </h2>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Statistics Cards */}
          <div className="space-y-8">
            {stats.map((stat, index) => (
              <FadeInOnScroll key={index} direction="right" delay={index * 0.2}>
                <TiltedCard
                  rotateAmplitude={6}
                  scaleOnHover={1.02}
                  containerHeight="240px"
                  containerWidth="100%"
                >
                  <div className="w-full h-full p-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-[15px]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-400">
                            <AnimatedCounter
                              value={stat.value}
                              decimals={stat.value % 1 !== 0 ? 1 : 0}
                              suffix={stat.suffix}
                            />
                          </span>
                        </div>
                        {stat.icon && (
                          <div
                            className={`p-3 rounded-lg bg-gray-800 ${stat.iconColor}`}
                          >
                            <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                          {stat.label}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltedCard>
              </FadeInOnScroll>
            ))}
          </div>

          {/* Chart Section */}
          <FadeInOnScroll direction="left" delay={0.4} className="h-full">
            <Card className="border border-gray-800 shadow-lg bg-gray-800/30 backdrop-blur-sm h-full">
              <CardContent className="p-8 h-full">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white uppercase tracking-wide">
                    Patient Activity
                  </h3>
                  <div className="flex justify-center items-center py-8 w-full">
                    <ChartAnimation
                      data={[
                        { x: 0, y: 35 },
                        { x: 25, y: 40 },
                        { x: 50, y: 45 },
                        { x: 75, y: 50 },
                        { x: 100, y: 60 },
                      ]}
                      width={400}
                      height={200}
                      className="max-w-full"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className="bg-primary-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-600 transition-colors w-full"
                      onClick={() => {
                        router.push("/auth/register");
                      }}
                    >
                      Read More
                    </button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
