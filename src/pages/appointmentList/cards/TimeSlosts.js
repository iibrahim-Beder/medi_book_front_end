import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import SelectField from "../../ui/form-fields/SelectField";

const statusColors = {
  completed: "#66BB6A", // Green
  cancelled: "#EF5350", // Red
  Scheduled: "#4FC3F7", // Light Blue
  Booked: "#4FC3F7",    // Light Blue
};
const TimeSlosts = ({ slots = [], isLoading = false ,filter, setFilter,selectedSlotId, setSelectedSlot }) => {
  const { t } = useTranslation();

  return (
    <div className="">
    {/* <div className="dc-spaces-holder"> */}
      <SelectField
        name="filter"
        options={[
          { value: "All", label: t("slotStatuses.all") },
          { value: "Scheduled", label: t("Scheduled") },
          { value: "Cancelled", label: t("slotStatuses.cancelled") },
          { value: "Completed", label: t("Completed") },
        ]}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul className="dc-spaces-wrap">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <li key={index}>
                <div
                  className="pb-2"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <Skeleton height={25} width={"70%"} borderRadius={4} />
                </div>
              </li>
            ))
          : slots.map((slot, index) => (
              <li key={index}>
                <a
                  href="#!"
                  className="dc-spaces"
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    border:
                      selectedSlotId === slot?.slotId ? "1px solid var(--blue)" : "" ,
                      backgroundColor: `${statusColors[slot.status] || ""}`,
                      color: slot.status === "Available" ? "" : "white",
                  }}
                >
                  <div>
                    <span style={{ color: slot.status === "Available" ? "#999" : "white" }}>{slot.startTime}</span>

                    <span>
                      {t("spaces")}:{" "}
                      {slot?.duration?.toString().padStart(2, "0")}
                    </span>
                  </div>
                </a>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default TimeSlosts;
