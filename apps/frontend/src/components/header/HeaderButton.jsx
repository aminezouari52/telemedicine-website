"use client";

// HOOKS
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeaderButton = ({ pathname, children }) => {
  const router = useRouter();
  const path = usePathname();
  const [isHovering, setIsHovering] = useState(false);

  const isActive = path === pathname || isHovering;

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-full flex relative py-0 px-2 font-bold tracking-wider transition-all duration-200",
        isActive ? "text-primary-500" : "text-black",
      )}
      onClick={() => router.push(pathname)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <div
        className={cn(
          "absolute left-0 bottom-0 h-[3px] rounded-sm bg-primary-500 transition-all duration-300 ease-in-out",
          isActive ? "w-full" : "w-0",
        )}
      />
    </Button>
  );
};

export default HeaderButton;
