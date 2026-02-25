import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const InputField = ({
  label,
  labelColor,
  isRequired,
  labelWeight = "normal",
  name,
  control,
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col">
          <FormLabel
            className={cn(
              "ms-1",
              labelColor && `text-[${labelColor}]`,
              labelWeight === "bold" && "font-bold",
            )}
          >
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input className={cn("rounded-[15px]")} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
