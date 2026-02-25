"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();
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
      <Button
        size="sm"
        className="hover:opacity-80"
        onClick={() => router.push("/")}
      >
        Return to the home page
      </Button>
    </div>
  );
};

export default NotFound;
