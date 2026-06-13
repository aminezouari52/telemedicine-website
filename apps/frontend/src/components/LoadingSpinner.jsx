import PulseOrb from "@/components/PulseOrb";

/** Inline branded loader. `size="small"` renders a compact orb. */
function LoadingSpinner({ size = "default", className }) {
  return (
    <PulseOrb size={size === "small" ? "sm" : "md"} className={className} />
  );
}

export default LoadingSpinner;
