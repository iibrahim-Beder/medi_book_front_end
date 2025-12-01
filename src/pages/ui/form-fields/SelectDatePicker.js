import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { format, parse, isValid, startOfDay } from 'date-fns';
=======
import { format, parse, isValid } from 'date-fns';
>>>>>>> feature/api-integration
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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

<<<<<<< HEAD
  const [selectedDate, setSelectedDate] = useState(null);
=======
  const [selectedDate, setSelectedDate] = useState(null); // Date object كامل (مع الساعة)
>>>>>>> feature/api-integration
  const [tempDate, setTempDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');
<<<<<<< HEAD
  const [month, setMonth] = useState(new Date()); // State for current month
=======
  const [month, setMonth] = useState(new Date());
>>>>>>> feature/api-integration

  const dropdownRef = useRef();
  const inputRef = useRef();

<<<<<<< HEAD
  useEffect(() => {
    // Initialize dates from value prop
    if (value && isValid(new Date(value))) {
      const dateValue = startOfDay(new Date(value));
      setSelectedDate(dateValue);
      setTempDate(dateValue);
      setMonth(dateValue); // Set month to selected date
      setManualInput(format(dateValue, 'dd/MM/yyyy'));
=======
  // تحويل القيمة اللي جاية من الـ backend لـ Date object كامل
  useEffect(() => {
    if (value) {
      const date = new Date(value); // يدعم ISO string كامل
      if (isValid(date)) {
        setSelectedDate(date);
        setTempDate(date);
        setMonth(date);
        setManualInput(format(date, 'dd/MM/yyyy'));
      } else {
        setSelectedDate(null);
        setTempDate(null);
        setManualInput('');
      }
>>>>>>> feature/api-integration
    } else {
      setSelectedDate(null);
      setTempDate(null);
      setManualInput('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsEditing(false);
        setTouched(true);
        if (onBlur) {
<<<<<<< HEAD
          const syntheticEvent = {
            target: {
              name: name,
              value: selectedDate
            }
          };
          onBlur(syntheticEvent);
=======
          onBlur({
            target: {
              name,
              value: selectedDate ? selectedDate.toISOString().slice(0, -1) : null
            }
          });
>>>>>>> feature/api-integration
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur, name, selectedDate]);

  const handleDateSelect = (date) => {
    if (date && isValid(date)) {
<<<<<<< HEAD
      const selected = startOfDay(date);
      setSelectedDate(selected);
      setTempDate(selected);
      setMonth(selected); // Update month to selected date
=======
      // لا نستخدم startOfDay أبدًا → نحتفظ بالوقت الحالي
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
      setTempDate(date); // للـ DayPicker بس
      setMonth(date);
>>>>>>> feature/api-integration
      setManualInput(format(selected, 'dd/MM/yyyy'));
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);
      setInputError('');
<<<<<<< HEAD
      
      // Trigger onChange with event-like object to match Field component
      const syntheticEvent = {
        target: {
          name: name,
          value: selected
        }
      };
      onChange?.(syntheticEvent);
=======

      onChange?.({
        target: {
          name,
          value: selected.toISOString().slice(0, -1) // 2025-11-27T10:22:05.7395677
        }
      });
>>>>>>> feature/api-integration
    }
  };

  const formatDate = () => {
    if (!selectedDate || !isValid(selectedDate)) return '';
<<<<<<< HEAD
    try {
      return format(selectedDate, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleManualInputChange = (e) => {
    const value = e.target.value;
    setManualInput(value);
=======
    return format(selectedDate, 'dd/MM/yyyy');
  };

  const handleManualInputChange = (e) => {
    const val = e.target.value.replace(/[^\d/]/g, '').slice(0, 10);
    setManualInput(val);
>>>>>>> feature/api-integration
    setInputError('');
  };

  const handleManualInputSubmit = () => {
<<<<<<< HEAD
    // Handle empty input
    if (manualInput.trim() === '') {
      setSelectedDate(null);
      setTempDate(null);
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);
      setInputError('');
      
      const syntheticEvent = {
        target: {
          name: name,
          value: null
        }
      };
      onChange?.(syntheticEvent);
      return;
    }

    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = manualInput.match(datePattern);
    
    if (match) {
      const [, day, month, year] = match;
      
      // Validate day and month ranges
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      
      if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
        setInputError('Invalid date');
        return;
      }
      
      const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      
      if (isValid(parsedDate)) {
        const selected = startOfDay(parsedDate);
        setSelectedDate(selected);
        setTempDate(selected);
        setMonth(selected); // Update month to selected date
        setShowDropdown(false);
        setIsEditing(false);
        setTouched(true);
        setInputError('');
        
        // Trigger onChange with event-like object
        const syntheticEvent = {
          target: {
            name: name,
            value: selected
          }
        };
        onChange?.(syntheticEvent);
      } else {
        setInputError('Invalid date');
      }
    } else {
      setInputError('Please use format: DD/MM/YYYY');
    }
=======
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

    // نضيف الوقت الحالي عشان ما يتغيرش
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
        value: finalDate.toISOString().slice(0, -1)
      }
    });
>>>>>>> feature/api-integration
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsEditing(true);
    setShowDropdown(true);
  };

<<<<<<< HEAD
  const handleInputBlur = (e) => {
=======
  const handleInputBlur = () => {
>>>>>>> feature/api-integration
    setTimeout(() => {
      if (!showDropdown) {
        setIsEditing(false);
        setTouched(true);
<<<<<<< HEAD
        if (onBlur) {
          const syntheticEvent = {
            target: {
              name: name,
              value: selectedDate
            }
          };
          onBlur(syntheticEvent);
        }
=======
>>>>>>> feature/api-integration
      }
    }, 200);
  };

  const handleIconClick = () => {
    if (disabled) return;
<<<<<<< HEAD
    
=======
>>>>>>> feature/api-integration
    if (isEditing) {
      handleManualInputSubmit();
    } else {
      setShowDropdown(!showDropdown);
<<<<<<< HEAD
      if (!showDropdown) {
        setIsEditing(true);
      }
=======
      if (!showDropdown) setIsEditing(true);
>>>>>>> feature/api-integration
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
<<<<<<< HEAD
=======
      e.preventDefault();
>>>>>>> feature/api-integration
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
        {icon && (
          <span className={`input-icon ${showError ? "icon-error" : ""}`}>
            {icon}
          </span>
        )}
<<<<<<< HEAD
        <div
          className="DateRangePicker datepicker"
          style={{ position: "relative", width }}
          ref={dropdownRef}
        >
=======
        <div className="DateRangePicker datepicker" style={{ position: "relative", width }} ref={dropdownRef}>
>>>>>>> feature/api-integration
          <div style={{ position: "relative", width: "100%" }}>
            <CiCalendar
              onClick={handleIconClick}
              style={{
                position: "absolute",
                top: "50%",
<<<<<<< HEAD
                transform: "translateY(-50%)",
                left: "8px",
=======
                left: "8px",
                transform: "translateY(-50%)",
>>>>>>> feature/api-integration
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
<<<<<<< HEAD
              id={name}
              name={name}
=======
>>>>>>> feature/api-integration
              value={displayValue}
              onChange={handleManualInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
<<<<<<< HEAD
              autoComplete="off"
              style={{
                padding: "10px 40px 10px 10px",
=======
              placeholder={placeholder}
              style={{
                padding: "10px 40px 10px 35px",
>>>>>>> feature/api-integration
                width: "100%",
                borderRadius: "5px",
                border: inputError || showError ? "1px solid #ff4d4f" : "1px solid #E6E8EE",
                color: "#012047",
                fontSize: "14px",
                fontWeight: 500,
                boxSizing: "border-box",
                opacity: disabled ? 0.6 : 1
              }}
<<<<<<< HEAD
              placeholder={placeholder}
            />

            {(inputError || showError) && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  color: "#ff4d4f",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
=======
            />

            {(inputError || showError) && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                color: "#ff4d4f",
                fontSize: "12px",
                marginTop: "4px",
              }}>
>>>>>>> feature/api-integration
                {inputError || error}
              </div>
            )}
          </div>

          {showDropdown && !disabled && (
<<<<<<< HEAD
            <div className="">
              <div
                className='list-date-option open'
                style={{
                  padding: "8px",
                  backgroundColor: "#fff",
                  border: "1px solid #E6E8EE",
                  borderRadius: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  position: 'absolute',
                  zIndex: 1000,
                  marginTop: '4px'
                }}
              >
                <DayPicker
                  mode="single"
                  selected={tempDate}
                  onSelect={handleDateSelect}
                  month={month} // Control the displayed month
                  onMonthChange={setMonth} // Update month when user navigates
                  formatters={{
                    formatCaption: (month, options) => format(month, "MMM yyyy", { locale: options?.locale }),
                  }}
                  styles={{
                    caption: { 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    },
                    caption_label: { 
                      textTransform: "capitalize",
                      fontWeight: 'bold'
                    },
                    nav: {
                      display: 'flex',
                      gap: '0.5rem'
                    },
                    day: { 
                      cursor: "pointer",
                      borderRadius: "3px",
                      transition: 'all 0.2s ease'
                    },
                    selected: {
                      backgroundColor: "#3fabf3",
                      color: "white",
                      fontWeight: 'bold'
                    }
                  }}
                  components={{
                    IconLeft: ({ ...props }) => (
                      <button
                        {...props}
                        style={{
                          ...props.style,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          padding: '0.25rem'
                        }}
                      >
                        ‹
                      </button>
                    ),
                    IconRight: ({ ...props }) => (
                      <button
                        {...props}
                        style={{
                          ...props.style,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          padding: '0.25rem'
                        }}
                      >
                        ›
                      </button>
                    ),
                  }}
                />
              </div>
=======
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
              <DayPicker
                mode="single"
                selected={tempDate}
                onSelect={handleDateSelect}
                month={month}
                onMonthChange={setMonth}
                styles={{
                  caption: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
                  caption_label: { textTransform: "capitalize", fontWeight: 'bold' },
                  day: { cursor: "pointer", borderRadius: "3px" },
                  selected: { backgroundColor: "#3fabf3", color: "white", fontWeight: 'bold' }
                }}
              />
>>>>>>> feature/api-integration
            </div>
          )}
        </div>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectDatePicker;