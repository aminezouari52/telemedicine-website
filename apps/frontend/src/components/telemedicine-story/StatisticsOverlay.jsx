"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import TiltedCard from "@/components/ui/TiltedCard";
import AnimatedCounter from "@/components/home/AnimatedCounter";
import ChartAnimation from "@/components/home/ChartAnimation";
import { clamp, smoothstep } from "./lib/math";
import { SECTION_COUNT, STORY_SECTIONS } from "./config";

const STATS = [
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

const CHART_DATA = [
  { x: 0, y: 35 },
  { x: 25, y: 40 },
  { x: 50, y: 45 },
  { x: 75, y: 50 },
  { x: 100, y: 60 },
];

/** Scroll band for the "consultation" chapter (index 2 of the corridor). */
const CHAPTER_INDEX =
  STORY_SECTIONS.findIndex((s) => s.id === "consultation") ?? 2;

/**
 * The chapter-3 visual. Instead of the old 3D diagnostic panels, the real
 * home-page statistics cards are flown in here: as the master scroll progress
 * enters the consultation band they scale up and fade in, hold fixed across the
 * middle of the band, then scale back down on the way out.
 *
 * Like the WebGL scenes, this is a fixed layer driven by the shared
 * `progressRef` through a render-free rAF loop — no React state, no re-renders
 * while scrolling.
 *
 * @param {object} props
 * @param {import("react").MutableRefObject<number>} props.progress
 */
export default function StatisticsOverlay({ progress }) {
  const router = useRouter();
  const stageRef = useRef(null);

  useEffect(() => {
    const band = 1 / SECTION_COUNT;
    const start = CHAPTER_INDEX * band;
    const end = (CHAPTER_INDEX + 1) * band;
    // Ramp in over the first ~38% of the band, hold, ramp out over the last ~38%.
    const inEnd = start + band * 0.38;
    const outStart = end - band * 0.38;

    let raf = 0;
    const tick = () => {
      const stage = stageRef.current;
      if (stage) {
        const p = progress.current ?? 0;
        const rampIn = smoothstep(start, inEnd, p);
        const rampOut = 1 - smoothstep(outStart, end, p);
        const reveal = clamp(Math.min(rampIn, rampOut), 0, 1);

        stage.style.opacity = String(reveal);
        stage.style.transform = `scale(${0.72 + reveal * 0.28})`;
        // Only let the cards catch clicks once they're essentially settled.
        stage.style.pointerEvents = reveal > 0.85 ? "auto" : "none";
        stage.style.visibility = reveal > 0.002 ? "visible" : "hidden";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div
        ref={stageRef}
        style={{
          opacity: 0,
          transform: "scale(0.72)",
          transformOrigin: "center",
          visibility: "hidden",
          willChange: "transform, opacity",
        }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
            Data-driven care
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Measurable results.
          </h2>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* Statistics cards */}
          <div className="space-y-8">
            {STATS.map((stat) => (
              <TiltedCard
                key={stat.label}
                rotateAmplitude={6}
                scaleOnHover={1.02}
                containerHeight="220px"
                containerWidth="100%"
              >
                <div className="h-full w-full rounded-[15px] border border-gray-700/50 bg-gray-900/60 p-8 backdrop-blur-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-bold text-primary-400 md:text-6xl lg:text-7xl">
                        <AnimatedCounter
                          value={stat.value}
                          decimals={stat.value % 1 !== 0 ? 1 : 0}
                          suffix={stat.suffix}
                        />
                      </span>
                      <div
                        className={`rounded-lg bg-gray-800 p-3 ${stat.iconColor}`}
                      >
                        <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">
                        {stat.label}
                      </h3>
                      <p className="text-sm text-gray-400 md:text-base">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </TiltedCard>
            ))}
          </div>

          {/* Chart card */}
          <Card className="h-full border border-gray-800 bg-gray-900/60 shadow-lg backdrop-blur-md">
            <CardContent className="h-full p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold uppercase tracking-wide text-white">
                  Patient Activity
                </h3>
                <div className="flex w-full items-center justify-center py-8">
                  <ChartAnimation
                    data={CHART_DATA}
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
                    className="w-full rounded-full bg-primary-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-600"
                    onClick={() => router.push("/auth/register")}
                  >
                    Read More
                  </button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
