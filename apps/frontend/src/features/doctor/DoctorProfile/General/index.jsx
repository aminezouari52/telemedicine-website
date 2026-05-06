"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast, useUserCheck } from "@/hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// FUNCTIONS
import { updateDoctor, uploadProfilePicture } from "@/services/doctorService";
import { getCurrentUser } from "@/services/authService";
import { setUser } from "@/reducers/userReducer";

// COMPONENTS
import ImageUpload from "@/components/ImageUpload";
import TextFormControl from "./TextFormControl";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const doctorProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  age: z
    .number()
    .min(18, "You must be at least 18 years old")
    .max(100, "Age cannot exceed 100 years"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]*$/, "Phone number is not valid"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(50, "Address cannot exceed 50 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City cannot exceed 50 characters"),
  zip: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[0-9]+$/, "Postal code must be a number")
    .min(4, "Postal code must be at least 4 digits")
    .max(5, "Postal code cannot exceed 5 digits"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  hospital: z.enum(
    [
      "Hospital Mongi Slim",
      "Hospital Charles Nicolle",
      "Hospital La Rabta",
      "Hospital Razi",
      "Hospital Sahloul",
      "Hospital Farhat Hached",
      "Hospital Fattouma Bourguiba",
      "Hospital Hédi Chaker",
      "Hospital Habib Bourguiba",
    ],
    { errorMap: () => ({ message: "Selected hospital is not valid" }) },
  ),
  specialty: z.enum(
    [
      "Generalist",
      "Cardiologist",
      "Dermatologist",
      "Endocrinologist",
      "Gastroenterologist",
      "Neurologist",
      "Pediatrician",
      "Psychiatrist",
    ],
    { errorMap: () => ({ message: "Selected specialty is not valid" }) },
  ),
  degrees: z
    .array(z.string())
    .min(1, "Add at least one degree")
    .max(10, "Maximum 10 degrees"),
  certifications: z
    .array(z.string())
    .min(1, "Choose at least one certificate")
    .max(10, "Maximum 10 certificates"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000, "Price must not exceed 1000dt/hr"),
  experience: z.string().optional(),
  schedule: z.array(z.string()).min(1, "Choose at least one day"),
});

