
export const toDecimal = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h + parseInt(minute, 10) / 60;
};

export const getTimeSlotTitle = (item, t = (x) => x) => {
  if (
    item.rangeTime &&
    item.Price &&
    item.Currency &&
    item.AllowedAppointmentTypes
  ) {
    return `${item.rangeTime.start} - ${item.rangeTime.end} - ${
      item.AllowedAppointmentTypes.map((x) => t(x)).join(", ")
    } - ${item.Price} ${item.Currency}`;
  }

  if (item.rangeTime && item.Price && item.Currency) {
    return `${item.rangeTime.start} - ${item.rangeTime.end} - ${item.Price} ${item.Currency}`;
  }

  if (item.rangeTime) {
    return `${item.rangeTime.start} - ${item.rangeTime.end}`;
  }

  return "New Rule";
};


export const APPOINTMENT_TYPES = ["InPerson", "VideoCall", "PhoneCall"];
export const transformRuleData = (rule) => {
  return {
    id: rule.generationRuleID || `rule-${Date.now()}`,
    ruleId: rule.generationRuleID,

    SlotDurationInMinutes: rule.slotDurationInMinutes,

    rangeTime: {
      start: rule.startTime?.slice(0, 5),
      end: rule.endTime?.slice(0, 5),
    },

    Price: rule.price,
    Currency: rule.currency,

    AllowedAppointmentTypes: rule.allowedAppointmentTypes
      ? rule.allowedAppointmentTypes === "All"?APPOINTMENT_TYPES.map((v) => v.trim()): rule.allowedAppointmentTypes.split(",").map((v) => v.trim())
      : [],

    isActive: rule.isActive,

    isNew: false,
    isExpanded: false,
  };
};

export const timeToNumber = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

export const buildRuleUpdatePayload = (original, updated) => {
  const payload = {};

  if (Number(original.price) !== Number(updated.Price)) {
    payload.overrideAmount = Number(updated.Price);
  }

  if (
    Number(original.slotDurationInMinutes) !==
    Number(updated.SlotDurationInMinutes)
  ) {
    payload.slotDurationInMinutes =
      Number(updated.SlotDurationInMinutes);
  }

 const originalTypes =
  original.allowedAppointmentTypes === "All"
    ? [...APPOINTMENT_TYPES].sort()
    : (original.allowedAppointmentTypes || "")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
        .sort();

  const updatedTypes = (updated.AllowedAppointmentTypes || [])
    .map(x => x.trim())
    .filter(Boolean)
    .sort();

  if (
    JSON.stringify(originalTypes) !==
    JSON.stringify(updatedTypes)
  ) {
    payload.allowedAppointmentTypes = updatedTypes.join(",");
  }

  if (
    original.startTime !== updated.rangeTime?.start ||
    original.endTime !== updated.rangeTime?.end
  ) {
    payload.startTime = updated.rangeTime.start;
    payload.endTime = updated.rangeTime.end;
  }

  return payload;
};