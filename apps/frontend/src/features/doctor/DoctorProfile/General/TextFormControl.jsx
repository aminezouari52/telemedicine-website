import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const TextFormControl = ({ name, label, autoComplete, control, ...props }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel
            htmlFor={name}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              id={name}
              autoComplete={autoComplete}
              className={cn(
                "w-full text-sm shadow-sm rounded-md",
                fieldState.error
                  ? "border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : "focus-visible:ring-secondary-500 focus-visible:border-secondary-500",
              )}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextFormControl;
