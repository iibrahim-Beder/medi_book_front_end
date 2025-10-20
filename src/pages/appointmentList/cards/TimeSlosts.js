import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "../../ui/form-fields/SelectField";

const statusColors = {
  completed: "#2ecc714a", // green  
  cancelled: "rgb(231 76 60 / 46%)", // red
  empty: "rgb(108 117 125 / 58%)", // gray 
  pending: "#247cff7b", // blue
};

const TimeSlosts = ({ slots = [], onRemoveSlot }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");

  const filteredSlots = slots.filter(
    (slot) => filter === "all" || slot.status === filter
  );

  return (
    <div className="dc-spaces-holder" style={{ backgroundColor: "#fcfcfc" }}>
      {/* filter */}
       <SelectField
          name="filter"
          options={[
            { value: "all", label: t("slots.all") },
            { value: "completed", label: t("slots.completed") },
            { value: "cancelled", label: t("slots.cancelled") },
            { value: "empty", label: t("slots.empty") },
            { value: "pending", label: t("slots.pending") },
          ]}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

      <ul className="dc-spaces-wrap">
        {filteredSlots.map((slot, index) => (
          <li key={index}>
            <a
              href="#!"
              className="dc-spaces"
              onClick={() => console.log("Clicked slot:", slot)}
              style={{
                border:
                  filter === "all"
                    ? ""
                    : `0.5px solid ${
                        statusColors[slot.status] || "#000000ff"
                      }`,
              }}
            >
              <div>
                <span style={{ color: "#999" }}>{slot.time}</span>
                <span>
                  {t("slots.spaces")}: {slot.spaces.toString().padStart(2, "0")}
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
