import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import ShiftForm from "./ShiftForm";

export default function ShiftItem({
  shift,
  clinics,
  daysOfWeek,
  shiftTypes,
  onToggle,
  onInputChange,
  onDelete,
  onAddBreak,
  onBreakChange,
  onDeleteBreak
}) {
  return (
    <li>
      <div className="dc-accordioninnertitle">
        <span
          onClick={() => onToggle(shift.id)}
          style={{ cursor: "pointer" }}
          aria-expanded={shift.isOpen}
        >
          {shift.clinic
            ? clinics.find((c) => c.id === parseInt(shift.clinic))?.name
            : "Select Clinic"}{" "}
          - {shift.day || "Select Day"}
        </span>
        <div className="dc-rightarea">
          <a className="dc-addinfo" href="#!" onClick={(e) => {
            e.preventDefault();
            onToggle(shift.id);
          }}>
            <FaPencilAlt />
          </a>
          <a className="dc-deleteinfo" href="#!" onClick={(e) => {
            e.preventDefault();
            onDelete(shift.id);
          }}>
            <FaTrash />
          </a>
        </div>
      </div>
      {/* {shift.isOpen && ( */}
        <div className={`dc-collapseexp ${shift.isOpen ? "show" : "hide"}`}>
          <ShiftForm
            shift={shift}
            clinics={clinics}
            daysOfWeek={daysOfWeek}
            shiftTypes={shiftTypes}
            onInputChange={onInputChange}
            onAddBreak={onAddBreak}
            onBreakChange={onBreakChange}
            onDeleteBreak={onDeleteBreak}
          />
        </div>
      {/* )} */}
    </li>
  );
}