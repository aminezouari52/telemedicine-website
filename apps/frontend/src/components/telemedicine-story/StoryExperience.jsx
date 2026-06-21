"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import { STORY_SECTIONS } from "./config";
import { StorySection } from "./sections/StorySection";
import StatisticsOverlay from "./StatisticsOverlay";
import { useStoryScroll } from "./hooks/useStoryScroll";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/** Lazy boot screen shown while the WebGL bundle + scene initialise. */
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#05070f]">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-orb-glow rounded-full bg-cyan-400/30 blur-2xl" />
        <div className="absolute inset-6 animate-orb-heartbeat rounded-full border border-cyan-300/40" />
      </div>
    </div>
  );
}

/**
 * Heavy Three.js bundle is code-split and client-only. `ssr: false` keeps WebGL
 * out of the server render and defers the download until the page mounts.
 */
const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/**
 * Top-level client experience: a fixed 3D canvas with a scrollable stack of
 * DOM chapters layered above it. All scroll behaviour is delegated to
 * `useStoryScroll`, which feeds a single render-free progress ref to the canvas.
 */
export default function StoryExperience() {
  const rootRef = useRef(null);
  const progressRef = useRef(0);
  const progressBarRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useStoryScroll({ rootRef, progressRef, progressBarRef, reducedMotion });

  return (
    <main className="relative min-h-screen bg-[#05070f] text-white antialiased">
      {/* Fixed WebGL stage. */}
      <div className="fixed inset-0 z-0">
        <Scene progress={progressRef} reducedMotion={reducedMotion} />
      </div>

      {/* Legibility vignette over the 3D. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,7,15,0.55)_100%)]"
      />

      {/* Chapter 3 visual — statistics cards scaled in over the scroll band. */}
      <StatisticsOverlay progress={progressRef} />

      {/* Brand navigation (reused from the rest of the site). */}
      <PublicNavbar />

      {/* Reading progress bar. */}
      <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-white/5">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500"
        />
      </div>

      {/* Scroll indicator (hero). */}
      <div
        data-scroll-indicator
        className="pointer-events-none fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.4em]">
          Scroll
        </span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/25 p-1">
          <span className="h-2 w-1 animate-orb-float rounded-full bg-cyan-300" />
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>

      {/* Scrollable chapter stack — drives the master ScrollTrigger. */}
      <div ref={rootRef} className="relative z-10">
        {STORY_SECTIONS.map((section) => (
          <StorySection key={section.id} section={section} />
        ))}
      </div>

      {/* Marketing sections appended below the story. Opaque backgrounds + a
          stacking context above the fixed WebGL canvas, so they scroll in over
          the 3D once the finale chapter has passed. */}
      <div className="relative z-10">
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}
