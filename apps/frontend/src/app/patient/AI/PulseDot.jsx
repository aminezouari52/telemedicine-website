/** Small pulsing amber dot used as a "live / streaming" indicator. */
export default function PulseDot({ className = "" }) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
    </span>
  );
}
