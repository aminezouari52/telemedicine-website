"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  HeartPulse,
  Ruler,
  Weight,
  Droplet,
  AlertTriangle,
  Stethoscope,
  Pill,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useToast } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePatient } from "@/services/patientService";
import { setUser } from "@/reducers/userReducer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  phone: z.string().min(1, "Phone number is required"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(50, "Address cannot exceed 50 characters"),
});

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];

const numericString = (label) =>
  z
    .string()
    .optional()
    .refine((v) => !v || /^[0-9]+$/.test(v), `${label} must be a number`);

const medicalSchema = z.object({
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  height: numericString("Height"),
  weight: numericString("Weight"),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  emergencyContactName: z.string().max(80).optional(),
  emergencyContactPhone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[0-9]+$/.test(v),
      "Emergency phone must contain only numbers",
    ),
});

const toList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const listToText = (value) => toList(value).join(", ");
const textToList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function PatientProfilePage() {
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [medicalOpen, setMedicalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const medicalForm = useForm({
    resolver: zodResolver(medicalSchema),
    defaultValues: {
      gender: user?.gender || "",
      bloodType: user?.bloodType || "",
      height: user?.height || "",
      weight: user?.weight || "",
      allergies: listToText(user?.allergies),
      chronicConditions: listToText(user?.chronicConditions),
      currentMedications: listToText(user?.currentMedications),
      emergencyContactName: user?.emergencyContactName || "",
      emergencyContactPhone: user?.emergencyContactPhone || "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await updatePatient({ id: user._id, token: user.token }, values);
      dispatch(setUser({ ...user, ...values }));
      toast("Profile updated successfully", "success");
      setOpen(false);
    } catch (error) {
      toast(
        error.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitMedical = async (values) => {
    setSavingMedical(true);
    const payload = {
      gender: values.gender,
      bloodType: values.bloodType,
      height: values.height,
      weight: values.weight,
      allergies: textToList(values.allergies),
      chronicConditions: textToList(values.chronicConditions),
      currentMedications: textToList(values.currentMedications),
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
    };
    try {
      await updatePatient({ id: user._id, token: user.token }, payload);
      dispatch(setUser({ ...user, ...payload }));
      toast("Medical information updated", "success");
      setMedicalOpen(false);
    } catch (error) {
      toast(
        error.response?.data?.message || "Failed to update medical information",
        "error",
      );
    } finally {
      setSavingMedical(false);
    }
  };

  const details = [
    {
      label: "Full name",
      value: `${user?.firstName || ""} ${user?.lastName || ""}`,
      icon: User,
    },
    { label: "Email", value: user?.email || "—", icon: Mail },
    { label: "Phone", value: user?.phone || "—", icon: Phone },
    { label: "Address", value: user?.address || "—", icon: MapPin },
    {
      label: "Member since",
      value: user?.createdAt?.split("T")[0] || "—",
      icon: Calendar,
    },
  ];

  const vitals = [
    { label: "Gender", value: user?.gender || "—", icon: UserRound },
    {
      label: "Height",
      value: user?.height ? `${user.height} cm` : "—",
      icon: Ruler,
    },
    {
      label: "Weight",
      value: user?.weight ? `${user.weight} kg` : "—",
      icon: Weight,
    },
    { label: "Blood type", value: user?.bloodType || "—", icon: Droplet },
  ];

  const medicalLists = [
    {
      label: "Allergies",
      items: toList(user?.allergies),
      icon: AlertTriangle,
      empty: "No known allergies",
    },
    {
      label: "Chronic conditions",
      items: toList(user?.chronicConditions),
      icon: Stethoscope,
      empty: "None reported",
    },
    {
      label: "Current medications",
      items: toList(user?.currentMedications),
      icon: Pill,
      empty: "None reported",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="divide-y p-0">
          {details.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="flex items-center gap-4 px-6 py-4">
                <Icon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{d.label}</p>
                  <p className="font-medium">{d.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          className="w-full sm:w-auto hover:opacity-80"
          onClick={() => setOpen(true)}
        >
          Edit profile
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Medical information */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <HeartPulse className="h-5 w-5 text-primary-500" />
          Medical information
        </h2>
        <Button
          variant="outline"
          className="hover:opacity-80"
          onClick={() => setMedicalOpen(true)}
        >
          Edit
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {vitals.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.label}
                  className="flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2 py-3 text-center"
                >
                  <Icon className="h-4 w-4 text-primary-500" />
                  <span className="text-sm font-semibold">{v.value}</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    {v.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {medicalLists.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <Icon className="h-4 w-4" />
                    {m.label}
                  </div>
                  {m.items.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {m.items.map((item, index) => (
                        <Badge
                          key={`${item}-${index}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">{m.empty}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
            <ShieldAlert className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Emergency contact:</span>
            <span className="font-medium">
              {user?.emergencyContactName || user?.emergencyContactPhone
                ? `${user?.emergencyContactName || ""}${
                    user?.emergencyContactPhone
                      ? ` · ${user.emergencyContactPhone}`
                      : ""
                  }`
                : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={medicalOpen} onOpenChange={setMedicalOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit medical information</DialogTitle>
          </DialogHeader>
          <Form {...medicalForm}>
            <form
              onSubmit={medicalForm.handleSubmit(onSubmitMedical)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={medicalForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genders.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicalForm.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodTypes.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicalForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicalForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={medicalForm.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Separate with commas, e.g. Penicillin, Peanuts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicalForm.control}
                name="chronicConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chronic conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Separate with commas, e.g. Asthma, Hypertension"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicalForm.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Separate with commas, e.g. Metformin, Ventolin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={medicalForm.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicalForm.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMedicalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingMedical}>
                  {savingMedical ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
