import { useEffect, useState } from "react";

/**
 * Respects the OS "reduce motion" setting. When true, the experience drops the
 * cinematic camera drift and continuous animation in favour of calm, static
 * compositions — an accessibility requirement for motion-heavy pages.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
