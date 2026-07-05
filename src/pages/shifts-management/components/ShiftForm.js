import React, { useState, useEffect } from "react";
import SelectField from "../../ui/form-fields/SelectField";
import SelectTimePicker from "../../ui/form-fields/SelectTimePicker";
import toast from "react-hot-toast";
import PopupMessage from "../../shared/PopupMessage";
import { useTranslation } from "react-i18next";
import DataEmptyComponent from "../../shared/DataEmptyComponent";
import DaysAvailabilityCheckbox from "../../ui/form-fields/DaysAvailabilityCheckbox";
import useShift from "../hooks/useShift";
import Skeleton from "react-loading-skeleton";
export default function ShiftForm({
  dayIndex,
  shifts = [],
  templates = [],
  locations = [],
  onAdd,
  onUpdate,
  onToggleActive,
  setOpenModal,
}) {
  console.log("shifts", shifts);
  const { t } = useTranslation();

  const {
    availabilityData,
    loadingAvailability,
    availabilityError,
    isAvailabilityError,
    isFetchingAvailability,
    refetchAvailability,
    setSelectedTemplateId,
    selectedDays,
    toggleDay,
    selectedTemplateId,
  } = useShift();

  const [activePopup, setActivePopup] = useState({
    show: false,
    id: null,
    newActive: false,
    locationName: "",
  });
  const handleCloseActiveConfirm = () => {
    setActivePopup({ show: false,shiftName: "", id: null, newActive: false});
  };

  const handleConfirmActiveToggle = () => {
    const shiftIds = selectedDays.map(
      (day) => availabilityData.find((item) => item.dayOfWeek === day)?.shiftId,
    );

    if (shiftIds.length > 0 && onToggleActive) {
      onToggleActive(shiftIds, activePopup.newActive);
    }
    handleCloseActiveConfirm();
  };
  const handleShowActiveConfirm = (id, newActive, shiftName) => {
    setSelectedTemplateId(id);
    setActivePopup({ show: true, id, newActive, shiftName });
  };

  const renderDaysAvailabilityCheckbox = () => {
    if (loadingAvailability || !availabilityData || isFetchingAvailability ) {
      return (
        <div className="pl-3">
        {[...Array(7)].map((i) => (
          <div className="row">
            <Skeleton  width={25} height={20}   />
            <div style={{ flex: 1 , marginLeft: 10 , marginBottom: 10 }}>
              <Skeleton height={20} width="50%" />
            </div>
          </div>

        ))}
        </div>
      );
    } else {
      return (
        <DaysAvailabilityCheckbox
          openAlways={true}
          availability={availabilityData}
          selectedDays={selectedDays}
          onToggle={toggleDay}
          disabled={
            loadingAvailability || !availabilityData || isFetchingAvailability
          }
          loading={loadingAvailability || isFetchingAvailability}
          isUseToDeactivate={activePopup.newActive ? false : true}
          isUseToReactivate={activePopup.newActive ? true : false}
        />
      );
    }
  };

  return (
    <div className="shift-form-container">
      {shifts.length === 0 && (
        <DataEmptyComponent
          text="No Shift Found for this day"
          btnText="Add New Shift"
          onClick={() => setOpenModal(true)}
        />
      )}

      {shifts.map((shift) => (
        <SingleShiftFourm
          onToggleActive={onToggleActive}
          key={shift.shiftId}
          shift={shift}
          templates={templates}
          locations={locations}
          onUpdate={onUpdate}
          onShowActiveConfirm={handleShowActiveConfirm}
        />
      ))}
      {activePopup.show && (
        <PopupMessage
          type={activePopup.newActive ? "success" : "danger"}
          title={
            activePopup.newActive ? t(`activate ${activePopup?.shiftName||"" } shift`) : t(`deactivate  ${activePopup.shiftName} shift`)
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
          children={renderDaysAvailabilityCheckbox()}
        />
      )}
    </div>
  );
}

function SingleShiftFourm({
  shift,
  locations,
  onUpdate,
  onToggleActive,
  templates,
  onShowActiveConfirm,
}) {
  const template = templates.find(
    (s) => s.templateId === shift.shiftTemplateId,
  );
  useEffect(() => {
    setisActive(shift.isActive);
  }, [shift]);
  const { t } = useTranslation();

  const [selectedLocationId, setSelectedLocationId] = useState(
    shift.locationId || "",
  );
  const [breakStart, setBreakStart] = useState(shift.breakStartTime || null);
  const [breakEnd, setBreakEnd] = useState(shift.breakEndTime || null);
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
                  onShowActiveConfirm(
                    shift.shiftTemplateId,
                    !isActive,
                    template?.name || "",
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
    </div>
  );
}
