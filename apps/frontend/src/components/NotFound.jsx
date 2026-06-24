import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="bg-white h-screen flex flex-col items-center justify-center gap-10">
      <Image
        src="/assets/not-found.svg"
        alt="Not found"
        width={400}
        height={400}
        className="w-[400px] h-[400px]"
      />
      <h1 className="text-xl font-semibold text-center">
        Sorry! The page you are looking for could not be found.
      </h1>
      {/* Real anchor (asChild) instead of an onClick handler so it navigates
          reliably even before/without client hydration on the 404 route. */}
      <Button asChild size="sm" className="hover:opacity-80">
        <Link href="/">Return to the home page</Link>
      </Button>
    </div>
  );
};

export default NotFound;
