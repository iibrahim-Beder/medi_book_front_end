import React, { useState, useEffect } from "react";
import SelectField from "../pages/ui/form-fields/SelectField";
import SelectTimePicker from "../pages/ui/form-fields/SelectTimePicker";
import toast from "react-hot-toast";

export default function ShiftForm({
  dayIndex,
  shifts = [],
  templates = [],
  locations = [],
  onAdd,
  onUpdate,
  t,
}) {
  // سنعرض كل وردية موجودة كـ row مع إمكانية تعديل البريك و الموقع
  return (
    <div style={{ padding: 12 }}>
      {/* <h4>{t ? t("day") + " " + dayIndex : `Day ${dayIndex}`}</h4> */}

      {/* قائمة الوردية الموجودة لهذا اليوم */}
      {shifts.length === 0 && (
        <div>{t ? t("No shifts for this day") : "No shifts for this day"}</div>
      )}

      {shifts.map((shift) => (
        <SingleShiftRow
          key={shift.shiftId}
          shift={shift}
          templates={templates}
          locations={locations}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

function SingleShiftRow({ shift, templates, locations, onUpdate }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    shift.shiftTemplateId || 0,
  );
  const [selectedLocationId, setSelectedLocationId] = useState(
    shift.locationId || "",
  );
  const [breakStart, setBreakStart] = useState(
    shift.breakStartTime ? shift.breakStartTime: "",
  );
  const [breakEnd, setBreakEnd] = useState(
    shift.breakEndTime ? shift.breakEndTime : "",
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
     const res =  await onUpdate({
        shiftId: shift.shiftId,
        locationId: selectedLocationId,
        breakStartTime: breakStart,
        breakEndTime: breakEnd,
      });
      console.log("=====res", res);
      toast.success( "Updated Successfully");
      // هنا ممكن تعمل toast ناجح
    } catch (err) {
      // handle error / toast
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="shift-row"
      style={{
        // display: "flex",
        // gap: 12,
        // alignItems: "center",
        // marginBottom: 8,
      }}
    >
      {/* <div style={{ minWidth: 180 }}>
        <strong>
          {shift.shiftTemplateName || `Template ${selectedTemplateId}`}
        </strong>
        <div style={{ fontSize: 12 }}>{shift.locationName}</div>
      </div> */}
      <div className="dc-tabscontenttitle title-card ">
        <h3>{shift.shiftTemplateName} Shift</h3>
      </div>
      <div className="table-card" style={{ position: "relative",display: "flex", marginBottom: 20 }}>
         {/* <strong>
          {shift.shiftTemplateName || `Template ${selectedTemplateId}`}
        </strong> */}
        {/* {isLoading  && Loader("form-loader")} */}
        <form className="dc-formtheme dc-userform">
          <fieldset>
            {/* اختيار القالب */}
            <div className="form-group-half form-group">
              <SelectField
                label="Template"
                options={templates.map((tmpl) => ({
                  value: tmpl.templateId,
                  label: `${tmpl.name} ${tmpl.startTime && " " + tmpl.startTime + " - " + tmpl.endTime}`,
                }))}
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
              />
            </div>

            <div className="form-group-half form-group">
              <SelectField
                label="Location"
                options={locations.map((loc) => ({
                  value: loc.id,
                  label: loc.displayName,
                }))}
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
              />
            </div>

            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakStart"
                label="Break Start"
                value={breakStart}
                onChange={(e) => setBreakStart(e.target.value)}
              />
            </div>
            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakEnd"
                label="Break End"
                value={breakEnd}
                onChange={(e) => setBreakEnd(e.target.value)}
              />
            </div>



            <div className="form-group dc-btnarea mt-3">
              <button
              style={{float:"inline-end"}}
                type="button"
                className="second-btn float-end"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "saving..." : "Save"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

function AddShiftRow({ dayIndex, templates, locations, onAdd }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations?.[0]?.id || "",
  );
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!selectedTemplateId || !selectedLocationId) {
      // show validation
      return;
    }
    try {
      setSaving(true);
      await onAdd({
        shiftTemplateId: selectedTemplateId,
        locationId: selectedLocationId,
        breakStartTime: breakStart,
        breakEndTime: breakEnd,
        daysOfWeek: [dayIndex],
      });
      // بعد الإضافة الـ RTK invalidatesTags سيعيد جلب الورديات
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}
    >
      <div style={{ width: 220 }}>
        <SelectField
          label="Template"
          options={templates.map((tmpl) => ({
            value: tmpl.templateId,
            label: `${tmpl.name} ${tmpl.startTime && " " + tmpl.startTime + " - " + tmpl.endTime}`,
          }))}
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
        />
      </div>

      <div style={{ width: 160 }}>
        <SelectTimePicker
          name="breakStart"
          label="Break Start"
          value={breakStart}
          onChange={(e) => setBreakStart(e.target.value)}
        />
      </div>
      <div style={{ width: 160 }}>
        <SelectTimePicker
          name="breakEnd"
          label="Break End"
          value={breakEnd}
          onChange={(e) => setBreakEnd(e.target.value)}
        />
      </div>

      <div style={{ width: 200 }}>
        <SelectField
          label="Location"
          options={locations.map((loc) => ({
            value: loc.id,
            label: loc.displayName,
          }))}
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(Number(e.target.value))}
        />
      </div>

      <div>
        <button
          className="btn btn-success"
          onClick={handleAdd}
          disabled={saving}
        >
          {saving ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
