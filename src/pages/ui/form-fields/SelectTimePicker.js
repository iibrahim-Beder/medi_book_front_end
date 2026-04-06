import React, { useState, useEffect, useRef } from 'react';
import { CiClock2 } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {formatTimeForDisplay,parseManualInput} from '../../shared/utils';
// import './TimePicker.css';

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
  width = 'auto'
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);

  const [selectedTime, setSelectedTime] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');
  const [activePeriod, setActivePeriod] = useState('PM');
  const [selectedHour, setSelectedHour] = useState('04');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const dropdownRef = useRef();
  const inputRef = useRef();

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );

  // Generate minutes (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

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
              value: selectedTime
            }
          };
          onBlur(syntheticEvent);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur, name, selectedTime]);

  // Initialize from value prop - FIXED VERSION
  useEffect(() => {
    const initializeFromValue = () => {
      // If no value or empty value, set defaults
      if (!value && value !== '') {
        setSelectedTime('');
        setManualInput('');
        setSelectedHour('04');
        setSelectedMinute('00');
        setActivePeriod('PM');
        return;
      }

      // If value is empty string
      if (value === '') {
        setSelectedTime('');
        setManualInput('');
        setSelectedHour('04');
        setSelectedMinute('00');
        setActivePeriod('PM');
        return;
      }

      // If value is a string and contains time
      if (typeof value === 'string' && value.includes(':')) {
        try {
          const [hoursPart, minutesPart] = value.split(':');
          const hourNum = parseInt(hoursPart, 10);
          
          if (!isNaN(hourNum)) {
            setSelectedTime(value);
            const displayHour = hourNum > 12 ? (hourNum - 12).toString().padStart(2, '0') : hoursPart.padStart(2, '0');
            const displayMinute = minutesPart || '00';
            const displayPeriod = hourNum >= 12 ? 'PM' : 'AM';
            
            setSelectedHour(displayHour);
            setSelectedMinute(displayMinute);
            setActivePeriod(displayPeriod);
            setManualInput(`${displayHour}:${displayMinute} ${displayPeriod}`);
          }
        } catch (error) {
          console.error('Error parsing time value:', error);
          // Set defaults if parsing fails
          setSelectedTime('');
          setManualInput('');
          setSelectedHour('04');
          setSelectedMinute('00');
          setActivePeriod('PM');
        }
      } else {
        // Set defaults for invalid values
        setSelectedTime('');
        setManualInput('');
        setSelectedHour('04');
        setSelectedMinute('00');
        setActivePeriod('PM');
      }
    };

    initializeFromValue();
  }, [value]);

  const handleTimeSelect = () => {
    const hour24 = activePeriod === 'PM' 
      ? (parseInt(selectedHour, 10) === 12 ? 12 : parseInt(selectedHour, 10) + 12)
      : (parseInt(selectedHour, 10) === 12 ? 0 : parseInt(selectedHour, 10));
    
    const timeValue = `${hour24.toString().padStart(2, '0')}:${selectedMinute}`;
    
    setSelectedTime(timeValue);
    setManualInput(`${selectedHour}:${selectedMinute} ${activePeriod}`);
    setShowDropdown(false);
    setIsEditing(false);
    setTouched(true);
    setInputError('');
    
    const syntheticEvent = {
      target: {
        name: name,
        value: timeValue
      }
    };
    onChange?.(syntheticEvent);
  };

  const handleManualInputChange = (e) => {
    const value = e.target.value;
    setManualInput(value);
    setInputError('');

    // Auto-parse and update if valid
    const parsed = parseManualInput(value);
    if (parsed) {
      setSelectedTime(parsed.time24);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setActivePeriod(parsed.period);
      
      const syntheticEvent = {
        target: {
          name: name,
          value: parsed.time24
        }
      };
      onChange?.(syntheticEvent);
    }
  };

  const handleManualInputBlur = (e) => {
    const value = e.target.value;
    
    if (value.trim()) {
      const parsed = parseManualInput(value);
      if (!parsed) {
        setInputError('Please use format: HH:MM AM/PM or HH:MM');
      } else {
        setInputError('');
        setSelectedTime(parsed.time24);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setActivePeriod(parsed.period);
        
        const syntheticEvent = {
          target: {
            name: name,
            value: parsed.time24
          }
        };
        onChange?.(syntheticEvent);
      }
    }
    
    setTouched(true);
    if (onBlur) {
      const syntheticEvent = {
        target: {
          name: name,
          value: selectedTime
        }
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
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : hours.length - 1;
    const newHour = hours[nextIndex];
    setSelectedHour(newHour);
    updateTimeFromScroll(newHour, selectedMinute, activePeriod);
  };

  const scrollHourDown = () => {
    const currentIndex = hours.indexOf(selectedHour);
    const nextIndex = currentIndex < hours.length - 1 ? currentIndex + 1 : 0;
    const newHour = hours[nextIndex];
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
    const hour24 = period === 'PM' 
      ? (parseInt(hour, 10) === 12 ? 12 : parseInt(hour, 10) + 12)
      : (parseInt(hour, 10) === 12 ? 0 : parseInt(hour, 10));
    
    const timeValue = `${hour24.toString().padStart(2, '0')}:${minute}`;
    
    setSelectedTime(timeValue);
    setManualInput(`${hour}:${minute} ${period}`);
    
    const syntheticEvent = {
      target: {
        name: name,
        value: timeValue
      }
    };
    onChange?.(syntheticEvent);
  };

  // Toggle AM/PM
  const togglePeriod = () => {
    const newPeriod = activePeriod === 'AM' ? 'PM' : 'AM';
    setActivePeriod(newPeriod);
    updateTimeFromScroll(selectedHour, selectedMinute, newPeriod);
  };

  const displayValue = isEditing ? manualInput : formatTimeForDisplay(selectedTime);

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
                zIndex: 1,
                opacity: disabled ? 0.5 : 1
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
              onChange={handleManualInputChange}
              onFocus={handleInputFocus}
              onBlur={handleManualInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoComplete="off"
              style={{
                padding: "10px 40px 10px 16px",
                width: "100%",
                borderRadius: "8px",
                border: inputError || showError ? "1px solid #ff4d4f" : "1px solid #d0d5dd",
                // color: "#012047",
                fontSize: "14px",
                fontWeight: "500",
                boxSizing: "border-box",
                opacity: disabled ? 0.6 : 1,
                backgroundColor: disabled ? "#f8f9fa" : "",
                transition: "all 0.2s ease",
                height: "40px"
              }}
              placeholder={placeholder}
            />
          </div>

          {showDropdown && !disabled && (
            <div className="time-dropdown-container">
              <div
                className='time-picker-dropdown list-date-option open'
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
                  position: 'absolute',
                  zIndex: 1000,
                  marginTop: '8px',
                  // width: '300px',
                  padding: '10px',
                  // overflow: 'hidden'
                }}
              >

                {/* Time Selector with Scroll */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Hours Scroll */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Hour
                    </div>
                    <button type="button" onClick={scrollHourUp}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#f8fafc',
                        color: '#012047',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      <IoIosArrowUp />
                    </button>
                    <div style={{
                      width: '60px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#012047',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      margin: '4px 0'
                    }}>
                      {selectedHour}
                    </div>
                    <button
                    type="button" 
                      onClick={scrollHourDown}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#f8fafc',
                        color: '#012047',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      <IoIosArrowDown />
                    </button>
                  </div>

                  {/* Colon */}
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#012047',
                    marginTop: '25px'
                  }}>
                    :
                  </div>

                  {/* Minutes Scroll */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Min
                    </div>
                    <button
                    type="button" 
                      onClick={scrollMinuteUp}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#f8fafc',
                        color: '#012047',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      <IoIosArrowUp />
                    </button>
                    <div style={{
                      width: '60px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#012047',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      margin: '4px 0'
                    }}>
                      {selectedMinute}
                    </div>
                    <button
                    type="button" 
                      onClick={scrollMinuteDown}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#f8fafc',
                        color: '#012047',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      <IoIosArrowDown />
                    </button>
                  </div>

                  {/* AM/PM Toggle */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      AM/PM
                    </div>
                    <button
                    type="button" 
                      onClick={togglePeriod}
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'var(--bluecolor)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        // margin: '29px 0'
                      }}
                    >
                      {activePeriod}
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button type="button"  className='simple-btn'onClick={handleCancel}>
                    Cancel
                  </button>
                  <button  type="button" className='second-btn p-0'onClick={handleTimeSelect}>
                    Set Time
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* {(inputError || showError) && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                color: "#ff4d4f",
                fontSize: "12px",
                marginTop: "4px",
                fontWeight: 500
              }}
            >
              {inputError || error}
            </div>
          )} */}
        </div>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectTimePicker;