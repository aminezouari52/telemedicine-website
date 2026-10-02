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
