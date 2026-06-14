"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUS_COLORS = {
  completed: "#22c55e",
  pending: "#f59e0b",
  canceled: "#ef4444",
};

const Charts = ({ consultations = [] }) => {
  const year = new Date().getFullYear();

  // Consultations per month (current year), split by status
  const monthlyData = useMemo(() => {
    const base = MONTHS.map((name) => ({
      name,
      completed: 0,
      pending: 0,
      canceled: 0,
    }));

    consultations.forEach((c) => {
      const date = new Date(c.date);
      if (date.getFullYear() !== year) return;
      const bucket = base[date.getMonth()];
      if (bucket && bucket[c.status] !== undefined) bucket[c.status] += 1;
    });

    return base;
  }, [consultations, year]);

  // Status distribution for the donut
  const statusData = useMemo(() => {
    const counts = { completed: 0, pending: 0, canceled: 0 };
    consultations.forEach((c) => {
      if (counts[c.status] !== undefined) counts[c.status] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        color: STATUS_COLORS[key],
      }));
  }, [consultations]);

  const total = statusData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Monthly trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Consultations over {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pendingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="canceledFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#eef0f4"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #eef0f4",
                  fontSize: 12,
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#22c55e"
                fill="url(#completedFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#pendingFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="canceled"
                stackId="1"
                stroke="#ef4444"
                fill="url(#canceledFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Status breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {total === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No consultations yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #eef0f4",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
