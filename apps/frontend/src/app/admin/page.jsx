"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks";
import { getDoctors, updateDoctorStatus } from "@/services/adminService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserCheck,
  UserX,
  RefreshCw,
  Pencil,
  Stethoscope,
  Users,
} from "lucide-react";
import { paginate, Pagination } from "@/components/pagination/Pagination";
import PatientManager from "@/features/admin/PatientManager";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(0);

  const fetchDoctors = async (status) => {
    setLoading(true);
    try {
      const res = await getDoctors(status || undefined);
      setDoctors(res.data.results || []);
    } catch (err) {
      toast("Failed to fetch doctors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchDoctors(activeTab);
  }, [activeTab]);

  const paginatedDoctors = paginate(doctors);
  const visibleDoctors = paginatedDoctors[page] || [];
  const totalPages = paginatedDoctors.length;

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const updatePage = (index) => setPage(index);

  const handleStatusChange = async () => {
    if (!confirmAction) return;
    try {
      await updateDoctorStatus(confirmAction.id, confirmAction.status);
      toast(
        `Doctor ${confirmAction.status === "approved" ? "approved" : confirmAction.status === "rejected" ? "rejected" : "moved to pending"}`,
        "success",
      );
      fetchDoctors(activeTab);
    } catch (err) {
      toast(err.response?.data?.message || "Action failed", "error");
    } finally {
      setConfirmAction(null);
    }
  };

  const statusActions = (doctor) => {
    const actions = [];
    if (doctor.approvalStatus === "pending") {
      actions.push(
        {
          label: "Approve",
          status: "approved",
          variant: "default",
          icon: UserCheck,
        },
        {
          label: "Reject",
          status: "rejected",
          variant: "destructive",
          icon: UserX,
        },
      );
    } else if (doctor.approvalStatus === "approved") {
      actions.push(
        {
          label: "Reject",
          status: "rejected",
          variant: "destructive",
          icon: UserX,
        },
        {
          label: "Move to Pending",
          status: "pending",
          variant: "outline",
          icon: RefreshCw,
        },
      );
    } else if (doctor.approvalStatus === "rejected") {
      actions.push(
        {
          label: "Approve",
          status: "approved",
          variant: "default",
          icon: UserCheck,
        },
        {
          label: "Move to Pending",
          status: "pending",
          variant: "outline",
          icon: RefreshCw,
        },
      );
    }
    return actions;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Doctors</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDoctors(activeTab)}
        >
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="flex gap-2 border-b pb-4">
        <Button
          variant={mode === "doctors" ? "default" : "outline"}
          onClick={() => setMode("doctors")}
        >
          <Stethoscope className="mr-2 h-4 w-4" /> Doctors
        </Button>
        <Button
          variant={mode === "patients" ? "default" : "outline"}
          onClick={() => setMode("patients")}
        >
          <Users className="mr-2 h-4 w-4" /> Patients
        </Button>
      </div>

      {mode === "doctors" && (
        <>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : doctors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-gray-500">
                <UserCheck className="mb-2 h-12 w-12" />
                <p>No doctors found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {visibleDoctors.map((doctor) => (
                <Card key={doctor._id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {doctor.firstName || ""} {doctor.lastName || ""}
                        </span>
                        <Badge
                          className={
                            STATUS_COLORS[doctor.approvalStatus] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {doctor.approvalStatus || "unknown"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{doctor.email}</p>
                      <p className="text-sm text-gray-500">
                        {doctor.specialty || "—"}
                        {doctor.hospital ? ` · ${doctor.hospital}` : ""}
                      </p>
                      {doctor.createdAt && (
                        <p className="text-xs text-gray-400">
                          Registered:{" "}
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusActions(doctor).map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={`${action.status}-${doctor._id}`}
                            variant={action.variant}
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                id: doctor._id,
                                status: action.status,
                                name: `${doctor.firstName || ""} ${doctor.lastName || ""}`,
                              })
                            }
                          >
                            <Icon className="mr-1 h-4 w-4" />
                            {action.label}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/doctors/${doctor._id}/edit`)
                        }
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              nextPage={nextPage}
              prevPage={prevPage}
              currentPage={page}
              items={paginatedDoctors}
              updatePage={updatePage}
            />
          )}

          <AlertDialog
            open={!!confirmAction}
            onOpenChange={() => setConfirmAction(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm action</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmAction && (
                    <>
                      Are you sure you want to mark{" "}
                      <strong>{confirmAction.name}</strong> as{" "}
                      <strong>{confirmAction.status}</strong>?
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStatusChange}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {mode === "patients" && <PatientManager />}
    </div>
  );
}
