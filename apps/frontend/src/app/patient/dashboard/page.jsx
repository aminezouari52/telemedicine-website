"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getPatientConsultations } from "@/services/consultationService";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CalendarDays, Users, DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PatientDashboardPage() {
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultations, isPending } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const res = await getPatientConsultations(user?._id);
      return res.data;
    },
  });

  const stats = useMemo(() => {
    if (!consultations) return [];

    const total = consultations.length;
    const upcoming = consultations.filter((c) => c.status === "pending").length;
    const doctors = new Set(
      consultations.map((c) => c?.doctor?._id).filter(Boolean),
    ).size;
    const totalSpent = consultations.reduce((sum, c) => {
      if (c?.payment?.status === "paid") {
        return sum + (c.payment.amount || 0);
      }
      return sum;
    }, 0);

    return [
      {
        label: "Consultations",
        value: total,
        icon: Activity,
        color: "text-blue-500",
      },
      {
        label: "Upcoming",
        value: upcoming,
        icon: CalendarDays,
        color: "text-green-500",
      },
      {
        label: "Doctors met",
        value: doctors,
        icon: Users,
        color: "text-purple-500",
      },
      {
        label: "Total spent",
        value: `$${totalSpent.toFixed(2)}`,
        icon: DollarSign,
        color: "text-yellow-500",
      },
    ];
  }, [consultations]);

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg p-3 bg-gray-50 ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
