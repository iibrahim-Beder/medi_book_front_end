import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import DoctorSlotForm from "./DoctorSlotForm";

export default function DoctorDaySlotItem({
  slot,
  clinics,
  appointmentTypes,
  currencies,
  onToggle,
  onDelete,
  onSave
}) {
  if (!slot) return null;

  const handleSave = (updatedData) => {
    onSave(updatedData);
    onToggle(slot.id);
  };

  const clinicName = clinics.find(c => c.id.toString() === slot.clinic?.toString())?.name || "Select Clinic";

  return (
    <li>
      <div className="dc-accordioninnertitle">
        <span 
          onClick={() => onToggle(slot.id)} 
          style={{ cursor: "pointer" }}
          aria-expanded={slot.isOpen}
        >
          {clinicName} - {slot.startTime} to {slot.endTime}
        </span>
        <div className="dc-rightarea">
          <a
            className="dc-addinfo"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              onToggle(slot.id);
            }}
          >
            <FaPencilAlt />
          </a>
          <a
            className="dc-deleteinfo"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              onDelete(slot.id);
            }}
          >
            <FaTrash />
          </a>
        </div>
      </div>
      {slot.isOpen && (
        <div className="dc-collapseexp collapse show">
          <DoctorSlotForm
            doctorShift={slot}
            onSave={handleSave}
            appointmentTypes={appointmentTypes}
            currencies={currencies}
            clinics={clinics}
          />
        </div>
      )}
    </li>
  );
}