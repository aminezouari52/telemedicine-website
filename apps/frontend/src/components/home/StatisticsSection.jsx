"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SpotlightCard from "@/components/ui/spotlight-card";
import AnimatedCounter from "./AnimatedCounter";
import ChartAnimation from "./ChartAnimation";
import FadeInOnScroll from "./FadeInOnScroll";

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(97, 94, 252, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(97, 94, 252, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Data-driven care,{" "}
            <span className="text-primary-500">measurable results.</span>
          </h2>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Statistics Cards */}
          <div className="space-y-8">
            {stats.map((stat, index) => (
              <FadeInOnScroll key={index} direction="right" delay={index * 0.2}>
                <SpotlightCard
                  spotlightColor="rgba(97, 94, 252, 0.4)"
                  className="h-full"
                >
                  <div className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-500">
                            <AnimatedCounter
                              value={stat.value}
                              decimals={stat.value % 1 !== 0 ? 1 : 0}
                              suffix={stat.suffix}
                            />
                          </span>
                        </div>
                        {stat.icon && (
                          <div
                            className={`p-3 rounded-lg bg-gray-50 ${stat.iconColor}`}
                          >
                            <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                          {stat.label}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInOnScroll>
            ))}
          </div>

          {/* Chart Section */}
          <FadeInOnScroll direction="left" delay={0.4}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">
                    Patient Activity
                  </h3>
                  <div className="flex justify-center items-center py-8 w-full">
                    <ChartAnimation
                      data={[
                        { x: 0, y: 60 },
                        { x: 25, y: 50 },
                        { x: 50, y: 45 },
                        { x: 75, y: 40 },
                        { x: 100, y: 35 },
                      ]}
                      width={400}
                      height={200}
                      className="max-w-full"
                    />
                  </div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full group border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all"
                      onClick={() => router.push("/research")}
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
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
