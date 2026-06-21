export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a, b, t) => a + (b - a) * t;

/** Classic Hermite smoothstep — eases the start and end of a 0→1 ramp. */
export const smoothstep = (edge0, edge1, x) => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const lerpTuple = (a, b, t) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/**
 * Frame-rate independent damping (same easing model drei/maath use). Returns
 * the value moved toward `target` by an amount that respects elapsed `dt`.
 */
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Reveal envelope for a chapter. Ramps 0→1 as the master progress enters the
 * chapter's scroll band and back to 0 as it leaves, with a soft feather so
 * nothing pops in or out. The hero chapter (index 0) stays lit at the very top.
 */
export const windowReveal = (progress, index, count, feather = 0.12) => {
  const band = 1 / count;
  const start = index * band;
  const end = (index + 1) * band;
  const rampIn = smoothstep(start - feather, start + feather * 0.5, progress);
  const rampOut = 1 - smoothstep(end - feather * 0.5, end + feather, progress);
  const base =
    index === 0
      ? Math.max(rampOut, 1 - smoothstep(0, feather, progress))
      : rampIn;
  return clamp(base * (index === 0 ? 1 : rampOut), 0, 1);
};

/** Map master progress to a continuous chapter position, e.g. 2.4. */
export const chapterPosition = (progress, count) =>
  clamp(progress, 0, 0.99999) * count;
