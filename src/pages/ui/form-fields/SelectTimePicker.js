import React, { useState, useEffect, useRef } from "react";
import { CiClock2 } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { formatTimeForDisplay, parseManualInput } from "../../shared/utils";
import "./SelectTimePicker.css";

const convert24To12 = (time24) => {
  const [hourStr, minute] = time24.split(":");
  const hour24 = parseInt(hourStr, 10);

  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    hour: hour12.toString().padStart(2, "0"),
    minute,
    period,
  };
};
const SelectTimePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Select time",
  icon,
  error,
  forceShowError = false,
  disabled = false,
  half = false,
  required = false,
  minTime,
  maxTime,
  width = "auto",
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);

  const [selectedTime, setSelectedTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState("");
  const [activePeriod, setActivePeriod] = useState("PM");
  const [selectedHour, setSelectedHour] = useState("04");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const dropdownRef = useRef();
  const inputRef = useRef();

  // Generate hours (1-12)
  const minutes = ["00", "15", "30", "45"];

  const generateAllowedHours = () => {
    if (!minTime || !maxTime) {
      return Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString().padStart(2, "0"),
      );
    }

    const startHour = parseInt(minTime.split(":")[0], 10);
    const endHour = parseInt(maxTime.split(":")[0], 10);

    const allowed = [];

    for (let h = startHour; h <= endHour; h++) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;

      allowed.push(hour12.toString().padStart(2, "0"));
    }

    return [...new Set(allowed)];
  };

  const hours = generateAllowedHours();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsEditing(false);
        setTouched(true);
        if (onBlur) {
          const syntheticEvent = {
            target: {
              name: name,
              value: selectedTime,
            },
          };
          onBlur(syntheticEvent);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur, name, selectedTime]);
  useEffect(() => {
  if (!minTime || !maxTime) return;

  const current = value || selectedTime;

  if (current && !isWithinRange(current)) {
    const parsed = convert24To12(minTime);

    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setActivePeriod(parsed.period);
    setSelectedTime(minTime);
    setManualInput(`${parsed.hour}:${parsed.minute} ${parsed.period}`);

    onChange?.({
      target: {
        name,
        value: minTime,
      },
    });
  }
  }, [minTime, maxTime, value]);

  // Initialize from value prop - FIXED VERSION
  useEffect(() => {
    if (value === "" || value == null) {
      if (minTime) {
        const parsed = convert24To12(minTime);

        setSelectedTime("");
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setActivePeriod(parsed.period);
        setManualInput("");
      } else {
        setSelectedTime("");
        setManualInput("");
        setSelectedHour("04");
        setSelectedMinute("00");
        setActivePeriod("PM");
      }

      return;
    }

    if (typeof value === "string" && value.includes(":")) {
      try {
        const parsed = convert24To12(value);

        setSelectedTime(value);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setActivePeriod(parsed.period);
        setManualInput(`${parsed.hour}:${parsed.minute} ${parsed.period}`);
        setInputError("");
      } catch {
        setSelectedTime("");
        setManualInput("");
      }
    }
  }, [value, minTime]);   

  useEffect(() => {
  if (!value || !minTime || !maxTime) return;

  if (!isWithinRange(value)) {
    onChange?.({
      target: {
        name,
        value: "",
      },
    });
  }
}, [value, minTime, maxTime, name]);
  const isWithinRange = (time24) => {
    if (!minTime && !maxTime) return true;

    if (minTime && time24 < minTime) return false;
    if (maxTime && time24 > maxTime) return false;

    return true;
  };
  const handleTimeSelect = () => {
    const hour24 =
      activePeriod === "PM"
        ? parseInt(selectedHour, 10) === 12
          ? 12
          : parseInt(selectedHour, 10) + 12
        : parseInt(selectedHour, 10) === 12
          ? 0
          : parseInt(selectedHour, 10);

    const timeValue = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;

    if (!isWithinRange(timeValue)) {
      setInputError(
        `Time must be between ${formatTimeForDisplay(minTime)} and ${formatTimeForDisplay(maxTime)}`,
      );
      return;
    }

    setSelectedTime(timeValue);
    setManualInput(`${selectedHour}:${selectedMinute} ${activePeriod}`);
    setShowDropdown(false);
    setIsEditing(false);
    setTouched(true);
    setInputError("");

    onChange?.({
      target: {
        name,
        value: timeValue,
      },
    });
  };

  const handleManualInputChange = (e) => {
  const value = e.target.value;

  setManualInput(value);

  if (value.trim() === "") {
    setSelectedTime("");
    setInputError("");

    onChange?.({
      target: {
        name,
        value: "",
      },
    });

    return;
  }

  const parsed = parseManualInput(value);

  if (!parsed) return;

  if (!isWithinRange(parsed.time24)) {
    setInputError(
      `Time must be between ${formatTimeForDisplay(minTime)} and ${formatTimeForDisplay(maxTime)}`
    );
    return;
  }

  setInputError("");

  setSelectedTime(parsed.time24);
  setSelectedHour(parsed.hour);
  setSelectedMinute(parsed.minute);
  setActivePeriod(parsed.period);

  onChange?.({
    target: {
      name,
      value: parsed.time24,
    },
  });
  };

  const handleManualInputBlur = (e) => {
    const value = e.target.value;

    if (value.trim()) {
      const parsed = parseManualInput(value);
      if (!parsed) {
        setInputError("Please use format: HH:MM AM/PM or HH:MM");
      } else {
        setInputError("");
        setSelectedTime(parsed.time24);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setActivePeriod(parsed.period);

        const syntheticEvent = {
          target: {
            name: name,
            value: parsed.time24,
          },
        };
        onChange?.(syntheticEvent);
      }
    }

    setTouched(true);
    if (onBlur) {
      const syntheticEvent = {
        target: {
          name: name,
          value: selectedTime,
        },
      };
      onBlur(syntheticEvent);
    }
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsEditing(true);
    setShowDropdown(true);
  };

  const handleIconClick = () => {
    if (disabled) return;
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setIsEditing(true);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleManualInputBlur(e);
      setShowDropdown(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setShowDropdown(false);
    setIsEditing(false);
  };

  // Scroll functions for hours
  const scrollHourUp = () => {
    const currentIndex = hours.indexOf(selectedHour);
    if (currentIndex <= 0) return;

    const newHour = hours[currentIndex - 1];
    setSelectedHour(newHour);
    updateTimeFromScroll(newHour, selectedMinute, activePeriod);
  };

  const scrollHourDown = () => {
    const currentIndex = hours.indexOf(selectedHour);
    if (currentIndex >= hours.length - 1) return;

    const newHour = hours[currentIndex + 1];
    setSelectedHour(newHour);
    updateTimeFromScroll(newHour, selectedMinute, activePeriod);
  };
  // Scroll functions for minutes
  const scrollMinuteUp = () => {
    const currentIndex = minutes.indexOf(selectedMinute);
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : minutes.length - 1;
    const newMinute = minutes[nextIndex];
    setSelectedMinute(newMinute);
    updateTimeFromScroll(selectedHour, newMinute, activePeriod);
  };

  const scrollMinuteDown = () => {
    const currentIndex = minutes.indexOf(selectedMinute);
    const nextIndex = currentIndex < minutes.length - 1 ? currentIndex + 1 : 0;
    const newMinute = minutes[nextIndex];
    setSelectedMinute(newMinute);
    updateTimeFromScroll(selectedHour, newMinute, activePeriod);
  };

  // Update time when scrolling
  const updateTimeFromScroll = (hour, minute, period) => {
    const hour24 =
      period === "PM"
        ? parseInt(hour, 10) === 12
          ? 12
          : parseInt(hour, 10) + 12
        : parseInt(hour, 10) === 12
          ? 0
          : parseInt(hour, 10);

    const timeValue = `${hour24.toString().padStart(2, "0")}:${minute}`;

    if (!isWithinRange(timeValue)) {
      return;
    }

    setSelectedTime(timeValue);
    setManualInput(`${hour}:${minute} ${period}`);

    onChange?.({
      target: {
        name,
        value: timeValue,
      },
    });
  };

  // Toggle AM/PM
  const togglePeriod = () => {
    const newPeriod = activePeriod === "AM" ? "PM" : "AM";
    setActivePeriod(newPeriod);
    updateTimeFromScroll(selectedHour, selectedMinute, newPeriod);
  };

  const displayValue = isEditing
    ? manualInput
    : formatTimeForDisplay(selectedTime);

  return (
    <div
      style={{padding:"10px"}}
      className={`time-picker-container ${half ? "form-group-half" : ""} ${showError ? "has-error" : ""}`}
    >
      {label && (
        <label htmlFor={name} className="time-picker-label">
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
              className={`clock-icon ${showError ? "icon-error" : ""} ${disabled ? "disabled" : ""}`}
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              className={`time-picker-input ${showError ? "input-error" : ""} ${disabled ? "disabled" : ""}`}
              id={name}
              name={name}
              value={displayValue}
              onChange={handleManualInputChange}
              onFocus={handleInputFocus}
              onBlur={handleManualInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoComplete="off"
              placeholder={placeholder}
            />
          </div>

          {showDropdown && !disabled && (
            <div className="time-dropdown-container">
              <div className="time-picker-dropdown list-date-option open">
                {/* Time Selector with Scroll */}
                <div className="time-selector-wrapper">
                  {/* Hours Scroll */}
                  <div className="time-selector-column">
                    <div className="selector-label">Hour</div>
                    <button
                      type="button"
                      onClick={scrollHourUp}
                      className="scroll-button"
                    >
                      <IoIosArrowUp />
                    </button>
                    <div className="selector-value">{selectedHour}</div>
                    <button
                      type="button"
                      onClick={scrollHourDown}
                      className="scroll-button"
                    >
                      <IoIosArrowDown />
                    </button>
                  </div>

                  {/* Colon */}
                  <div className="time-colon">:</div>

                  {/* Minutes Scroll */}
                  <div className="time-selector-column">
                    <div className="selector-label">Min</div>
                    <button
                      type="button"
                      onClick={scrollMinuteUp}
                      className="scroll-button"
                    >
                      <IoIosArrowUp />
                    </button>
                    <div className="selector-value">{selectedMinute}</div>
                    <button
                      type="button"
                      onClick={scrollMinuteDown}
                      className="scroll-button"
                    >
                      <IoIosArrowDown />
                    </button>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="time-selector-column">
                    <div className="selector-label">AM/PM</div>
                    <button
                      type="button"
                      onClick={togglePeriod}
                      className="period-button"
                    >
                      {activePeriod}
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="dropdown-footer">
                  <button
                    type="button"
                    className="simple-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="second-btn p-0"
                    onClick={handleTimeSelect}
                  >
                    Set Time
                  </button>
                </div>
                {inputError && (
                  <span className="range-error-text">{inputError}</span>
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

export default SelectTimePicker;
