import React, { forwardRef, useImperativeHandle } from "react";
import SelectTimePicker from "../pages/ui/form-fields/SelectTimePicker";
import { useTranslation } from "react-i18next";
import useAddShifts from "../pages/doctor-registration/hooks/useAddShifts";
import SelectField from "../pages/ui/form-fields/SelectField";
import DaysAvailabilityCheckbox from "../pages/ui/form-fields/DaysAvailabilityCheckbox";

const ShiftStep = forwardRef(
  (
    {
      insidUi = false,
      isNew,
      doctorId,
      onChange = () => {},
      forceShowError = true,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const {
      selectedTemplateId,
      setSelectedTemplateId,
      selectedLocationId,
      setSelectedLocationId,
      breakTimes,
      setBreakTimes,
      selectedDays,
      toggleDay,
      // dayCheckboxes,
      loadingAvailability,
      availabilityData,
      handleSave,
      isAdding,
      locations,
      isFetchingAvailability,
      templates,
    } = useAddShifts((doctorId = 103));
    console.log("locations", locations);
    useImperativeHandle(ref, () => ({
      submit: handleSave,
    }));

    return (
      // <div className="shift-template-selector">
      <div
        className="table-card"
        style={{ position: "relative", display: "flex" }}
      >
        {/* {isLoading  && Loader("form-loader")} */}
        <form className="dc-formtheme dc-userform">
          <fieldset>
            <div className="form-group-half form-group">
              <SelectField
                label={t("Time Template")}
                options={templates.map((tmpl) => ({
                  value: tmpl.templateId,
                  label:
                    tmpl.name +
                    `${tmpl.startTime && "  " + tmpl.startTime + " - " + tmpl.endTime}`,
                }))}
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                placeholder={t("shift.selectTemplatePlaceholder")}
              />
            </div>
            <div className="form-group-half form-group">
              <DaysAvailabilityCheckbox
                availability={availabilityData}
                selectedDays={selectedDays}
                onToggle={toggleDay}
                disabled={
                  loadingAvailability ||
                  !availabilityData ||
                  isFetchingAvailability ||
                  selectedTemplateId === "0"
                }
                loading={loadingAvailability || isFetchingAvailability}
              />
            </div>

            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakStartTime"
                label="Break Start Time"
                placeholder="Break Start Time"
                value={breakTimes.start}
                onChange={(e) =>
                  setBreakTimes({ ...breakTimes, start: e.target.value })
                }
              />
            </div>
            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakEndTime"
                label="Break End Time"
                placeholder="Break End Time"
                value={breakTimes.end}
                onChange={(e) =>
                  setBreakTimes({ ...breakTimes, end: e.target.value })
                }
              />
            </div>
            <div className="form-group-half form-group">
              <SelectField
                label={t("Location")}
                options={locations.map((loc) => ({
                  value: loc.id,
                  label: loc.displayName,
                }))}
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                placeholder={t("shift.selectLocationPlaceholder")}
              />
            </div>
            {insidUi && (
              <div className="form-group dc-btnarea">
                <button
                  type="button"
                  className="second-btn"
                  style={{ float: "inline-end" }}
                  onClick={handleSave}
                  disabled={isAdding || loadingAvailability}
                >
                  {isAdding ? t("saving") + "..." : t("save")}
                </button>
              </div>
            )}
          </fieldset>
        </form>
        {/* </div> */}
      </div>
    );
  },
);
export default ShiftStep;
