"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Wires every DOM-side scroll behaviour through a single GSAP context:
 *
 *  1. A master `ScrollTrigger` scrubs the whole page into `progressRef`, which
 *     the fixed Three.js canvas reads each frame (no React state, no re-renders).
 *  2. Each `[data-chapter]` block gets its own scrubbed reveal so copy eases in
 *     and out as it crosses the viewport — the "pinned storytelling" feel, with
 *     the canvas acting as the permanent pin behind the text.
 *  3. The hero plays a one-shot cinematic entrance on load.
 *
 * Everything lives in a `gsap.context` scoped to `rootRef`, so a single
 * `ctx.revert()` cleans up all triggers on unmount or Fast Refresh.
 *
 * @param {object}  args
 * @param {import("react").RefObject<HTMLElement>} args.rootRef
 * @param {import("react").MutableRefObject<number>} args.progressRef
 * @param {import("react").RefObject<HTMLElement>} args.progressBarRef
 * @param {import("react").MutableRefObject<{reviews:number,faq:number}>} [args.tailRef]
 * @param {boolean} args.reducedMotion
 * @param {boolean} [args.ready] Marketing tail mounted — wire its scroll triggers.
 */
export function useStoryScroll({
  rootRef,
  progressRef,
  progressBarRef,
  tailRef,
  reducedMotion,
  ready,
}) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1 · Master progress driver for the 3D scenes. Scoped to the story
      // sections only, so `progress` reaches 1 exactly as the final chapter
      // (the globe finale) lands and the camera choreography completes — the
      // marketing block below must NOT stretch this range.
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: reducedMotion ? false : 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // 1b · Reading progress bar — measured across the entire document
      // (`end: "max"` tracks the full scroll height, including the testimonials,
      // FAQ and footer that follow the story). This fills the bar to 100% only
      // when the footer is reached, not when the 3D story ends.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        scrub: reducedMotion ? false : 0.6,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });

      // 2 · Per-chapter copy reveals.
      const chapters = gsap.utils.toArray("[data-chapter]");
      chapters.forEach((chapter) => {
        const inner = chapter.querySelector("[data-chapter-inner]");
        if (!inner) return;

        if (reducedMotion) {
          gsap.set(inner, { opacity: 1, y: 0, filter: "blur(0px)" });
          return;
        }

        gsap.fromTo(
          inner,
          { opacity: 0, y: 64, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top 78%",
              end: "top 32%",
              scrub: true,
            },
          },
        );

        // Fade copy back out as the chapter leaves, so scenes never fight text.
        gsap.fromTo(
          inner,
          { opacity: 1, y: 0, filter: "blur(0px)" },
          {
            opacity: 0,
            y: -48,
            filter: "blur(10px)",
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "bottom 62%",
              end: "bottom 18%",
              scrub: true,
            },
          },
        );
      });

      // 3 · Hero cinematic entrance (one-shot, not scrubbed).
      const heroTargets = gsap.utils.toArray("[data-hero-stagger]");
      if (heroTargets.length && !reducedMotion) {
        gsap.from(heroTargets, {
          opacity: 0,
          y: 40,
          filter: "blur(16px)",
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.18,
          delay: 0.35,
        });
      }

      // 4 · Fade the scroll indicator away as soon as the journey begins.
      gsap.to("[data-scroll-indicator]", {
        opacity: 0,
        y: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "6% top",
          scrub: true,
        },
      });
    }, root);

    // Fonts / layout can shift heights after mount; recalc once settled.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [rootRef, progressRef, progressBarRef, reducedMotion]);

  // Marketing-tail scroll tracking. Kept in its own effect (keyed on `ready`)
  // because the testimonials / FAQ sections mount after hydration — their DOM
  // nodes don't exist when the main effect runs. Each `[data-tail-chapter]`
  // block scrubs its own 0→1 progress into `tailRef`, which the matching 3D
  // backdrop reads each frame. Rebuilding these here (rather than in the main
  // context) avoids replaying the hero's one-shot entrance on mount.
  useIsomorphicLayoutEffect(() => {
    if (!ready || !tailRef) return;
    gsap.registerPlugin(ScrollTrigger);

    const triggers = gsap.utils.toArray("[data-tail-chapter]").map((el) => {
      const id = el.getAttribute("data-tail-chapter");
      return ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (tailRef.current) tailRef.current[id] = self.progress;
        },
      });
    });

    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.kill());
  }, [ready, tailRef]);
}
