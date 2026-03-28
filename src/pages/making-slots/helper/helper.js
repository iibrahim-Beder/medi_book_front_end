export const toDecimal = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h + parseInt(minute, 10) / 60;
};