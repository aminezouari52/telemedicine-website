"use client";

import { useEffect, useState } from "react";

function AnimatedGridBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setMounted(true);
    setScrollY(window.scrollY);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) return null;

  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 1000;
  const scanLine1 = (scrollY * 0.3) % viewportHeight;
  const scanLine2 = (scrollY * 0.3 + viewportHeight * 0.5) % viewportHeight;
  const scanLine3 = (scrollY * 0.45) % viewportHeight;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[8] overflow-hidden"
      aria-hidden="true"
    >
      {/* Animated Scan Lines */}
      <div className="absolute inset-0">
        {/* Primary scan line */}
        <div
          className="absolute w-full"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(97, 94, 252, 0.9), transparent)",
            top: `${scanLine1}px`,
            boxShadow: "0 0 20px rgba(97, 94, 252, 0.7)",
            opacity: 0.7,
          }}
        />

        {/* Secondary scan line */}
        <div
          className="absolute w-full"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(97, 94, 252, 0.7), transparent)",
            top: `${scanLine2}px`,
            boxShadow: "0 0 15px rgba(97, 94, 252, 0.5)",
            opacity: 0.5,
          }}
        />

        {/* Tertiary scan line */}
        <div
          className="absolute w-full"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(97, 94, 252, 0.6), transparent)",
            top: `${scanLine3}px`,
            boxShadow: "0 0 10px rgba(97, 94, 252, 0.4)",
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}

export default AnimatedGridBackground;
