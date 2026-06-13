/**
 * Brand pulse orb — a floating gradient orb with a sweeping ECG heartbeat line.
 * Echoes the stethoscope + pulse logo. This is the project's branded loading
 * indicator: rendered by the full-screen <Spinner /> overlay and the inline
 * <LoadingSpinner />, and used as the AI empty-state hero / "thinking" cue.
 */
const SIZES = {
  lg: { box: "h-24 w-24", stroke: 2.5 },
  md: { box: "h-12 w-12", stroke: 2 },
  sm: { box: "h-5 w-5", stroke: 2 },
};

export default function PulseOrb({
  size = "lg",
  floating = true,
  className = "",
}) {
  const { box, stroke } = SIZES[size] ?? SIZES.lg;
  return (
    <span
      className={`relative inline-flex items-center justify-center ${box} ${
        floating ? "motion-safe:animate-orb-float" : ""
      } ${className}`}
    >
      {/* soft glow aura */}
      <span className="absolute inset-0 rounded-full bg-primary-400/40 blur-xl motion-safe:animate-orb-glow" />
      {/* orb body */}
      <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30">
        {/* ECG heartbeat line */}
        <svg viewBox="0 0 48 48" className="h-3/5 w-3/5" fill="none">
          <path
            d="M4 24 H16 L20 14 L26 34 L30 24 H44"
            stroke="white"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            style={{ strokeDasharray: "20 100" }}
            className="motion-safe:animate-orb-heartbeat"
          />
        </svg>
      </span>
    </span>
  );
}
