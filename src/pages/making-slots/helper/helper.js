export const toDecimal = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h + parseInt(minute, 10) / 60;
};

  export const getTimeSlotTitle = (item) => {
    if (item.rangeTime && item.Price && item.Currency && item.AllowedAppointmentTypes) {
      return `${item.rangeTime.start} - ${item.rangeTime.end} - ${item.AllowedAppointmentTypes} - ${item.Price} ${item.Currency}`;
    }
    else if (item.rangeTime && item.Price && item.Currency) {
      return `${item.rangeTime.start} - ${item.rangeTime.end} -  ${item.Price} ${item.Currency}`;
    } 
    else if (item.rangeTime) {
      return `${item.rangeTime.start} - ${item.rangeTime.end}`;
    }
    return "New Rule";
  };
