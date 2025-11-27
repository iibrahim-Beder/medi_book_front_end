import React, { useState, useEffect, useRef } from 'react';
import { format, parse, isValid, startOfDay } from 'date-fns';
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

  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');
  const [month, setMonth] = useState(new Date()); // State for current month

  const dropdownRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    // Initialize dates from value prop
    if (value && isValid(new Date(value))) {
      const dateValue = startOfDay(new Date(value));
      setSelectedDate(dateValue);
      setTempDate(dateValue);
      setMonth(dateValue); // Set month to selected date
      setManualInput(format(dateValue, 'dd/MM/yyyy'));
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
          const syntheticEvent = {
            target: {
              name: name,
              value: selectedDate
            }
          };
          onBlur(syntheticEvent);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur, name, selectedDate]);

  const handleDateSelect = (date) => {
    if (date && isValid(date)) {
      const selected = startOfDay(date);
      setSelectedDate(selected);
      setTempDate(selected);
      setMonth(selected); // Update month to selected date
      setManualInput(format(selected, 'dd/MM/yyyy'));
      setShowDropdown(false);
      setIsEditing(false);
      setTouched(true);
      setInputError('');
      
      // Trigger onChange with event-like object to match Field component
      const syntheticEvent = {
        target: {
          name: name,
          value: selected
        }
      };
      onChange?.(syntheticEvent);
    }
  };

  const formatDate = () => {
    if (!selectedDate || !isValid(selectedDate)) return '';
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
    setInputError('');
  };

  const handleManualInputSubmit = () => {
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
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsEditing(true);
    setShowDropdown(true);
  };

  const handleInputBlur = (e) => {
    setTimeout(() => {
      if (!showDropdown) {
        setIsEditing(false);
        setTouched(true);
        if (onBlur) {
          const syntheticEvent = {
            target: {
              name: name,
              value: selectedDate
            }
          };
          onBlur(syntheticEvent);
        }
      }
    }, 200);
  };

  const handleIconClick = () => {
    if (disabled) return;
    
    if (isEditing) {
      handleManualInputSubmit();
    } else {
      setShowDropdown(!showDropdown);
      if (!showDropdown) {
        setIsEditing(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
        <div
          className="DateRangePicker datepicker"
          style={{ position: "relative", width }}
          ref={dropdownRef}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <CiCalendar
              onClick={handleIconClick}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: "8px",
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
              id={name}
              name={name}
              value={displayValue}
              onChange={handleManualInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoComplete="off"
              style={{
                padding: "10px 40px 10px 10px",
                width: "100%",
                borderRadius: "5px",
                border: inputError || showError ? "1px solid #ff4d4f" : "1px solid #E6E8EE",
                color: "#012047",
                fontSize: "14px",
                fontWeight: 500,
                boxSizing: "border-box",
                opacity: disabled ? 0.6 : 1
              }}
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
                {inputError || error}
              </div>
            )}
          </div>

          {showDropdown && !disabled && (
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
            </div>
          )}
        </div>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectDatePicker;