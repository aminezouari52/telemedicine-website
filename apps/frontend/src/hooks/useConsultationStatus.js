import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDoctorConsultations,
  getPatientConsultations,
} from "@/services/consultationService";

const REMINDER_WINDOW_MINUTES = 15;

function getNow() {
  return new Date();
}

function sortByDateAscending(consultations) {
  if (!consultations || consultations.length === 0) return [];
  return [...consultations].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getActiveConsultation(consultations) {
  if (!consultations || consultations.length === 0) return null;
  return consultations.find((c) => c.status === "in-progress") || null;
}

function getUpcomingSoonConsultation(consultations, now) {
  if (!consultations || consultations.length === 0) return null;
  const upcoming = consultations.filter((c) => c.status === "pending");
  if (upcoming.length === 0) return null;

  const sorted = sortByDateAscending(upcoming);
  const upcomingWithDate = sorted.filter((c) => c.date);
  if (upcomingWithDate.length === 0) return null;

  const windowMs = REMINDER_WINDOW_MINUTES * 60 * 1000;
  const currentTime = now || getNow();

  return (
    upcomingWithDate.find((c) => {
      const start = new Date(c.date);
      const diff = start - currentTime;
      return diff > 0 && diff <= windowMs;
    }) || null
  );
}

export function useConsultationStatus(user) {
  const [dismissedIds, setDismissedIds] = useState(() => new Set());

  const enabled =
    !!user?._id && (user?.role === "patient" || user?.role === "doctor");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["consultations", user?._id, user?.role],
    queryFn: async () => {
      if (!user?._id || !user?.role) return [];
      if (user.role === "patient") {
        const res = await getPatientConsultations(user._id);
        return res.data || [];
      }
      if (user.role === "doctor") {
        const res = await getDoctorConsultations(user._id);
        return res.data || [];
      }
      return [];
    },
    enabled,
    refetchInterval: enabled ? 1000 * 30 : false,
  });

  const { activeConsultation, upcomingSoonConsultation } = useMemo(() => {
    const consultations = Array.isArray(data) ? data : [];
    const active = getActiveConsultation(consultations);
    const upcomingSoon = getUpcomingSoonConsultation(consultations);
    return {
      activeConsultation: active,
      upcomingSoonConsultation: upcomingSoon,
    };
  }, [data]);

  useEffect(() => {
    if (!upcomingSoonConsultation) return;
    if (dismissedIds.has(upcomingSoonConsultation._id)) return;
  }, [upcomingSoonConsultation, dismissedIds]);

  const dismissConsultation = (consultationId) => {
    if (!consultationId) return;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(consultationId);
      return next;
    });
  };

  const effectiveUpcomingSoon =
    upcomingSoonConsultation && !dismissedIds.has(upcomingSoonConsultation._id)
      ? upcomingSoonConsultation
      : null;

  return {
    consultations: Array.isArray(data) ? data : [],
    activeConsultation,
    upcomingSoonConsultation: effectiveUpcomingSoon,
    isLoading,
    isError,
    error,
    dismissConsultation,
  };
}
