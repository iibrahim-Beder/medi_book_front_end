import React from "react";
import DoctorDaySlotItem from "./DoctorDaySlotItem";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DoctorDaySlots({
  day,
  slots,
  clinics,
  appointmentTypes,
  currencies,
  onAddSlot,
  onDeleteSlot,
  onToggleSlot,
  onSaveSlot
}) {
    const { t } = useTranslation();

  return (
    <div className="doctor-day-slots">
      {/*    <div className="dc-tabscontenttitle dc-addnew">
        <h3>{day} slots</h3>
        <a href="#!"  
            onClick={() => onAddSlot(day)} >
         Add Slot
        </a>
      </div> */}
      <div className="dc-tabscontenttitle dc-addnew">
        <h3> {t("slots")} {day}</h3>
        <button 
          onClick={() => onAddSlot(day)}
        >
          <FaPlus /> {t("Add Slot")}
        </button>
      </div>

      <ul className="dc-accordion">
        {slots.map(slot => (
          <DoctorDaySlotItem
            key={slot.id}
            slot={slot}
            clinics={clinics}
            appointmentTypes={appointmentTypes}
            currencies={currencies}
            onToggle={onToggleSlot}
            onDelete={onDeleteSlot}
            onSave={onSaveSlot}
          />
        ))}
      </ul>
    </div>
  );
}