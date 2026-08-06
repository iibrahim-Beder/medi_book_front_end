import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import SelectField from "../../ui/form-fields/SelectField";

const statusColors = {
  Reserved: "#FFA726",  // Orange (Temporary Hold)
  Booked: "#4FC3F7",    // Light Blue
  Completed: "#66BB6A", // Green
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
          { value: "Available", label: t("Available") },
          { value: "Scheduled", label: t("Scheduled") },
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
                  className={`dc-spaces ${ selectedSlotId === slot?.slotId ? "Selected" : ""} `}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    // transform:
                    //   selectedSlotId === slot?.slotId ? "scale(1.05, 1.26)" : "" ,
                      backgroundColor: `${statusColors[slot.status] || ""}`,
                      color:( slot.status === "Available"|| slot.status === "Reserved") ? "" : "white",
                  }}
                >
                  <div>
                    <span style={{ color: slot.status === "Available" ||slot.color === "Reserved" ? "#999" : "white" }}>{slot.startTime}</span>

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
