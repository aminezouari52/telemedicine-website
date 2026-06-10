"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getPatientConsultations } from "@/services/consultationService";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Activity, CalendarDays, Users, DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const STATUS_COLORS = {
  completed: "#22c55e",
  pending: "#eab308",
  "in-progress": "#3b82f6",
  canceled: "#ef4444",
};

export default function PatientDashboardPage() {
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultations, isPending } = useQuery({
    queryKey: ["consultations", user?._id],
    queryFn: async () => {
      const res = await getPatientConsultations(user._id);
      return res.data;
    },
    enabled: !!user?._id,
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

  const monthlyData = useMemo(() => {
    if (!consultations) return [];
    const months = {};
    consultations.forEach((c) => {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [consultations]);

  const statusData = useMemo(() => {
    if (!consultations) return [];
    const counts = {};
    consultations.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [consultations]);

  const spendingData = useMemo(() => {
    if (!consultations) return [];
    const months = {};
    consultations.forEach((c) => {
      if (c?.payment?.status === "paid" && c.payment.amount) {
        const d = new Date(c.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months[key] = (months[key] || 0) + c.payment.amount;
      }
    });
    return Object.entries(months)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Consultations per month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#615EFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Status breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name.toLowerCase()] || "#888"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Spending over time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
