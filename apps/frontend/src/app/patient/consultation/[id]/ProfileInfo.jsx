import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileFieldNames = [
  "firstName",
  "lastName",
  "age",
  "phone",
  "address",
  "city",
  "zip",
  "weight",
  "patient",
  "doctor",
  "isProfileCompleted",
];

function ProfileInfo({ goToNext, onCancel, form, stepSchema }) {
  const handleNext = () => {
    form.clearErrors(profileFieldNames);
    const result = stepSchema.safeParse(form.getValues());
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          form.setError(key, { type: "manual", message: issue.message });
        }
      }
      return;
    }
    goToNext();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-lg font-semibold">Profile information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-primary-500"
                  type="number"
                  min={18}
                  max={100}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="focus-visible:ring-primary-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (optional)</FormLabel>
              <FormControl>
                <Input className="focus-visible:ring-primary-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ProfileInfo;
