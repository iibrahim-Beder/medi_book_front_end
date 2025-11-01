import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ShiftsAccordion from "./cards/ShiftsAccordion";

export default function ShiftsManager({ ComponentProp, header = true, onShiftsChange, formData, regist = false }) {
  const { t } = useTranslation();

  const [clinics] = useState([
    { id: 1, name: t(" clinics kindergarten ") },
    { id: 2, name: t(" clinics spase medical ") },
    { id: 3, name: t(" clinics  xray  ") }
  ]);

  const daysOfWeek = [
    t("days.saturday"),
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),  
    t("days.thursday"),
    t("days.friday")
  ];

  const shiftTypes = [
    t("shiftTypes.morning"),
    t("shiftTypes.evening"),
    t("shiftTypes.night"),
    t("shiftTypes.custom")
  ];

  const [shifts, setShifts] = useState(formData?.shifts || [
    {
      id: 1,
      clinic: "1",
      day: t("days.saturday"),
      shiftType: t("shiftTypes.morning"),
      customFrom: "",
      customTo: "",
      breaks: [
        { from: "12:00", to: "13:00", id: "break_1" }
      ],
      isExpanded: false,
      isNew: false,
    },
    {
      id: 2,
      clinic: "2",
      day: t("days.sunday"),
      shiftType: t("shiftTypes.custom"),
      customFrom: "14:00",
      customTo: "18:00",
      breaks: [],
      isExpanded: false,
      isNew: false,
    }
  ]);

  useEffect(() => {
    if (onShiftsChange) {
      onShiftsChange(shifts);
    }
  }, [shifts, onShiftsChange]);

  const handleUpdateShift = (shiftId, field, value) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId ? { ...shift, [field]: value } : shift
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
      isExpanded: true,
      isNew: true,
    };
    setShifts(prev => [...prev, newShift]);
  };

  const handleSaveShift = (shiftId, shiftData, keepOpen = false) => {
    setShifts(prev =>
      prev.map(shift =>
        shift.id === shiftId ? {
          ...shiftData,
          isNew: false,
          isExpanded: keepOpen ? shiftData.isExpanded : false
        } : shift
      )
    );
  };

  const deleteShift = (shiftId) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
  };

  return (
    <div className="dc-shiftsmanager dc-tabsinfo">
      <ShiftsAccordion
        shifts={shifts}
        clinics={clinics}
        daysOfWeek={daysOfWeek}
        shiftTypes={shiftTypes}
        onAddShift={addNewShift}
        onDeleteShift={deleteShift}
        onUpdateShift={handleUpdateShift}
        onSaveShift={handleSaveShift}
        ComponentProp={ComponentProp}
        header={header}
        regist={regist}
        allowMultipleOpen={false}
      />
    </div>
  );
}