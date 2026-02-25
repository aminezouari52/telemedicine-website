"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useState } from "react";

const RadioCard = ({ name, defaultValue, handleChange, options }) => {
  const [value, setValue] = useState(defaultValue || "");

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (handleChange) {
      handleChange(newValue);
    }
  };

  return (
    <RadioGroup value={value} onValueChange={handleValueChange} name={name}>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={option.value}
              className={cn(
                "flex items-center gap-4 px-6 py-4 border-3 rounded-md cursor-pointer transition-all",
                isChecked
                  ? "border-primary-500"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex items-center gap-4 w-full justify-between text-xl">
                <span
                  className={cn(
                    "font-semibold",
                    isChecked ? "text-black" : "text-gray-500",
                  )}
                >
                  {option.title}
                </span>
                {option.icon && (
                  <div
                    className={cn(isChecked ? "text-red-500" : "text-gray-300")}
                  >
                    {typeof option.icon === "function"
                      ? option.icon({ className: "h-5 w-5" })
                      : option.icon}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </RadioGroup>
  );
};

export default RadioCard;
