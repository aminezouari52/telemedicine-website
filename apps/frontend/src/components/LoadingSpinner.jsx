import { Spinner } from "@/components/ui/spinner";
import React from "react";

function LoadingSpinner({ size = "default" }) {
  return (
    <Spinner
      size={size === "small" ? "sm" : "default"}
      className="text-primary-500"
    />
  );
}

export default LoadingSpinner;
