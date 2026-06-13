"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks";
import { getDoctor } from "@/services/doctorService";
import { updateDoctorProfile } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, ArrowLeft } from "lucide-react";

const HOSPITALS = [
  "Hospital Mongi Slim",
  "Hospital Charles Nicolle",
  "Hospital La Rabta",
  "Hospital Razi",
  "Hospital Sahloul",
  "Hospital Farhat Hached",
  "Hospital Fattouma Bourguiba",
  "Hospital Hédi Chaker",
  "Hospital Habib Bourguiba",
];

const SPECIALTIES = [
  "Generalist",
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Neurologist",
  "Pediatrician",
  "Psychiatrist",
];

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EXPERIENCES = ["Less than a year", "1 - 5 years", "+5 years"];

export default function AdminEditDoctorPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    description: "",
    hospital: "",
    specialty: "Generalist",
    price: "",
    experience: "",
    photo: "",
    degrees: [""],
    certifications: [""],
    schedule: [],
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctor(id);
        const d = res.data;
        setForm({
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          age: d.age?.toString() || "",
          phone: d.phone || "",
          address: d.address || "",
          city: d.city || "",
          zip: d.zip || "",
          description: d.description || "",
          hospital: d.hospital || "",
          specialty: d.specialty || "Generalist",
          price: d.price?.toString() || "",
          experience: d.experience || "",
          photo: d.photo || "",
          degrees: d.degrees?.length ? d.degrees : [""],
          certifications: d.certifications?.length ? d.certifications : [""],
          schedule: d.schedule || [],
        });
      } catch (err) {
        toast("Failed to load doctor", "error");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, router, toast]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleSchedule = (day) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.includes(day)
        ? prev.schedule.filter((d) => d !== day)
        : [...prev.schedule, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        price: form.price ? Number(form.price) : undefined,
        degrees: form.degrees.filter(Boolean),
        certifications: form.certifications.filter(Boolean),
      };
      await updateDoctorProfile(id, body);
      toast("Doctor profile updated", "success");
      router.push("/admin");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Doctor Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                min={18}
                max={100}
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={form.email} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (dt/hr)</label>
              <Input
                type="number"
                min={0}
                max={1000}
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Photo URL</label>
              <Input
                value={form.photo}
                onChange={(e) => updateField("photo", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-3">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zip Code</label>
              <Input
                value={form.zip}
                onChange={(e) => updateField("zip", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select
                value={form.specialty}
                onValueChange={(v) => updateField("specialty", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hospital</label>
              <Select
                value={form.hospital}
                onValueChange={(v) => updateField("hospital", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOSPITALS.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience</label>
              <Select
                value={form.experience}
                onValueChange={(v) => updateField("experience", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Degrees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.degrees.map((deg, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={deg}
                  onChange={(e) =>
                    updateArrayItem("degrees", i, e.target.value)
                  }
                  placeholder="e.g. Doctorate in Medicine (MD)"
                />
                {form.degrees.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem("degrees", i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("degrees")}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Degree
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.certifications.map((cert, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={cert}
                  onChange={(e) =>
                    updateArrayItem("certifications", i, e.target.value)
                  }
                  placeholder="e.g. Cardiology Board Certification"
                />
                {form.certifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem("certifications", i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("certifications")}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Certification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const selected = form.schedule.includes(day);
                return (
                  <Button
                    key={day}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSchedule(day)}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
