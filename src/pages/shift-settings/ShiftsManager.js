import React, { useState, useEffect } from "react";
import ShiftItem from "./cards/ShiftItem";
import '../MainCss.css'
import { useTranslation } from "react-i18next";
import ShiftForm from "./cards/ShiftForm";

export default function   ShiftsManager({ ComponentProp, header = true, onShiftsChange, formData ,regist=false}) {
  const { t } = useTranslation();

  // Clinics data
  const [clinics] = useState([
    { id: 1, name: t("Clinic1") },
    { id: 2, name: t("Clinic2") },
  ]);

  // Days of the week
  const daysOfWeek = [
    t("Saturday"), t("Sunday"), t("Monday"), t("Tuesday"), 
    t("Wednesday"), t("Thursday"), t("Friday")
  ];

  // Shift types
  const shiftTypes = [t("Morning"), t("Evening"), t("Night"), t("CustomShift")];

  // Use shifts from formData if available, otherwise use default value
  const [shifts, setShifts] = useState(formData?.shifts || [{
    id: 1,
    clinic: "",
    day: "",
    shiftType: "",
    customFrom: "",
    customTo: "",
    breaks: [],
    isOpen: true,
  }]);

  // When shifts change, notify the parent component
  useEffect(() => {
    if (onShiftsChange) {
      onShiftsChange(shifts);
    }
  }, [shifts, onShiftsChange]);

  // State handling functions
  const toggleAccordion = (id) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === id ? { ...shift, isOpen: !shift.isOpen } : shift
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === id ? { ...shift, [field]: value } : shift
      )
    );
  };

  const addNewShift = () => {
    const newId = shifts.length ? Math.max(...shifts.map(s => s.id)) + 1 : 1;
    const newShift = {
      id: newId,
      clinic: "",
      day: "",
      shiftType: "",
      customFrom: "",
      customTo: "",
      breaks: [],
      isOpen: true,
    };
    setShifts(prev => [...prev, newShift]);
  };

  const deleteShift = (id) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
  };

  const addBreak = (shiftId) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId
          ? { ...shift, breaks: [...shift.breaks, { from: "", to: "" }] }
          : shift
      )
    );
  };

  const handleBreakChange = (shiftId, breakIndex, field, value) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId
          ? {
              ...shift,
              breaks: shift.breaks.map((b, i) =>
                i === breakIndex ? { ...b, [field]: value } : b
              ),
            }
          : shift
      )
    );
  };

  const deleteBreak = (shiftId, breakIndex) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId
          ? {
              ...shift,
              breaks: shift.breaks.filter((_, i) => i !== breakIndex),
            }
          : shift
      )
    );
  };

  return (
    <div className="dc-shiftsmanager dc-tabsinfo">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("manageYourShifts")}</h3>
            <a href="#!" onClick={(e) => {
              e.preventDefault();
              addNewShift();
            }}>
              {t("shifts.addNew")}
            </a>
          </div>
        )}
        {!header && (
          <a href="#!" onClick={(e) => {
            e.preventDefault();
            addNewShift();
          }}>
            {t("shifts.addNew")}
          </a>
        )}
      </div>

     <ul className="dc-experienceaccordion accordion">
  {shifts.length === 1 && regist ? (
    // Single shift case → display as Form
    <ShiftForm
      shift={shifts[0]}
      clinics={clinics}
      daysOfWeek={daysOfWeek}
      shiftTypes={shiftTypes}
      onInputChange={handleInputChange}
      onAddBreak={addBreak}
      onBreakChange={handleBreakChange}
      onDeleteBreak={deleteBreak}
    />
  ) : (
    // Multiple shifts case → display as Items
    shifts.map((shift) => (
      <ShiftItem
        key={shift.id}
        shift={shift}
        clinics={clinics}
        daysOfWeek={daysOfWeek}
        shiftTypes={shiftTypes}
        onToggle={toggleAccordion}
        onInputChange={handleInputChange}
        onDelete={deleteShift}
        onAddBreak={addBreak}
        onBreakChange={handleBreakChange}
        onDeleteBreak={deleteBreak}
      />
    ))
  )}
</ul>
    </div>
  );
}
