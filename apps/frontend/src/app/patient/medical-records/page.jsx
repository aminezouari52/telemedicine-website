"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const records = [
  {
    id: 1,
    title: "Blood test results",
    date: "2026-04-15",
    type: "Lab",
    doctor: "Dr. Smith",
  },
  {
    id: 2,
    title: "X-Ray Report",
    date: "2026-03-28",
    type: "Imaging",
    doctor: "Dr. Jones",
  },
  {
    id: 3,
    title: "Prescription - Amoxicillin",
    date: "2026-03-10",
    type: "Prescription",
    doctor: "Dr. Smith",
  },
  {
    id: 4,
    title: "Vaccination Record",
    date: "2026-02-20",
    type: "Immunization",
    doctor: "Dr. Lee",
  },
];

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Medical Records</h1>

      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <FileText className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No medical records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary-50 p-2.5">
                    <FileText className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-xs text-gray-500">
                      {r.date} &middot; {r.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {r.type}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
