import { Spinner } from "@/components/ui/spinner";
import React from "react";

function LoadingSpinner({ size = "default", className }) {
  return (
    <Spinner
      size={size === "small" ? "sm" : "default"}
      className={`text-primary-500 ${className || ""}`}
    />
  );
}

export default LoadingSpinner;
