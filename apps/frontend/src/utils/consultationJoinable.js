/**
 * Matches backend getHourRange + cron: scheduled time falls in [start of hour, start of next hour).
 */
export function isConsultationInCurrentHourSlot(consultationDate) {
  if (consultationDate == null) return false;
  const startHour = new Date();
  startHour.setMinutes(0, 0, 0);
  const endHour = new Date(startHour);
  endHour.setHours(startHour.getHours() + 1);
  const d = new Date(consultationDate);
  if (Number.isNaN(d.getTime())) return false;
  return d >= startHour && d < endHour;
}

/** Patient or doctor: allowed to open the video room (matches backend cron rules). */
export function isConsultationJoinable(consultation) {
  if (!consultation) return false;
  if (consultation.status === "in-progress") return true;
  if (
    consultation.status === "pending" &&
    isConsultationInCurrentHourSlot(consultation.date)
  ) {
    return true;
  }
  return false;
}

export function findJoinableConsultation(consultations) {
  if (!Array.isArray(consultations) || consultations.length === 0) return null;
  const active = consultations.find((c) => c.status === "in-progress");
  if (active) return active;
  return (
    consultations.find(
      (c) => c.status === "pending" && isConsultationInCurrentHourSlot(c.date),
    ) || null
  );
}
