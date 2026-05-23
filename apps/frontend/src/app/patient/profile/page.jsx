"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
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

export default function PatientProfilePage() {
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
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
    </div>
  );
}
