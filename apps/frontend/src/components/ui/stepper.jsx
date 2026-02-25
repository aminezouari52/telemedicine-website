import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Stepper = ({ activeStep, steps, className }) => {
  return (
    <div className={cn("flex items-center pb-10", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                index < activeStep
                  ? "bg-primary-500 border-primary-500 text-white"
                  : index === activeStep
                    ? "border-primary-500 text-primary-500"
                    : "border-gray-300 text-gray-400",
              )}
            >
              {index < activeStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-24 mx-4",
                index < activeStep ? "bg-primary-500" : "bg-gray-300",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Stepper };
