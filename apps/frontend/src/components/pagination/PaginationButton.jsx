"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PaginationButton = ({ active, disabled, onClick, children }) => {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      className={cn(
        "rounded",
        active && "bg-primary-500 text-white hover:bg-primary-600",
        disabled && "opacity-60 cursor-not-allowed",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PaginationButton;
