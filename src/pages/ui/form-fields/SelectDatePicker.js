import React, { useState, useEffect, useRef } from 'react';
import { format, parse, isValid } from 'date-fns';
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";

const SelectDatePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "DD/MM/YYYY",
  icon,
  error,
  forceShowError = false,
  disabled = false,
  half = false,
  required = false,
  width = 'auto'
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);

  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');
  const [month, setMonth] = useState(new Date());

  const dropdownRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
      setTempDate(null);
      setManualInput('');
      return;
    }

    const parsed = parse(
      value.split('T')[0],
      'yyyy-MM-dd',
      new Date()
    );

    if (!isValid(parsed)) return;

    setSelectedDate(parsed);
    setTempDate(parsed);
    setMonth(parsed);
    setManualInput(format(parsed, 'dd/MM/yyyy'));
  }, [value]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);

      onBlur?.({
        target: {
          name,
          value: selectedDate || null,
        },
      });
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () =>
    document.removeEventListener(
      'mousedown',
      handleClickOutside
    );
}, [name, onBlur, selectedDate]);

  const handleDateSelect = (date) => {
    if (date && isValid(date)) {
      const now = new Date();
      const selected = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );

      setSelectedDate(selected);
      setTempDate(date); 
      setMonth(date);
      setManualInput(format(selected, 'dd/MM/yyyy'));
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);
      setInputError('');

      onChange?.({
        target: {
          name,
         value: format(selected, "yyyy-MM-dd'T'HH:mm:ss") // 2025-11-27T10:22:05.7395677
        }
      });
    }
  };

  const formatDate = () => {
    if (!selectedDate || !isValid(selectedDate)) return '';
    return format(selectedDate, 'dd/MM/yyyy');
  };

  const handleManualInputChange = (e) => {
    const val = e.target.value.replace(/[^\d/]/g, '').slice(0, 10);
    setManualInput(val);
    setInputError('');
  };

  const handleManualInputSubmit = () => {
    if (manualInput.trim() === '') {
      setSelectedDate(null);
      setTempDate(null);
      setInputError('');
      onChange?.({ target: { name, value: null } });
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);
      return;
    }

    const match = manualInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) {
      setInputError('Please use format: DD/MM/YYYY');
      return;
    }

    const [, day, month, year] = match;
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());

    if (!isValid(parsed)) {
      setInputError('Invalid date');
      return;
    }

    const now = new Date();
    const finalDate = new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    setSelectedDate(finalDate);
    setTempDate(parsed);
    setMonth(parsed);
    setManualInput(format(finalDate, 'dd/MM/yyyy'));
    setShowDropdown(false);
    setIsEditing(false);
    setTouched(true);
    setInputError('');

    onChange?.({
      target: {
        name,
    value: format(finalDate, "yyyy-MM-dd'T'HH:mm:ss")      }
    });
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsEditing(true);
    setShowDropdown(true);
  };

const handleInputBlur = () => {
  setTimeout(() => {
    if (!showDropdown) {
      handleManualInputSubmit();
      setIsEditing(false);
      setTouched(true);
    }
  }, 200);
};

  const handleIconClick = () => {
    if (disabled) return;
    if (isEditing) {
      handleManualInputSubmit();
    } else {
      setShowDropdown(!showDropdown);
      if (!showDropdown) setIsEditing(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualInputSubmit();
    }
  };

  const displayValue = isEditing ? manualInput : formatDate();

  return (
    <div className={`form-group ${half ? "form-group-half" : ""} ${showError ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-with-icon">
        {/* {icon && (
          <span className={`input-icon ${showError ? "icon-error" : ""}`}>
            {icon}
          </span>
        )} */}
        <div className="DateRangePicker datepicker" style={{ position: "relative", width }} ref={dropdownRef}>
          <div style={{ position: "relative", width: "100%" }}>
            <CiCalendar
              onClick={handleIconClick}
              style={{
                position: "absolute",
                top: "50%",
                left: "8px",
                transform: "translateY(-50%)",
                color: "#012047",
                cursor: disabled ? "not-allowed" : "pointer",
                zIndex: 2,
                opacity: disabled ? 0.5 : 1
              }}
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              className={`form-control Select1 DateRangePickerMain ${showError ? "input-error" : ""}`}
              value={displayValue}
              onChange={handleManualInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              style={{
                padding: "10px 40px 10px 35px",
                width: "100%",
                borderRadius: "5px",
                border: inputError || showError ? "1px solid #ff4d4f" : "1px solid #E6E8EE",
                color: "#012047",
                fontSize: "14px",
                fontWeight: 500,
                boxSizing: "border-box",
                opacity: disabled ? 0.6 : 1
              }}
            />

            {/* {(inputError || showError) && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                color: "#ff4d4f",
                fontSize: "12px",
                marginTop: "4px",
              }}>
                {inputError || error}
              </div>
            )} */}
          </div>

          {showDropdown && !disabled && (
            <div style={{
              position: 'absolute',
              zIndex: 1000,
              marginTop: '4px',
              backgroundColor: "#fff",
              border: "1px solid #E6E8EE",
              borderRadius: "5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "8px"
            }}>
            <Calendar
              value={tempDate}
              onChange={handleDateSelect}
              activeStartDate={month}
              onActiveStartDateChange={({ activeStartDate }) =>
                setMonth(activeStartDate)
              }
            />
            </div>
          )}
        </div>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectDatePicker;