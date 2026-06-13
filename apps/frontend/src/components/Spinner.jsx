import PulseOrb from "@/components/PulseOrb";

/** Full-screen branded loading overlay. */
const Spinner = () => {
  return (
    <div className="bg-primary-50 absolute inset-0 w-screen h-screen flex items-center justify-center z-[5]">
      <PulseOrb size="lg" />
    </div>
  );
};

export default Spinner;
