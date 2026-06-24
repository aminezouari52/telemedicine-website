"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/home/AnimatedCounter";
import { cn } from "@/lib/utils";

const ALIGN_TO_JUSTIFY = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

/**
 * One full-viewport DOM chapter rendered over the fixed 3D canvas. The
 * `data-chapter` / `data-chapter-inner` hooks are what `useStoryScroll` drives.
 * Copy lives in the DOM (not WebGL) so it stays crisp and accessible.
 */
export function StorySection({ section }) {
  const router = useRouter();

  // Overlay-driven chapters (e.g. the statistics cards) render their own fixed
  // DOM visual elsewhere; here we only reserve the scroll height so the master
  // progress banding for the chapter is preserved. They carry no copy, so bail
  // before touching title/body fields.
  if (section.overlay) {
    return (
      <section
        data-chapter
        data-chapter-id={section.id}
        className="relative min-h-screen"
      />
    );
  }

  const titleLines = section.title.split("\n");
  const isHero = !!section.hero;

  return (
    <section
      data-chapter
      data-chapter-id={section.id}
      className="relative flex min-h-screen items-center px-6 py-24 md:px-12"
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl",
          ALIGN_TO_JUSTIFY[section.align],
        )}
      >
        <div
          data-chapter-inner
          className={cn(
            "relative w-full",
            isHero
              ? "isolate max-w-3xl"
              : cn(
                  "max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-12",
                  "shadow-[0_20px_80px_-20px_rgba(97,94,252,0.25)] ring-1 ring-white/5",
                ),
          )}
        >
          {/* Soft radial scrim — lifts hero copy off the 3D without a card. */}
          {isHero && (
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(5,7,15,0.78),rgba(5,7,15,0.45)_45%,transparent_72%)] blur-2xl"
            />
          )}

          {/* Eyebrow */}
          {section.eyebrow && (
            <p
              data-hero-stagger={isHero ? "" : undefined}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300/90"
            >
              {section.eyebrow}
            </p>
          )}

          {/* Title */}
          <h2
            data-hero-stagger={isHero ? "" : undefined}
            className={cn(
              "bg-gradient-to-br from-white via-[#dfdffe] to-[#9896fd] bg-clip-text font-bold leading-[1.05] text-transparent",
              isHero
                ? "text-4xl drop-shadow-[0_2px_24px_rgba(5,7,15,0.85)] sm:text-6xl lg:text-7xl"
                : "text-3xl sm:text-4xl lg:text-5xl",
            )}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Body */}
          <p
            data-hero-stagger={isHero ? "" : undefined}
            className={cn(
              "mt-6 text-balance text-white/70",
              isHero
                ? "text-lg text-white/85 [text-shadow:0_1px_16px_rgba(5,7,15,0.9)] sm:text-xl"
                : "text-base sm:text-lg",
              section.align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {section.body}
          </p>

          {/* Metrics (Remote Monitoring) */}
          {section.metrics && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {section.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left backdrop-blur-md"
                >
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      value={metric.value}
                      decimals={metric.decimals}
                      suffix={metric.suffix}
                    />
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-white/50">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA (Finale) */}
          {section.cta && (
            <div
              data-hero-stagger={isHero ? "" : undefined}
              className={cn(
                "mt-10 flex",
                section.align === "center" && "justify-center",
              )}
            >
              <div className="group relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700 opacity-60 blur-lg transition-opacity duration-500 group-hover:opacity-90" />
                <Button
                  size="lg"
                  className="relative rounded-full bg-gradient-to-r from-primary-500 to-primary-700 px-9 py-7 text-base font-semibold text-white shadow-lg shadow-primary-500/20 transition-shadow hover:shadow-primary-500/40"
                  onClick={() => router.push(section.cta.href)}
                >
                  <span>{section.cta.label}</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
