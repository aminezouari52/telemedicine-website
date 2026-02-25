import { Spinner as ShadcnSpinner } from "@/components/ui/spinner";

const Spinner = () => {
  return (
    <div className="bg-[#b0afff] absolute inset-0 w-screen h-screen flex items-center justify-center z-[5]">
      <ShadcnSpinner size="lg" className="text-primary-500" />
    </div>
  );
};

export default Spinner;
