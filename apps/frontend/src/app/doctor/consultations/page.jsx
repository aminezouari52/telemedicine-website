"use client";

// hooks
import { useSelector } from "react-redux";
import { useState } from "react";

// components
import LoadingSpinner from "@/components/LoadingSpinner";

// functions
import { getDoctorConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// style
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock,
  CreditCard,
  Droplet,
  HeartPulse,
  MapPin,
  Phone,
  Pill,
  Ruler,
  ShieldAlert,
  Stethoscope,
  Weight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function initials(patient) {
  const f = patient?.firstName?.[0] ?? "";
  const l = patient?.lastName?.[0] ?? "";
  return `${f}${l}`.toUpperCase() || "PT";
}

function computeBmi(patient) {
  const weight = Number(patient?.weight);
  const height = Number(patient?.height);
  if (!weight || !height) return null;
  const meters = height / 100;
  const bmi = weight / (meters * meters);
  if (!Number.isFinite(bmi)) return null;
  return bmi.toFixed(1);
}

function paymentBadgeVariant(status) {
  if (status === "paid") return "default";
  if (status === "pending") return "secondary";
  if (status === "refunded") return "outline";
  return "destructive";
}

function VitalTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2 py-3 text-center">
      <Icon className="h-4 w-4 text-primary-500" />
      <span className="text-sm font-semibold text-gray-800">
        {value ?? "—"}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </span>
    </div>
  );
}

function MedicalBadges({ icon: Icon, label, items, tone }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const toneClasses = {
    danger: "bg-red-50 text-red-600 border-red-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      {list.length ? (
        <div className="flex flex-wrap gap-1.5">
          {list.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                toneClasses[tone] ?? toneClasses.info
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-xs text-gray-400">None reported</span>
      )}
    </div>
  );
}

function ConsultationCard({ consultation }) {
  const patient = consultation?.patient;
  const payment = consultation?.payment;
  const allergies = patient?.allergies ?? [];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/assets/avatar-patient.png" alt="Patient" />
                <AvatarFallback>{initials(patient)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold leading-tight">
                  {patient?.firstName} {patient?.lastName}
                </p>
                <span className="text-xs text-gray-400">
                  {[patient?.gender, patient?.age ? `${patient.age} yrs` : null]
                    .filter(Boolean)
                    .join(" · ") || "Patient"}
                </span>
              </div>
            </div>
            {patient?.bloodType ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-red-600"
              >
                <Droplet className="h-3 w-3 fill-red-500 text-red-500" />
                {patient.bloodType}
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {patient?.phone || "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Weight className="h-3.5 w-3.5" />
              {patient?.weight ? `${patient.weight} kg` : "—"}
            </span>
          </div>

          {allergies.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Allergies: {allergies.join(", ")}
              </span>
            </div>
          )}

          {payment && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-semibold">
                ${payment.amount?.toFixed(2)}
              </span>
              <Badge
                variant={paymentBadgeVariant(payment.status)}
                className="text-[10px] px-1.5 py-0"
              >
                {payment.status}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          <CalendarDays className="h-4 w-4 text-primary-500" />
          <div className="flex flex-col text-xs">
            <span className="text-gray-400">Your consultation</span>
            <span className="font-medium text-gray-700">
              {consultation?.date
                ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                    "dd-MM-yyyy 'at' HH:mm",
                  )
                : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NextConsultationCard({ consultation }) {
  const patient = consultation?.patient;
  const payment = consultation?.payment;
  const bmi = computeBmi(patient);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/assets/avatar-patient.png" alt="Patient" />
              <AvatarFallback>{initials(patient)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold leading-tight">
                {patient?.firstName} {patient?.lastName}
              </p>
              <span className="text-xs text-gray-400">
                {[patient?.gender, patient?.age ? `${patient.age} yrs` : null]
                  .filter(Boolean)
                  .join(" · ") || "Patient"}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>{patient?.address || "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-lg bg-primary-50 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="h-4 w-4 text-primary-500" />
              {consultation?.date
                ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                    "dd-MM-yyyy",
                  )
                : "—"}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-primary-500" />
              {consultation?.date
                ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                    "HH:mm",
                  )
                : "—"}
            </div>
          </div>
        </div>

        <div className="py-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <HeartPulse className="h-4 w-4 text-primary-500" />
            Medical overview
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <VitalTile
              icon={Ruler}
              label="Height"
              value={patient?.height ? `${patient.height} cm` : null}
            />
            <VitalTile
              icon={Weight}
              label="Weight"
              value={patient?.weight ? `${patient.weight} kg` : null}
            />
            <VitalTile icon={Activity} label="BMI" value={bmi} />
            <VitalTile
              icon={Droplet}
              label="Blood"
              value={patient?.bloodType || null}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MedicalBadges
              icon={AlertTriangle}
              label="Allergies"
              items={patient?.allergies}
              tone="danger"
            />
            <MedicalBadges
              icon={Stethoscope}
              label="Chronic conditions"
              items={patient?.chronicConditions}
              tone="warning"
            />
            <MedicalBadges
              icon={Pill}
              label="Current medications"
              items={patient?.currentMedications}
              tone="info"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{patient?.phone || "—"}</span>
          </div>
          {(patient?.emergencyContactName ||
            patient?.emergencyContactPhone) && (
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldAlert className="h-4 w-4 text-gray-400" />
              <span>
                {patient?.emergencyContactName}
                {patient?.emergencyContactPhone
                  ? ` · ${patient.emergencyContactPhone}`
                  : ""}
              </span>
            </div>
          )}
          {payment && (
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="font-semibold">
                ${payment.amount?.toFixed(2)}
              </span>
              <Badge
                variant={paymentBadgeVariant(payment.status)}
                className="text-[10px] px-1.5 py-0"
              >
                {payment.status}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AllConsultationsModal({ consultations, onClose, isOpen }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All consultations</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-1">
          {consultations.map((consultation, index) => (
            <ConsultationCard key={index} consultation={consultation} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DoctorConsultationsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.userReducer.user);

  const getDoctorConsultationsQuery = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData.filter((c) => c.status === "pending");
  };

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["consultations", user?._id],
    queryFn: () => getDoctorConsultationsQuery(),
    enabled: !!user?._id,
  });

  const sortedUpcomingConsultations = () =>
    consultations?.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (isPending) {
    return (
      <div className="flex flex-row justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-row justify-center mt-10">
        Error : {error.message}
      </div>
    );
  }

  const sorted = sortedUpcomingConsultations() ?? [];
  const nextConsultation = sorted[0];

  return (
    <>
      <AllConsultationsModal
        consultations={consultations}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10">
        <div className="mb-6 flex items-center gap-3">
          <Stethoscope className="h-6 w-6 text-primary-500" />
          <div>
            <h1 className="text-2xl font-bold">Consultations</h1>
            <p className="text-sm text-gray-500">
              You have {sorted.length} upcoming consultation
              {sorted.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16">
              <CalendarDays className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500">
                You don&apos;t have any consultations
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-semibold">Upcoming</h2>
                {sorted.length > 2 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="hover:opacity-80"
                    onClick={() => setIsOpen(true)}
                  >
                    See all
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {sorted.slice(0, 3).map((consultation, index) => (
                  <ConsultationCard key={index} consultation={consultation} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="pb-4 text-lg font-semibold">Next consultation</h2>
              <NextConsultationCard consultation={nextConsultation} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
