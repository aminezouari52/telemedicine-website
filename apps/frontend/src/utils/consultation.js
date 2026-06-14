export const generateAvailableHours = (consultationsData, selectedDate) => {
  const isHourUnavailable = (hour) => {
    return consultationsData
      ?.filter(
        (c) =>
          (c.status === "pending" || c.status === "in-progress") &&
          new Date(c.date).toISOString().slice(0, 10) === selectedDate,
      )
      .some((c) => new Date(c.date).getHours() === hour);
  };

  return Array.from({ length: 24 }, (_, i) => ({
    value: `${i}`,
    name: `${i.toString().padStart(2, "0")}h`,
  })).filter((option) => !isHourUnavailable(parseInt(option.value)));
};

export const consultationsMonthlyGrowth = (consultations) => {
  const now = new Date();

  // Month boundaries (constructor normalizes month -1 / +1 across the year).
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const countInRange = (from, to) =>
    consultations?.filter((consultation) => {
      const date = new Date(consultation.date);
      return date >= from && date < to;
    })?.length ?? 0;

  const thisMonth = countInRange(thisMonthStart, nextMonthStart);
  const lastMonth = countInRange(lastMonthStart, thisMonthStart);

  // No baseline: show 100% when there's new activity, otherwise 0%.
  if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;

  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
};
