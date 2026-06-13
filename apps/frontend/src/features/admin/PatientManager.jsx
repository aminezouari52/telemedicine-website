"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks";
import {
  getPatients,
  updatePatient,
  deletePatient,
} from "@/services/adminService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Search, Trash2, Pencil, RefreshCw, User, Users } from "lucide-react";
import { paginate, Pagination } from "@/components/pagination/Pagination";

export default function PatientManager() {
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const searchRef = useRef(null);

  const fetchPatients = async (name) => {
    setLoading(true);
    try {
      const res = await getPatients(name || undefined);
      setPatients(res.data.results || []);
    } catch (err) {
      toast("Failed to fetch patients", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchPatients(search);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchRef.current?.value || "");
  };

  const paginatedPatients = paginate(patients);
  const visiblePatients = paginatedPatients[page] || [];
  const totalPages = paginatedPatients.length;

  const openEditDialog = (patient) => {
    setEditingPatient(patient._id);
    setEditForm({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      age: patient.age?.toString() || "",
      phone: patient.phone || "",
      address: patient.address || "",
      city: patient.city || "",
      zip: patient.zip || "",
      weight: patient.weight || "",
    });
  };

  const handleEditSave = async () => {
    if (!editingPatient) return;
    setSaving(true);
    try {
      const body = {
        ...editForm,
        age: editForm.age ? Number(editForm.age) : undefined,
      };
      await updatePatient(editingPatient, body);
      toast("Patient updated", "success");
      setEditingPatient(null);
      fetchPatients(search);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePatient(deleteTarget);
      toast("Patient deleted", "success");
      setDeleteTarget(null);
      fetchPatients(search);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            ref={searchRef}
            placeholder="Search patients by name or email..."
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPatients(search)}
          >
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-gray-500">
            <Users className="mb-2 h-12 w-12" />
            <p>No patients found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visiblePatients.map((patient) => (
            <Card key={patient._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="font-semibold">
                      {patient.firstName || ""} {patient.lastName || ""}
                    </span>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                    <p className="text-xs text-gray-400">
                      {patient.phone || "—"}
                      {patient.city ? ` · ${patient.city}` : ""}
                      {patient.age ? ` · ${patient.age} yrs` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(patient)}
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(patient._id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!loading && totalPages > 1 && (
        <Pagination
          nextPage={() => page < totalPages - 1 && setPage(page + 1)}
          prevPage={() => page > 0 && setPage(page - 1)}
          currentPage={page}
          items={paginatedPatients}
          updatePage={setPage}
        />
      )}

      <Dialog
        open={!!editingPatient}
        onOpenChange={() => setEditingPatient(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input
                  type="number"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, age: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, address: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Zip</label>
                <Input
                  value={editForm.zip}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, zip: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Weight</label>
                <Input
                  value={editForm.weight}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, weight: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPatient(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this patient? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
