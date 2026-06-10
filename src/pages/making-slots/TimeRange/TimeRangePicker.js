import React, { useState, useEffect, useRef } from "react";
import { CiClock2 } from "react-icons/ci";
import { formatTimeForDisplay, parseManualInput } from "../../shared/utils";
import SegmentedProgress from "./SegmentedProgress";
import TimeRangePickerUI from "./TimeRangePickerUI";
import { useTimeRangePicker } from "./useTimeRangePicker";

const TimeRangePicker = ({
  label = "Time Range",
  name,
  value = {},
  onChange,
  onBlur,
  placeholder = "Select Time Range",
  error,
  forceShowError = false,
  disabled = false,
  half = false,
  required = false,
  width = "auto",
  timeline = [],
  lastActiveId,
  showinModal=false
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputError, setInputError] = useState("");

  const dropdownRef = useRef();
  const inputRef = useRef();

  // Use the custom hook
  const {
    startTime,
    endTime,
    manualStartInput,
    manualEndInput,
    startPeriod,
    endPeriod,
    startHour,
    startMinute,
    endHour,
    endMinute,
    selectedRange,
    showTimePickerUI,
    activeRange,
    isSelectingStart,
    isStartTimeSelected,

    getFilteredHours,
    getFilteredMinutes,

    handleSelectRange,
    handleTimeSelect,
    handleEditStartTime,
    handleCancel,
    scrollStartHourUp,
    scrollStartHourDown,
    scrollStartMinuteUp,
    scrollStartMinuteDown,
    scrollEndHourUp,
    scrollEndHourDown,
    scrollEndMinuteUp,
    scrollEndMinuteDown,
    toggleStartPeriod,
    toggleEndPeriod,

    validationError,

    setManualStartInput,
    setManualEndInput,
    setShowTimePickerUI,
  } = useTimeRangePicker(
    value?.start || "",
    value?.end || "",
    onChange,
    name,
    setShowDropdown,
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setTouched(true);
        if (onBlur) {
          const syntheticEvent = {
            // target: {farge
            name: name,
            // value: {
            start: startTime,
            end: endTime,
            // },
            // },
          };
          onBlur(syntheticEvent);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur, name, startTime, endTime]);

  const handleInputFocus = () => {
    if (disabled) return;
    setShowDropdown(true);
  };

  const handleIconClick = () => {
    if (disabled) return;
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      setTouched(true);
    }
  };

  const displayValue =
    startTime && endTime
      ? `${formatTimeForDisplay(startTime)} - ${formatTimeForDisplay(endTime)}`
      : "";

  return (
    <div
      className={`form-group ${half ? "form-group-half" : ""} ${showError ? "has-error" : ""}`}
    >
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-with-icon">
        <div
          className="TimePicker timepicker"
          style={{ position: "relative", width }}
          ref={dropdownRef}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <CiClock2
              onClick={handleIconClick}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "12px",
                color: showError ? "#ff4d4f" : "#012047",
                cursor: disabled ? "not-allowed" : "pointer",
                zIndex: 2,
                opacity: disabled ? 0.5 : 1,
              }}
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              className={`form-control Select1 TimePickerMain ${showError ? "input-error" : ""}`}
              id={name}
              name={name}
              value={displayValue}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              // disabled={disabled}
              autoComplete="off"
              style={{
                border:
                  inputError || showError
                    ? "1px solid #ff4d4f"
                    : "",
              }}
              placeholder={placeholder}
            />
          </div>

          {showDropdown && !disabled && (
            <div className="time-dropdown-container">
              <div
                className="time-picker-dropdown list-date-option open"
                style={{
                  backgroundColor: "var(--badybkcolor)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
                  position: "absolute",
                  zIndex: 1000,
                  marginTop: "8px",
                  padding: "20px",
                  width: "100%",
                  minWidth: "250px",
                  right: 0,
                }}
              >
                <div>
                  <SegmentedProgress
                    segments={timeline}
                    mode="segmented"
                    height={26}
                    gap={3}
                    handleSelectRange={handleSelectRange}
                    activeRange={activeRange}
                    activeRangeValue={value}
                    lastActiveId={lastActiveId}
                    showinModal={showinModal}
                  />
                </div>

                {showTimePickerUI && selectedRange && (
                  <>
                    <div
                      style={{
                        marginTop: "16px",
                        marginBottom: "20px",
                        padding: "12px",
                        // backgroundColor: '#f0f9ff',
                        borderRadius: "8px",
                        // border: '1px solid #bae6fd'
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div>
                            Selected Time :
                            <b
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                // color: "#0369a1",
                                marginLeft: "4px",
                              }}
                            >
                              {" "}
                              {formatTimeForDisplay(value.start)} -{" "}
                              {formatTimeForDisplay(value.end)}
                            </b>
                          </div>
                          <div>
                            Available Range:
                            <b
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#0369a1",
                                marginLeft: "4px",
                              }}
                            >
                              {" "}
                              {selectedRange.display}
                            </b>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginTop: "4px",
                            }}
                          >
                            {startTime &&
                              `Start: ${formatTimeForDisplay(startTime)}`}
                            {endTime &&
                              ` | End: ${formatTimeForDisplay(endTime)}`}
                          </div>
                          {/* {validationError && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#ff4d4f",
                                marginTop: "4px",
                                fontWeight: 500,
                              }}
                            >
                              {validationError}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>

                    <TimeRangePickerUI
                      // Start time values
                      startHour={startHour}
                      startMinute={startMinute}
                      startPeriod={startPeriod}
                      // End time values
                      endHour={endHour}
                      endMinute={endMinute}
                      endPeriod={endPeriod}
                      // State
                      isSelectingStart={isSelectingStart}
                      isStartTimeSelected={isStartTimeSelected}
                      // Handlers
                      scrollStartHourUp={scrollStartHourUp}
                      scrollStartHourDown={scrollStartHourDown}
                      scrollStartMinuteUp={scrollStartMinuteUp}
                      scrollStartMinuteDown={scrollStartMinuteDown}
                      scrollEndHourUp={scrollEndHourUp}
                      scrollEndHourDown={scrollEndHourDown}
                      scrollEndMinuteUp={scrollEndMinuteUp}
                      scrollEndMinuteDown={scrollEndMinuteDown}
                      toggleStartPeriod={toggleStartPeriod}
                      toggleEndPeriod={toggleEndPeriod}
                      handleTimeSelect={handleTimeSelect}
                      handleEditStartTime={handleEditStartTime}
                      handleCancel={() => {
                        handleCancel();
                        setShowDropdown(false);
                      }}
                      // Data
                      getFilteredHours={getFilteredHours}
                      getFilteredMinutes={getFilteredMinutes}
                      validationError={validationError}
                    />
                  </>
                )}

                {!showTimePickerUI && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    <CiClock2
                      size={48}
                      style={{ marginBottom: "12px", opacity: 0.5 }}
                    />
                    <div style={{ fontWeight: "500", marginBottom: "8px" }}>
                      Select a time range from above
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      Click on an available time slot to begin selecting your
                      time range
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default TimeRangePicker;
