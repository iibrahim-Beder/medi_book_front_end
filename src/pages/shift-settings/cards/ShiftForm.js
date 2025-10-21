import React from "react";
import BreakItem from "./BreakItem";
import { useTranslation } from "react-i18next";
import SelectField from "../../ui/form-fields/SelectField";
import Field from "../../ui/form-fields/Field";
import SectionTitle from "../../shared/SectionTitle";
import { FaClinicMedical, FaCalendarDay, FaExchangeAlt, FaClock, FaPause } from "react-icons/fa";

export default function ShiftForm({
  shift,
  clinics,
  daysOfWeek,
  shiftTypes,
  onInputChange,
  onAddBreak,
  onBreakChange,
  onDeleteBreak,
  errors = {},
  forceShowError = true,
}) {
  const { t } = useTranslation();

  return (
    <form className="dc-formtheme dc-userform">
      hallooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
        {/* Clinic */}
        <SelectField
          label={t("location")}
          name={`clinic_${shift.id}`}
          value={shift.clinic}
          onChange={(e) => onInputChange(shift.id, "clinic", e.target.value)}
          options={[
            { value: "", label: t("selectLocation") },
            ...clinics.map((clinic) => ({
              value: clinic.id,
              label: clinic.name,
            })),
          ]}
          icon={<FaClinicMedical />}
          error={errors[`clinic_${shift.id}`]}
          forceShowError={forceShowError}
        />
      <fieldset>
            <div className="form-grid">

        {/* Day */}
        <SelectField
          label={t("day")}
          name={`day_${shift.id}`}
          value={shift.day}
          onChange={(e) => onInputChange(shift.id, "day", e.target.value)}
          options={[
            { value: "", label: t("selectDay") },
            ...daysOfWeek.map((day) => ({
              value: day,
              label: day,
            })),
          ]}
          icon={<FaCalendarDay />}
          error={errors[`day_${shift.id}`]}
          forceShowError={forceShowError}
        />

        {/* Shift Type */}
        <SelectField
          label={t("shiftType")}
          name={`shiftType_${shift.id}`}
          value={shift.shiftType}
          onChange={(e) => onInputChange(shift.id, "shiftType", e.target.value)}
          options={[
            { value: "", label: t("selectShiftType") },
            ...shiftTypes.map((type) => ({
              value: type,
              label: type,
            })),
          ]}
          icon={<FaExchangeAlt />}
          error={errors[`shiftType_${shift.id}`]}
          forceShowError={forceShowError}
        />

        {/* Custom Shift Time */}
        {shift.shiftType === t("CustomShift") && (
          <>
            <Field
              label={t("startTime")}
              name={`customFrom_${shift.id}`}
              type="time"
              value={shift.customFrom}
              onChange={(e) =>
                onInputChange(shift.id, "customFrom", e.target.value)
              }
              icon={<FaClock />}
              error={errors[`customFrom_${shift.id}`]}
              forceShowError={forceShowError}
            />

            <Field
              label={t("endTime")}
              name={`customTo_${shift.id}`}
              type="time"
              value={shift.customTo}
              onChange={(e) =>
                onInputChange(shift.id, "customTo", e.target.value)
              }
              icon={<FaClock />}
              error={errors[`customTo_${shift.id}`]}
              forceShowError={forceShowError}
            />
          </>
        )}</div>
  {/* Breaks */}
          <div className="mt-4 dc-tabscontenttitle no-before-line dc-addnew">
            <h3>{t("breaks")}</h3>
            <a href="!#" onClick={(e) => {
              e.preventDefault();
              onAddBreak(shift.id);
            }}
          >
            {t("addBreak")}</a>
          </div>
        <div className="form-group">
          {/* <label>{t("breaks")}</label> */}
          {shift.breaks.map((b, i) => (
            <BreakItem
              key={i}
              breakData={b}
              onBreakChange={(field, value) =>
                onBreakChange(shift.id, i, field, value)
              }
              onDeleteBreak={() => onDeleteBreak(shift.id, i)}
            />
          ))}

        </div>
      </fieldset>
    </form>
  );
}
