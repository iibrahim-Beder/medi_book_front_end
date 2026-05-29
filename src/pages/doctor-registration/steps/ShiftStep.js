import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "../../ui/form-fields/SelectField";
import DaysAvailabilityCheckbox from "../../ui/form-fields/DaysAvailabilityCheckbox";
import SelectTimePicker from "../../ui/form-fields/SelectTimePicker";
import useAddShifts from "../hooks/useAddShifts";
import { BiSolidInfoCircle } from "react-icons/bi";
const ShiftStep = forwardRef(
  (
    {
      insidUi = false,
      isNew,
      onChange = () => {},
      forceShowError = true,
      MainHint=""
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
      isLoadingLocations,
      isFetchingAvailability,
      templates,
      selectedTemplate,
      errors
    } = useAddShifts();

    useImperativeHandle(ref, () => ({
      submit: handleSave,
    }));

    return (
      <>
      <div
        className={insidUi ? "" : "table-card insideUi"}
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
                    tmpl.name ,
                }))}
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                placeholder={t("shift.selectTemplatePlaceholder")}
                error={errors.selectedTemplateId}
                forceShowError={forceShowError}
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
                error={errors.selectedDays}
              />
            </div>

            <div className="form-group-half form-group">
              <SelectTimePicker
                name="breakStartTime"
                label="Break Start Time"
                placeholder="Break Start Time"
                value={breakTimes.start}
                minTime={selectedTemplate?.startTime}
                maxTime={selectedTemplate?.endTime}
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
                minTime={selectedTemplate?.startTime}
                maxTime={selectedTemplate?.endTime}
                onChange={(e) =>
                  setBreakTimes({ ...breakTimes, end: e.target.value })
                }
              />
            </div>
            <div className="form-group-half form-group">
              <SelectField
                label={t("Location")}
                name="location"
                disabled={isLoadingLocations || !locations.length}
                options={ isLoadingLocations ? [{ value: "empty", label: t("loading") }] : [{ value: "empty", label: t("Select Location") }, ...locations.map((loc) => ({
                  value: loc.id,
                  label: loc.displayName,
                }))]}
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                error={errors.selectedLocationId}
                forceShowError={forceShowError}

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
       {MainHint && <span className="align-items-center d-inline-flex"><BiSolidInfoCircle style={{fontSize:"x-large" , margin: "10px 5px" ,minWidth:"fit-content"}} />{MainHint}</span>} 

      </>
    );
  },
);
export default ShiftStep;