const General = ({ setIsLoading }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);
  const userCheck = useUserCheck();
  const [currentUser, setCurrentUser] = useState();
  const [imageSrc, setImageSrc] = useState();

  const form = useForm({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      phone: "",
      address: "",
      city: "",
      zip: "",
      description: "",
      hospital: undefined,
      specialty: undefined,
      degrees: [],
      certifications: [],
      price: 0,
      experience: "Less than a year",
      schedule: [],
    },
  });

  const {
    fields: degreeFields,
    append: appendDegree,
    remove: removeDegree,
  } = useFieldArray({
    control: form.control,
    name: "degrees",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const profileImageHandler = (uri) => {
    setIsLoading(true);
    setImageSrc(uri);
    setIsLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      userCheck(async (token) => {
        const res = await getCurrentUser(token);
        setCurrentUser(res.data);
      });
    };
    getUser();
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      setImageSrc(currentUser.photo);
      form.reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        age: currentUser.age || 0,
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        zip: currentUser.zip || "",
        description: currentUser.description || "",
        hospital: currentUser.hospital,
        specialty: currentUser.specialty,
        degrees: currentUser.degrees || [],
        certifications: currentUser.certifications || [],
        price: currentUser.price || 0,
        experience: currentUser.experience || "Less than a year",
        schedule: currentUser.schedule || [],
      });
    }
  }, [currentUser]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    if (!imageSrc || imageSrc === "") {
      toast("Image is not valid", "error");
      setIsLoading(false);
      return;
    }

    if (user) {
      const imageResponse = await uploadProfilePicture(user, imageSrc);
      await updateDoctor(
        { id: user._id, token: user.token },
        {
          ...values,
          photo: imageResponse.data.url,
          isProfileCompleted: true,
        },
      );
      dispatch(
        setUser({
          ...user,
          isProfileCompleted: true,
        }),
      );
    } else {
      toast("User is not valid", "error");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-lg leading-6 font-semibold">Personelles</h2>
          <p className="my-2 text-sm text-gray-600 dark:text-gray-400">
            Please fill out this form to complete your profile with your
            personal information.
          </p>
        </div>

        <div className="shadow-md rounded-md overflow-hidden bg-white space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Photo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-gray-100">
                <AvatarImage src={imageSrc} />
                <AvatarFallback>
                  <User className="h-9 w-9 mt-3 rounded-full text-gray-300" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <ImageUpload onChange={profileImageHandler} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-medium focus:shadow-none"
                  asChild
                >
                  <span>Change</span>
                </Button>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextFormControl
              label="Firstname"
              autoComplete="given-name"
              name="firstName"
              control={form.control}
            />
            <TextFormControl
              label="Lastname"
              autoComplete="family-name"
              name="lastName"
              control={form.control}
            />
          </div>

          <div className="grid grid-cols-6 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-3 space-y-2">
                  <FormLabel
                    htmlFor="age"
                    className="text-sm font-medium text-gray-700"
                  >
                    Age
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value || ""}
                      min={18}
                      max={100}
                      onChange={(value) => field.onChange(+value)}
                      className={cn(
                        "text-sm",
                        fieldState.error
                          ? "border-red-300 focus-visible:ring-red-500"
                          : "focus-visible:ring-secondary-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-3 space-y-2">
                  <FormLabel
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-gray-50 text-sm text-gray-500">
                        +216
                      </span>
                      <Input
                        type="tel"
                        id="phone"
                        autoComplete="tel"
                        className={cn(
                          "text-sm shadow-sm rounded-l-none rounded-r-md",
                          fieldState.error
                            ? "border-red-300 focus-visible:ring-red-500"
                            : "focus-visible:ring-secondary-500",
                        )}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <TextFormControl
              label="Street address"
              autoComplete="street-address"
              name="address"
              control={form.control}
            />
            <TextFormControl
              label="City"
              autoComplete="home city"
              name="city"
              control={form.control}
            />
            <TextFormControl
              label="ZIP"
              autoComplete="postal-code"
              name="zip"
              control={form.control}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your profile."
                    rows={3}
                    className={cn(
                      "text-sm shadow-sm",
                      fieldState.error
                        ? "border-red-300 focus-visible:ring-red-500"
                        : "focus-visible:ring-secondary-500",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-3">
          <hr className="my-5 border-gray-300" />
        </div>

        <div className="col-span-1">
          <div>
            <h2 className="text-lg leading-6 font-semibold">Professionals</h2>
            <p className="my-2 text-sm text-gray-600 dark:text-gray-400">
              Provide detailed information about your professional experience
              including degrees, diplomas and certificates
            </p>
          </div>
        </div>

        <div className="col-span-2">
          <div className="shadow-md rounded-md overflow-hidden px-4 py-5 bg-white space-y-6 p-6">
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="hospital"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3">
                      Hospital
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "text-sm shadow-sm rounded-md",
                            fieldState.error
                              ? "border-red-300 focus:ring-red-500"
                              : "focus:ring-secondary-500",
                          )}
                        >
                          <SelectValue placeholder="Select a hospital..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hospital Mongi Slim">
                          Hospital Mongi Slim
                        </SelectItem>
                        <SelectItem value="Hospital Charles Nicolle">
                          Hospital Charles Nicolle
                        </SelectItem>
                        <SelectItem value="Hospital La Rabta">
                          Hospital La Rabta
                        </SelectItem>
                        <SelectItem value="Hospital Razi">
                          Hospital Razi
                        </SelectItem>
                        <SelectItem value="Hospital Sahloul">
                          Hospital Sahloul
                        </SelectItem>
                        <SelectItem value="Hospital Farhat Hached">
                          Hospital Farhat Hached
                        </SelectItem>
                        <SelectItem value="Hospital Fattouma Bourguiba">
                          Hospital Fattouma Bourguiba
                        </SelectItem>
                        <SelectItem value="Hospital Hédi Chaker">
                          Hospital Hédi Chaker
                        </SelectItem>
                        <SelectItem value="Hospital Habib Bourguiba">
                          Hospital Habib Bourguiba
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3">
                      Speciality
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "text-sm shadow-sm rounded-md",
                            fieldState.error
                              ? "border-red-300 focus:ring-red-500"
                              : "focus:ring-secondary-500",
                          )}
                        >
                          <SelectValue placeholder="Select specialty..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Generalist">Generalist</SelectItem>
                        <SelectItem value="Cardiologist">
                          Cardiologist
                        </SelectItem>
                        <SelectItem value="Dermatologist">
                          Dermatologist
                        </SelectItem>
                        <SelectItem value="Endocrinologist">
                          Endocrinologist
                        </SelectItem>
                        <SelectItem value="Gastroenterologist">
                          Gastroenterologist
                        </SelectItem>
                        <SelectItem value="Neurologist">Neurologist</SelectItem>
                        <SelectItem value="Pediatrician">
                          Pediatrician
                        </SelectItem>
                        <SelectItem value="Psychiatrist">
                          Psychiatrist
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col flex-wrap w-full">
                <p className="font-medium text-base text-gray-900 mb-3">
                  Degrees
                </p>
                <div className="space-y-4">
                  {degreeFields.map((field, index) => (
                    <div key={field.id} className="flex justify-end">
                      <FormField
                        control={form.control}
                        name={`degrees.${index}`}
                        render={({ field }) => (
                          <Input
                            placeholder="State Diploma of Doctor of Medicine."
                            type="text"
                            className="text-sm shadow-sm rounded-r-none rounded-l-md pr-6 focus-visible:ring-secondary-500"
                            {...field}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => removeDegree(index)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div
                  className={cn("mt-4", degreeFields.length === 0 && "mt-2")}
                >
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="rounded-full border-secondary-500 hover:bg-secondary-500 hover:text-white"
                      onClick={() => appendDegree("")}
                    >
                      <Plus className="h-4 w-4 text-secondary-500" />
                    </Button>
                    <p className="text-base text-gray-500">Add a degree</p>
                  </div>
                  {form.formState.errors.degrees && (
                    <p className="mt-2 text-sm text-red-400">
                      {form.formState.errors.degrees.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col flex-wrap w-full">
                <p className="text-base text-gray-900 mb-3">Certificates</p>
                <div className="space-y-4">
                  {certificationFields.map((field, index) => (
                    <div key={field.id} className="flex justify-end">
                      <FormField
                        control={form.control}
                        name={`certifications.${index}`}
                        render={({ field }) => (
                          <Input
                            placeholder="Fellow, American College of Physicians (FACP)"
                            type="text"
                            className="text-sm shadow-sm rounded-r-none rounded-l-md pr-6 focus-visible:ring-secondary-500"
                            {...field}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div
                  className={cn(
                    "mt-4",
                    certificationFields.length === 0 && "mt-2",
                  )}
                >
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="rounded-full border-secondary-500 hover:bg-secondary-500 hover:text-white"
                      onClick={() => appendCertification("")}
                    >
                      <Plus className="h-4 w-4 text-secondary-500" />
                    </Button>
                    <p className="text-base text-gray-500">Add a certificate</p>
                  </div>
                  {form.formState.errors.certifications && (
                    <p className="mt-2 text-sm text-red-400">
                      {form.formState.errors.certifications.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <fieldset>
                    <legend className="text-base text-gray-900 mb-3">
                      Experience
                      <p className="text-sm text-gray-500">
                        Number of years of experience you have
                      </p>
                    </legend>
                    <FormControl>
                      <RadioGroup
                        value={field.value || "Less than a year"}
                        onValueChange={field.onChange}
                        className="space-y-4"
                      >
                        {["Less than a year", "1 - 5 years", "+5 years"].map(
                          (experience) => (
                            <div
                              key={experience}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem
                                value={experience}
                                id={experience}
                              />
                              <Label
                                htmlFor={experience}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                {experience}
                              </Label>
                            </div>
                          ),
                        )}
                      </RadioGroup>
                    </FormControl>
                  </fieldset>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-3">
          <hr className="my-5 border-gray-300" />
        </div>

        <div className="col-span-1">
          <div>
            <h2 className="text-lg leading-6 font-semibold">Schedule</h2>
            <p className="my-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your weekly availability by indicating the days on
              which you are available.
            </p>
          </div>
        </div>

        <div className="col-span-2">
          <div className="shadow-md rounded-md overflow-hidden px-4 py-5 bg-white space-y-6 p-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 gap-6">
                  <div className="col-span-3 space-y-2">
                    <FormLabel
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700"
                    >
                      Price in dt / hour
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="price"
                          placeholder="Enter amount"
                          type="number"
                          className="text-sm shadow-sm rounded-md pr-12 focus-visible:ring-secondary-500"
                          min={1}
                          max={1000}
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
                          dt
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <fieldset>
                    <p className="mb-3 text-base text-gray-900">Schedule</p>
                    <FormControl>
                      <div className="flex flex-wrap gap-y-5 gap-x-20">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`schedule-${day}`}
                                checked={field.value?.includes(day)}
                                onCheckedChange={(checked) => {
                                  const currentSchedule = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentSchedule, day]);
                                  } else {
                                    field.onChange(
                                      currentSchedule.filter((d) => d !== day),
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`schedule-${day}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {day}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </fieldset>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-3 py-3 text-right">
          <Button type="submit" size="sm" className="hover:opacity-80">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default General;
