import * as React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NumberInput = React.forwardRef(
  ({ className, value, onChange, min, max, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value || "");

    React.useEffect(() => {
      setLocalValue(value || "");
    }, [value]);

    const handleChange = (e) => {
      const newValue = e.target.value;
      if (newValue === "" || /^\d+$/.test(newValue)) {
        setLocalValue(newValue);
        if (onChange) {
          const numValue = newValue === "" ? 0 : parseInt(newValue, 10);
          onChange(numValue);
        }
      }
    };

    const increment = () => {
      const current = parseInt(localValue || "0", 10);
      const newValue =
        max !== undefined ? Math.min(current + 1, max) : current + 1;
      setLocalValue(newValue.toString());
      if (onChange) onChange(newValue);
    };

    const decrement = () => {
      const current = parseInt(localValue || "0", 10);
      const newValue =
        min !== undefined ? Math.max(current - 1, min) : current - 1;
      setLocalValue(newValue.toString());
      if (onChange) onChange(newValue);
    };

    return (
      <div className={cn("relative flex", className)}>
        <Input
          ref={ref}
          type="text"
          value={localValue}
          onChange={handleChange}
          className="pr-16"
          {...props}
        />
        <div className="absolute right-0 top-0 h-full flex flex-col border-l">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-1/2 rounded-none border-b"
            onClick={increment}
            disabled={
              max !== undefined && parseInt(localValue || "0", 10) >= max
            }
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-1/2 rounded-none"
            onClick={decrement}
            disabled={
              min !== undefined && parseInt(localValue || "0", 10) <= min
            }
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
