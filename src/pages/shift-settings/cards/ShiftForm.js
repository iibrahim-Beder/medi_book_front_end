import React from "react";
import BreakItem from "./BreakItem";
import { useTranslation } from "react-i18next";

export default function ShiftForm({
  shift,
  clinics,
  daysOfWeek,
  shiftTypes,
  onInputChange,
  onAddBreak,
  onBreakChange,
  onDeleteBreak
}) {
  const { t } = useTranslation();

  return (
    <form className="dc-formtheme dc-userform">
      <fieldset>
        {/* Clinic */}
        <div className="form-group form-group-half">
          <select
            className="form-control"
            value={shift.clinic}
            onChange={(e) => onInputChange(shift.id, "clinic", e.target.value)}
          >
            <option value="">{t("selectLocation")}</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div className="form-group form-group-half">
          <select
            className="form-control"
            value={shift.day}
            onChange={(e) => onInputChange(shift.id, "day", e.target.value)}
          >
            <option value="">{t("selectDay")}</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Type */}
        <div className="form-group">
          <select
            className="form-control"
            value={shift.shiftType}
            onChange={(e) =>
              onInputChange(shift.id, "shiftType", e.target.value)
            }
          >
            <option value="">{t("selectShiftType")}</option>
            {shiftTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Shift Time */}
        {shift.shiftType === t("CustomShift") && (
          <>
            <div className="form-group form-group-half">
              <label style={{ marginBottom: "0px" }}>{t("startTime")}</label>
              <input
                type="time"
                className="form-control"
                value={shift.customFrom}
                onChange={(e) =>
                  onInputChange(shift.id, "customFrom", e.target.value)
                }
              />
            </div>
            <div className="form-group form-group-half">
              <label style={{ marginBottom: "0px" }}>{t("endTime")}</label>
              <input
                type="time"
                className="form-control"
                value={shift.customTo}
                onChange={(e) =>
                  onInputChange(shift.id, "customTo", e.target.value)
                }
              />
            </div>
          </>
        )}

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
