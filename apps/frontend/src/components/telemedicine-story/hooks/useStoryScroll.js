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
 * @param {boolean} args.reducedMotion
 */
export function useStoryScroll({
  rootRef,
  progressRef,
  progressBarRef,
  reducedMotion,
}) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1 · Master progress driver.
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: reducedMotion ? false : 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
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
}
