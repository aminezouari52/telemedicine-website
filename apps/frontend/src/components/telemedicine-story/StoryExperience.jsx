"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
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
        <div className="absolute inset-0 animate-orb-glow rounded-full bg-primary-400/30 blur-2xl" />
        <div className="absolute inset-6 animate-orb-heartbeat rounded-full border border-primary-300/40" />
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
  // Per-section scroll progress for the marketing tail (reviews + FAQ). The
  // story `progress` is pinned at 1 down here, so these scenes ride their own
  // signal instead. Plain ref (object, not state) → no re-renders while scrolling.
  const tailRef = useRef({ reviews: 0, faq: 0 });
  const reducedMotion = usePrefersReducedMotion();

  // The marketing block (testimonials, FAQ, footer) is rendered client-only.
  // The fixed WebGL canvas is a `dynamic(..., { ssr: false })` boundary, and on
  // React 19 that shifts the `useId` sequence for everything hydrated after it —
  // which made the Radix FAQ accordion generate mismatched server/client IDs.
  // Mounting these after hydration sidesteps the mismatch entirely; the home
  // page keeps them server-rendered.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The marketing block adds page height after it mounts. Recalc ScrollTrigger
  // once it's in the DOM so the reading progress bar's `end: "max"` measures all
  // the way down to the footer rather than stopping at the end of the story.
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  useStoryScroll({
    rootRef,
    progressRef,
    progressBarRef,
    tailRef,
    reducedMotion,
    ready: mounted,
  });

  return (
    <main className="relative min-h-screen bg-[#05070f] text-white antialiased">
      {/* Fixed WebGL stage. */}
      <div className="fixed inset-0 z-0">
        <Scene
          progress={progressRef}
          tail={tailRef}
          reducedMotion={reducedMotion}
        />
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
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
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
          <span className="h-2 w-1 animate-orb-float rounded-full bg-primary-300" />
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>

      {/* Scrollable chapter stack — drives the master ScrollTrigger. */}
      <div ref={rootRef} className="relative z-10">
        {STORY_SECTIONS.map((section) => (
          <StorySection key={section.id} section={section} />
        ))}
      </div>

      {/* Marketing sections appended below the story. Testimonials + FAQ run
          transparent so the fixed star/globe canvas shows through as they scroll
          up over the finale; the footer keeps its solid background to close out
          the page. Client-only (see `mounted` above) to avoid the SSR hydration
          ID mismatch from the ssr:false canvas boundary. */}
      {mounted && (
        <div className="relative z-10">
          {/* `data-tail-chapter` lets useStoryScroll measure each section's own
              scroll progress to drive its matching 3D backdrop. */}
          <div data-tail-chapter="reviews">
            <TestimonialsSection transparent />
          </div>
          <div data-tail-chapter="faq">
            <FAQSection transparent />
          </div>
          <Footer />
        </div>
      )}

      {/* Back-to-top control. */}
      <ScrollToTopButton />
    </main>
  );
}
