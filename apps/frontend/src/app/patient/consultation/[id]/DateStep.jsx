import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function getDateString(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return "";
  }
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeString(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return "";
  }
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function DateStep({ goToNext, goToPrevious, form, stepSchema }) {
  const handleNext = () => {
    form.clearErrors("date");
    const result = stepSchema.safeParse(form.getValues());
    if (!result.success) {
      const message =
        result.error.issues.find((i) => i.path[0] === "date")?.message ??
        "Date is required";
      form.setError("date", { type: "manual", message });
      return;
    }
    goToNext();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-lg font-semibold">Choose date and time</h3>
      <div className="flex flex-col gap-4 w-full">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-primary-500"
                  type="date"
                  value={getDateString(field.value)}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) {
                      field.onChange(null);
                      return;
                    }
                    const [year, month, day] = value.split("-").map(Number);
                    const current =
                      field.value instanceof Date &&
                      !Number.isNaN(field.value.getTime())
                        ? field.value
                        : new Date();
                    const updated = new Date(
                      year,
                      month - 1,
                      day,
                      current.getHours(),
                      current.getMinutes(),
                    );
                    field.onChange(updated);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-primary-500"
                  type="time"
                  value={getTimeString(field.value)}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) {
                      const current =
                        field.value instanceof Date &&
                        !Number.isNaN(field.value.getTime())
                          ? field.value
                          : new Date();
                      const cleared = new Date(
                        current.getFullYear(),
                        current.getMonth(),
                        current.getDate(),
                        0,
                        0,
                      );
                      field.onChange(cleared);
                      return;
                    }
                    const [hours, minutes] = value.split(":").map(Number);
                    const current =
                      field.value instanceof Date &&
                      !Number.isNaN(field.value.getTime())
                        ? field.value
                        : new Date();
                    const updated = new Date(
                      current.getFullYear(),
                      current.getMonth(),
                      current.getDate(),
                      hours,
                      minutes,
                    );
                    field.onChange(updated);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={goToPrevious}>
            Previous
          </Button>
          <Button type="button" onClick={handleNext}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DateStep;
