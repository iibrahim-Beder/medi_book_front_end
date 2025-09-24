import React, { useState, useEffect, useRef } from 'react';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CiCalendar } from "react-icons/ci";
import './DateRangePicker.css';

const DateRangePicker = ({ onChange, initialRange, width = 'auto' }) => {
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

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowCustomRange(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    onChange?.({ start, end });
  };

  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to) {
      const start = startOfDay(tempRange.from);
      const end = endOfDay(tempRange.to);
      setStartDate(start);
      setEndDate(end);
      setSelectedOption('custom');
      setShowDropdown(false);
      setShowCustomRange(false);
      onChange?.({ start, end });
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select date range';
    return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
  };

  return (
    <div className="DateRangePicker" style={{ position: "relative", width }} ref={dropdownRef}>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          className="form-control Select1 DateRangePickerMain"
          value={formatDateRange()}
          readOnly
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            padding: "10px 40px 10px 10px",
            cursor: "pointer",
            width: "230px",
            borderRadius: "5px",
            height: "32px",
            border: "1px solid #E6E8EE",
            minHeight: "32px",
            color: "#012047",
            fontSize: "14px",
            fontWeight: 500,
            backgroundColor: "#fff",
            boxSizing: "border-box",
            // fontFamily: "open sans",
          }}
        />
        <CiCalendar
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            left: "8px",
            color: "#012047",
          }}
          size={20}
        />
      </div>

      {showDropdown && (
        <div
          className={`list-date-option ${showCustomRange ? "" : "open"}`}
          style={{
            marginTop: "8px",
            zIndex: 1,
            borderRadius: "4px",
            left: showCustomRange ? "-203%" : "",
            position: "absolute",
            display: "flex",
            background: "#fff",
            flexDirection: "column",
            padding: "4px",
            border: "1px solid #ddd",
          }}
        >
          <div style={{ display: "flex" }}>
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

            {showCustomRange && (
              <div style={{ padding: '8px' }}>
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={tempRange}
                  onSelect={setTempRange}
                  formatters={{
                    formatCaption: (month) => format(month, 'MMM yyyy'), // short month name
                  }}
                  styles={{
                    caption_label: { textTransform: 'capitalize' },
                  }}
                />
              </div>
            )}
          </div>

         {showCustomRange && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      paddingTop: "10px",
      borderTop: "1px solid #ddd",
      alignItems: "center",
    }}
  >
    <p className="mb-0">{formatDateRange()}</p>
    <button className="mr-3 ml-5" type="button">
      Cancel
    </button>
    <button
      onClick={handleApplyCustomRange}
      disabled={!tempRange?.from || !tempRange?.to}
      style={{
        padding: "7px 15px",
        backgroundColor: "#3fabf3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: !tempRange?.from || !tempRange?.to ? "not-allowed" : "pointer",
      }}
    >
      Apply
    </button>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
