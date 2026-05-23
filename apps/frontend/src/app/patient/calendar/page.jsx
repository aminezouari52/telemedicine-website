"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getPatientConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PatientCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = useSelector((state) => state.userReducer.user);

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["consultations", "calendar"],
    queryFn: async () => {
      const data = (await getPatientConsultations(user?._id)).data;
      return data.filter((c) => c.status === "pending");
    },
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const events = useMemo(() => {
    if (!consultations) return [];
    return consultations
      .filter((c) => {
        const d = new Date(c.date);
        return (
          d.getMonth() === currentMonth.getMonth() &&
          d.getFullYear() === currentMonth.getFullYear()
        );
      })
      .map((c) => ({
        day: new Date(c.date).getDate(),
        title: `Consultation with Dr. ${c.doctor?.firstName} ${c.doctor?.lastName}`,
        time: DateTime.fromJSDate(new Date(c.date)).toFormat("HH:mm"),
      }));
  }, [consultations, currentMonth]);

  const sortedConsultations = useMemo(
    () =>
      consultations
        ? [...consultations].sort((a, b) => new Date(a.date) - new Date(b.date))
        : [],
    [consultations],
  );

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
        Error: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              <CalendarIcon className="mr-2 inline h-5 w-5 text-primary-500" />
              {monthName} {year}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasEvent = events.some((e) => e.day === day);
              return (
                <div
                  key={day}
                  className={`rounded-lg p-2 text-center text-sm ${
                    hasEvent
                      ? "bg-primary-50 font-bold text-primary-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-primary-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Upcoming appointments</h3>
          {sortedConsultations.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming appointments</p>
          ) : (
            <ul className="space-y-3">
              {sortedConsultations.map((c) => {
                const day = new Date(c.date).getDate();
                const time = DateTime.fromJSDate(new Date(c.date)).toFormat(
                  "HH:mm",
                );
                return (
                  <li key={c._id} className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold">
                      {day}
                    </div>
                    <div>
                      <p className="font-medium">
                        Consultation with Dr. {c.doctor?.firstName}{" "}
                        {c.doctor?.lastName}
                      </p>
                      <p className="text-gray-500">{time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
