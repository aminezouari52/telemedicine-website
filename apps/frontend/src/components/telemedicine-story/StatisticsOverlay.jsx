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
 * Per-element choreography. Each animated card declares where it flies in from
 * (`enter`) and where it drifts off to as the group zooms past the viewer
 * (`exit`). `phase` desyncs the idle float so the cards never breathe in unison.
 * Order here is the stagger order: header first, then the two stat cards, then
 * the chart.
 */
const CHOREO = [
  { enter: { x: 0, y: -48 }, exit: { x: 0, y: -60 }, phase: 0.0 }, // header
  { enter: { x: -72, y: 36 }, exit: { x: -70, y: 10 }, phase: 1.3 }, // stat 0
  { enter: { x: -72, y: 56 }, exit: { x: -70, y: 30 }, phase: 2.6 }, // stat 1
  { enter: { x: 84, y: 44 }, exit: { x: 80, y: 20 }, phase: 3.9 }, // chart
];

/**
 * Remap a global 0→1 entrance ramp into a single element's own window so the
 * cards cascade in one after another instead of arriving together.
 */
const staggered = (rampIn, index, count, span = 0.62) => {
  const step = (1 - span) / Math.max(1, count - 1);
  return clamp((rampIn - index * step) / span, 0, 1);
};

/**
 * The chapter-3 visual. Instead of the old 3D diagnostic panels, the real
 * home-page statistics cards are flown in here: as the master scroll progress
 * enters the consultation band each card cascades in from its own direction,
 * settles into a gentle idle float, then — on the way out — the whole group
 * zooms up toward the viewer while the cards drift apart and fade.
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
  const cardRefs = useRef([]);
  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
  };

  useEffect(() => {
    const band = 1 / SECTION_COUNT;
    const start = CHAPTER_INDEX * band;
    const end = (CHAPTER_INDEX + 1) * band;
    // Ramp in over the first ~42% of the band, hold, ramp out over the last ~42%.
    const inEnd = start + band * 0.42;
    const outStart = end - band * 0.42;
    const count = CHOREO.length;

    let raf = 0;
    const tick = () => {
      const stage = stageRef.current;
      if (stage) {
        const p = progress.current ?? 0;
        const rampIn = smoothstep(start, inEnd, p);
        const rampOut = smoothstep(outStart, end, p); // 0 held → 1 fully exited
        const held = rampIn * (1 - rampOut);
        const t = performance.now() / 1000;

        // The group zooms toward the camera as it leaves — scale grows past 1.
        stage.style.transform = `scale(${1 + rampOut * 0.55})`;
        stage.style.pointerEvents = held > 0.85 ? "auto" : "none";
        stage.style.visibility = rampIn > 0.002 ? "visible" : "hidden";

        for (let i = 0; i < count; i += 1) {
          const el = cardRefs.current[i];
          if (!el) continue;
          const c = CHOREO[i];
          const reveal = staggered(rampIn, i, count); // 0→1 cascade entrance
          const idle = Math.sin(t * 0.9 + c.phase) * 5 * held;

          const x = c.enter.x * (1 - reveal) + c.exit.x * rampOut;
          const y = c.enter.y * (1 - reveal) + c.exit.y * rampOut + idle;
          const scale = 0.86 + reveal * 0.14;
          const rot =
            (1 - reveal) * (c.enter.x < 0 ? -4 : c.enter.x > 0 ? 4 : 0);

          el.style.opacity = String(reveal * (1 - rampOut));
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;
        }
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
          transform: "scale(1)",
          transformOrigin: "center",
          visibility: "hidden",
          willChange: "transform",
        }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div
          ref={setCardRef(0)}
          style={{ opacity: 0, willChange: "transform, opacity" }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300/90">
            Data-driven care
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Measurable results.
          </h2>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* Statistics cards */}
          <div className="space-y-8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                ref={setCardRef(1 + i)}
                style={{ opacity: 0, willChange: "transform, opacity" }}
              >
                <TiltedCard
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
              </div>
            ))}
          </div>

          {/* Chart card */}
          <div
            ref={setCardRef(3)}
            style={{ opacity: 0, willChange: "transform, opacity" }}
            className="h-full"
          >
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
    </div>
  );
}
