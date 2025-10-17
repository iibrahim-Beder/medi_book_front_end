import React, { useState, useEffect, useRef } from 'react';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, parse, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CiCalendar } from "react-icons/ci";
import './DateRangePicker.css';

const DateRangePicker = ({ onChange, initialRange, width = 'auto' }) => {
  // State for main date range and UI control
  const [startDate, setStartDate] = useState(
    initialRange?.start || startOfDay(subDays(new Date(), 6))
  );
  const [endDate, setEndDate] = useState(
    initialRange?.end || endOfDay(new Date())
  );
  const [tempRange, setTempRange] = useState({ from: startDate, to: endDate });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedOption, setSelectedOption] = useState('last7Days');
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');

  const dropdownRef = useRef();
  const inputRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowCustomRange(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update manual input when date range changes (only if not manually editing)
  useEffect(() => {
    if (!isEditing) {
      setManualInput(formatDateRange());
    }
  }, [startDate, endDate, isEditing]);

  // Handle quick date selections (Today, Last 7 days, etc.)
  const handleQuickSelect = (option) => {
    const today = new Date();
    let start, end;

    switch (option) {
      case 'today':
        start = startOfDay(today);
        end = endOfDay(today);
        break;
      case 'yesterday':
        start = startOfDay(subDays(today, 1));
        end = endOfDay(subDays(today, 1));
        break;
      case 'last7Days':
        start = startOfDay(subDays(today, 6));
        end = endOfDay(today);
        break;
      case 'last30Days':
        start = startOfDay(subDays(today, 29));
        end = endOfDay(today);
        break;
      case 'thisMonth':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'lastMonth':
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      case 'custom':
        setShowCustomRange(true);
        setTempRange({ from: startDate, to: endDate });
        return;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedOption(option);
    setShowDropdown(false);
    setShowCustomRange(false);
    setIsEditing(false);
    onChange?.({ start, end });
  };

  // Apply custom range selected from calendar
  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to) {
      const start = startOfDay(tempRange.from);
      const end = endOfDay(tempRange.to);
      setStartDate(start);
      setEndDate(end);
      setSelectedOption('custom');
      setShowDropdown(false);
      setShowCustomRange(false);
      setIsEditing(false);
      onChange?.({ start, end });
    }
  };

  // Format date range text for input display
  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select date range';
    return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
  };

  // Handle typing inside manual date input
  const handleManualInputChange = (e) => {
    const value = e.target.value;
    setManualInput(value);
    setInputError('');
  };

  // Parse manually typed date range and validate
  const handleManualInputSubmit = () => {
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = manualInput.match(datePattern);
    
    if (match) {
      const [, startDay, startMonth, startYear, endDay, endMonth, endYear] = match;
      
      const startDateStr = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
      const endDateStr = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;
      
      const parsedStart = parse(startDateStr, 'yyyy-MM-dd', new Date());
      const parsedEnd = parse(endDateStr, 'yyyy-MM-dd', new Date());
      
      // Check for valid date range before applying
      if (isValid(parsedStart) && isValid(parsedEnd) && parsedStart <= parsedEnd) {
        setStartDate(startOfDay(parsedStart));
        setEndDate(endOfDay(parsedEnd));
        setSelectedOption('custom');
        setShowDropdown(false);
        setIsEditing(false);
        onChange?.({ start: startOfDay(parsedStart), end: endOfDay(parsedEnd) });
      } else {
        setInputError('Invalid date range');
      }
    } else {
      setInputError('Please use format: DD/MM/YYYY - DD/MM/YYYY');
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  // Delay blur to allow button clicks before losing focus
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsEditing(false);
    }, 200);
  };

  // Toggle dropdown or submit manual input
  const handleIconClick = () => {
    if (isEditing) {
      handleManualInputSubmit();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className="DateRangePicker" style={{ position: "relative", width }} ref={dropdownRef}>
      <div style={{ position: "relative", width: "100%" }}>
        <CiCalendar
          onClick={handleIconClick}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "8px",
            color: "#012047",
            cursor: "pointer",
            zIndex: 10,
          }}
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          className="form-control Select1 DateRangePickerMain"
          value={isEditing ? manualInput : formatDateRange()}
          onChange={handleManualInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleManualInputSubmit();
            }
          }}
          style={{
            padding: "10px 40px 10px 10px",
            width: "230px",
            borderRadius: "5px",
            height: "32px",
            border: inputError ? "1px solid #ff4d4f" : "1px solid #E6E8EE",
            minHeight: "32px",
            color: "#012047",
            fontSize: "14px",
            fontWeight: 500,
            boxSizing: "border-box",
          }}
        />
     
        {inputError && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            color: "#ff4d4f",
            fontSize: "12px",
            marginTop: "4px"
          }}>
            {inputError}
          </div>
        )}
      </div>

      {/* Dropdown for quick options and custom date range picker */}
      {showDropdown && (
        <div
          className={`list-date-option ${showCustomRange ? "custom" : "open"}`}
        >
          <div className="list-date-option-and-custom" style={{ display: "flex" }}>
            <div
              className="dropdown-date-options"
              style={{
                borderRight: showCustomRange ? "1px solid #ddd" : "none",
                paddingTop: "8px",
                minWidth: "150px",
                maxWidth: "150px",
                paddingRight: showCustomRange ? "2px" : "",
              }}
            >
              {[
                { key: "today", label: "Today" },
                { key: "yesterday", label: "Yesterday" },
                { key: "last7Days", label: "Last 7 Days" },
                { key: "last30Days", label: "Last 30 Days" },
                { key: "thisMonth", label: "This Month" },
                { key: "lastMonth", label: "Last Month" },
                { key: "custom", label: "Custom Range" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => handleQuickSelect(key)}
                  style={{
                    margin: "0 2px",
                    backgroundColor: selectedOption === key ? '#3fabf3' : '',
                    color: selectedOption === key ? '#fff' : '',
                    padding: "4px 12px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Custom date range calendar */}
            {showCustomRange && (
              <div style={{ padding: '8px', margin: '2px', backgroundColor:"#fff" }}>
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={tempRange}
                  onSelect={setTempRange}
                  formatters={{
                    formatCaption: (month) => format(month, 'MMM yyyy'),
                  }}
                  styles={{
                    caption_label: { textTransform: 'capitalize' },
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer buttons for custom range */}
          {showCustomRange && (
            <div
              className='date-range-footer'
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding:"3px",
                paddingTop: "10px",
                borderTop: "1px solid #ddd",
                alignItems: "center",
              }}
            >
              <p className="mb-0">{formatDateRange()}</p>
              <div>  
                <button 
                  className="mr-3 ml-5 simple-btn btn" 
                  type="button"
                  onClick={() => {
                    setShowCustomRange(false);
                    setShowDropdown(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomRange}
                  className='second-btn'
                  disabled={!tempRange?.from || !tempRange?.to}
                  style={{ cursor: !tempRange?.from || !tempRange?.to ? "not-allowed" : "pointer" }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;