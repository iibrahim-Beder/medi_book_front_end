import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const statusColors = {
  completed: "#2ecc714a", // أخضر
  cancelled: "rgb(231 76 60 / 46%)", // أحمر
  empty: "rgb(108 117 125 / 58%)", // رمادي
  pending: "#247cff7b", // أزرق فاتح
};

const TimeSlosts = ({ slots = [], onRemoveSlot }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");

  const filteredSlots = slots.filter(
    (slot) => filter === "all" || slot.status === filter
  );

  return (
    <div className="dc-spaces-holder" style={{ backgroundColor: "#fcfcfc" }}>
      {/* فلتر الحالة */}
      <div className="dc-select">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">{t("slotsSelct.all")}</option>
          <option value="completed">{t("slotsSelct.completed")}</option>
          <option value="cancelled">{t("slotsSelct.cancelled")}</option>
          <option value="empty">{t("slotsSelct.empty")}</option>
          <option value="pending">{t("slotsSelct.pending")}</option>
        </select>
      </div>

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
