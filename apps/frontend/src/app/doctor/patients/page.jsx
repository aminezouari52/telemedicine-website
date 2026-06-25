"use client";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { Users } from "lucide-react";

import DataTable from "@/components/DataTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getDoctorConsultations } from "@/services/consultationService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

function getInitials(firstName, lastName) {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

export default function DoctorPatientsPage() {
  const user = useSelector((state) => state.userReducer.user);

  const getConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData?.filter((c) => c.status === "completed");
  };

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["patients", user?._id],
    queryFn: () => getConsultations(),
    enabled: !!user?._id,
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message ?? "Failed to load patients."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const uniquePatientConsultations = consultations?.filter(
    (consultation, index, self) =>
      index ===
      self.findIndex((c) => c.patient?._id === consultation.patient?._id),
  );

  const headers = ["Patient", "Phone", "Age", "Consultation date"];

  const renderRow = (consultation, index) => {
    const { patient } = consultation ?? {};
    const fullName =
      [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "—";
    const createdAt = consultation?.createdAt
      ? DateTime.fromJSDate(new Date(consultation.createdAt)).toFormat(
          "dd MMM yyyy · HH:mm",
        )
      : "—";

    return (
      <tr key={index} className="border-b transition-colors hover:bg-muted/50">
        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {getInitials(patient?.firstName, patient?.lastName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{fullName}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {patient?.phone ?? "—"}
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {patient?.age ?? "—"}
        </td>
        <td className="px-4 py-3 text-muted-foreground">{createdAt}</td>
      </tr>
    );
  };

  if (!uniquePatientConsultations?.length) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My patients
            </CardTitle>
            <CardDescription>
              Patients who have completed a consultation with you will appear
              here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-foreground">
                No patients yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Completed consultations will show up in this list.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">My patients</h1>
          <p className="text-sm text-muted-foreground">
            Patients who have completed a consultation with you.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <DataTable
            data={uniquePatientConsultations}
            renderRow={renderRow}
            headers={headers}
          />
        </div>
      </div>
    </div>
  );
}
