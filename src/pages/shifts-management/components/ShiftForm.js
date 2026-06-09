import React, { useState, useEffect } from "react";
import SelectField from "../../ui/form-fields/SelectField";
import SelectTimePicker from "../../ui/form-fields/SelectTimePicker";
import toast from "react-hot-toast";
import PopupMessage from "../../shared/PopupMessage";
import { useTranslation } from "react-i18next";
import DataEmptyCom from "../../shared/DataEmptyCom";
import DaysAvailabilityCheckbox from "../../ui/form-fields/DaysAvailabilityCheckbox";
import useAddShifts from "../../doctor-registration/hooks/useAddShifts";
export default function ShiftForm({
  dayIndex,
  shifts = [],
  templates = [],
  locations = [],
  onAdd,
  onUpdate,
  onToggleActive,
  setOpenModal
}) {
  console.log("shifts", shifts);
  const { t } = useTranslation();
  return (
    <div>
      {shifts.length === 0 && (
       <DataEmptyCom text="No Shift Found for this day" btnText="Add New Shift" onClick={() => setOpenModal(true)} />
      )}

      {shifts.map((shift) => (
        <SingleShiftFourm
          onToggleActive={onToggleActive}
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

function SingleShiftFourm({ shift, locations, onUpdate, onToggleActive, templates }) {
  const template = templates.find((s) => s.templateId === shift.shiftTemplateId);
  useEffect(() => {
    setisActive(shift.isActive);
  }, [shift]);

  const { t } = useTranslation();

  const [activePopup, setActivePopup] = useState({
    show: false,
    id: null,
    newActive: false,
    locationName: "",
  });
  const handleCloseActiveConfirm = () => {
    setActivePopup({ show: false, id: null, newActive: false, shiftName: "" });
  };

  const handleConfirmActiveToggle = () => {
    if (activePopup.id !== null && onToggleActive) {
      onToggleActive(activePopup.id, activePopup.newActive);
    }
    handleCloseActiveConfirm();
  };
  const handleShowActiveConfirm = (id, newActive, shiftName) => {
    setActivePopup({ show: true, id, newActive, shiftName });
  };
  const [selectedLocationId, setSelectedLocationId] = useState(
    shift.locationId || "",
  );
  const [breakStart, setBreakStart] = useState(
    shift.breakStartTime || null,
  );
  const [breakEnd, setBreakEnd] = useState(
    shift.breakEndTime || null,
  );
  const [isActive, setisActive] = useState(
    shift.isActive ? shift.isActive : false,
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      const res = await onUpdate({
        shiftId: shift.shiftId,
        locationId: selectedLocationId,
        breakStartTime: breakStart,
        breakEndTime: breakEnd,
      });
      if (res.succeeded) {
        toast.success("Updated Successfully");
      }
    } catch (err) {
      toast.error("Failed to update");
      // handle error / toast
      console.error(err);
    } finally {
      setSaving(false);
    }
  }
  const activeCheckboxId = `active-${shift.shiftId}`;
    const {
      selectedTemplateId,
      selectedDays,
      toggleDay,
      // dayCheckboxes,
      loadingAvailability,
      availabilityData,
      isFetchingAvailability,
      errors,
    } = useAddShifts()
  return (
    <div className="shift-form">
      <div className="dc-tabscontenttitle title-card ">
        <h3>{shift.shiftTemplateName} Shift</h3>
      </div>
      <div
        className="table-card insideUi"
        style={{ position: "relative", display: "flex", marginBottom: 20 }}
      >
        {/* {isLoading  && Loader("form-loader")} */}
        <form className="dc-formtheme dc-userform">
          <fieldset>
            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakStart"
                label="Break Start"
                value={breakStart}
                onChange={(e) => setBreakStart(e.target.value)}
                minTime={template?.startTime}
                maxTime={template?.endTime}
              />
            </div>
            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakEnd"
                label="Break End"
                value={breakEnd}
                onChange={(e) => setBreakEnd(e.target.value)}
                minTime={template?.startTime}
                maxTime={template?.endTime}
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
            <div className="form-group dc-btnarea mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleShowActiveConfirm(
                    shift.shiftId,
                    !isActive,
                    shift.locationName,
                  );
                }}
                className={`second-btn m-0 ${isActive ? "deactivate-btn" : ""}`}
                style={{ margin: "11px 4px", minWidth: "fit-content" }}
              > 
                {isActive ? t("Deactivate") : t("Activate")}
              </button>
              <button
                style={{ float: "inline-end" }}
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
      {activePopup.show && (
        <PopupMessage
          type={activePopup.newActive ? "success" : "danger"}
          title={
            activePopup.newActive ? t("activate shift") : t("deactivate shift")
          }
          message={t(
            activePopup.newActive
              ? "Are you sure you want to activate selected shift?"
              : "Are you sure you want to deactivate selected shift?",
            { name: activePopup.shiftName },
          )}
          buttons={[
            {
              text: t("cancel"),
              onClick: handleCloseActiveConfirm,
              variant: "simple-cancel-btn shadow-0 ",
            },
            {
              text: t("confirm"),
              onClick: handleConfirmActiveToggle,
              variant: activePopup.newActive ? "primary" : "deactivate-btn",
            },
          ]}
          onClose={handleCloseActiveConfirm}
          children={
            <DaysAvailabilityCheckbox
              openAlways={true}
              availability={[
                {dayOfWeek: 0,  state: "AvailableToDeactivate",},
                { dayOfWeek: 1, state: "AvailableToDeactivate" },
                { dayOfWeek: 2, state: "AlreadyDeactivated" },
                { dayOfWeek: 3, state: "AlreadyDeactivated" },
                { dayOfWeek: 4, state: "AvailableToDeactivate" },
                { dayOfWeek: 5, state: "AvailableToDeactivate" },
                { dayOfWeek: 6, state: "AvailableToDeactivate" },
              ]}
              selectedDays={selectedDays}
              onToggle={toggleDay}
              // disabled={
              //   loadingAvailability ||
              //   !availabilityData ||
              //   isFetchingAvailability ||
              //   selectedTemplateId === "0"
              // }
              loading={loadingAvailability || isFetchingAvailability}
              error={errors.selectedDays}
            />
          }
        />
      )}
    </div>
  );
}
