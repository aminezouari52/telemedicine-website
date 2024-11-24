const getHourRange = () => {
  const startHour = new Date();
  startHour.setMinutes(0, 0, 0);

  const endHour = new Date(startHour);
  endHour.setHours(startHour.getHours() + 1);

  return { startHour, endHour };
};

module.exports = getHourRange;
