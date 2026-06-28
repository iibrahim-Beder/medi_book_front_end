import React, { useState, useEffect, useRef } from 'react';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, parse, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CiCalendar } from "react-icons/ci";
import { t } from 'i18next';

const DateRangePicker = ({ onChange, initialRange, width = 'auto', className }) => {
  const [startDate, setStartDate] = useState(initialRange?.start ?? null);
  const [endDate, setEndDate] = useState(initialRange?.end ?? null);

  const [tempRange, setTempRange] = useState({
    from: initialRange?.start ?? undefined,
    to: initialRange?.end ?? undefined,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputError, setInputError] = useState('');

  const dropdownRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowCustomRange(false);
        if (isInputFocused) {
          revertInput();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isInputFocused]);

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(formatDateRange(startDate, endDate));
    }
  }, [startDate, endDate, isInputFocused]);

  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  };

  const applyRange = (start, end, option = 'custom') => {
    setStartDate(start);
    setEndDate(end);
    setSelectedOption(option);
    setShowDropdown(false);
    setShowCustomRange(false);
    setIsInputFocused(false);
    setInputError('');
    onChange?.({ start, end });
  };

  const revertInput = () => {
    setIsInputFocused(false);
    setInputError('');
    setInputValue(formatDateRange(startDate, endDate));
  };

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

    applyRange(start, end, option);
  };

  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to) {
      const start = startOfDay(tempRange.from);
      const end = endOfDay(tempRange.to);
      applyRange(start, end, 'custom');
    }
  };

  // تحليل الإدخال النصي وتطبيقه
  const handleManualSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setStartDate(null);
      setEndDate(null);
      setSelectedOption('custom');
      setShowDropdown(false);
      setIsInputFocused(false);
      setInputError('');
      onChange?.({ start: null, end: null });
      setInputValue('');
      return;
    }

    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = trimmed.match(datePattern);

    if (match) {
      const [, startDay, startMonth, startYear, endDay, endMonth, endYear] = match;
      const startDateStr = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
      const endDateStr = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

      const parsedStart = parse(startDateStr, 'yyyy-MM-dd', new Date());
      const parsedEnd = parse(endDateStr, 'yyyy-MM-dd', new Date());

      if (isValid(parsedStart) && isValid(parsedEnd) && parsedStart <= parsedEnd) {
        const start = startOfDay(parsedStart);
        const end = endOfDay(parsedEnd);
        applyRange(start, end, 'custom');
        return;
      }
    }
    setInputError(t('Invalid date range. Please use DD/MM/YYYY - DD/MM/YYYY'));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (inputError) setInputError('');
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setInputValue(formatDateRange(startDate, endDate));
    setInputError('');
    setShowDropdown(true);
  };

  const handleInputBlur = (e) => {
    const relatedTarget = e.relatedTarget;
    if (dropdownRef.current && dropdownRef.current.contains(relatedTarget)) {
      return;
    }
    if (inputError) {
      revertInput();
    } else {
      setIsInputFocused(false);
      setInputValue(formatDateRange(startDate, endDate));
      setInputError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSubmit();
    }
  };

  const handleIconClick = () => {
    if (isInputFocused) {
      handleManualSubmit();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div
      className={`DateRangePicker ${className}`}
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
            cursor: "pointer",
            zIndex: 2,
          }}
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          className="form-control Select1 DateRangePickerMain"
          value={inputValue}
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          style={{
            padding: "10px",
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
            {inputError}
          </div>
        )}
      </div>

      {/* القائمة المنسدلة */}
      {showDropdown && (
        <div className={`list-date-option ${showCustomRange ? "custom" : "open"}`}>
          <div className="list-date-option-and-custom" style={{ display: "flex" }}>
            <div
              className="dropdown-date-options"
              style={{
                borderRight: showCustomRange ? "" : "none",
                borderLeft: showCustomRange ? "" : "none",
                paddingRight: showCustomRange ? "2px" : "none",
              }}
            >
              {[
                { key: "today", label: t("Today") },
                { key: "yesterday", label: t("Yesterday") },
                { key: "last7Days", label: t("Last 7 Days") },
                { key: "last30Days", label: t("Last 30 Days") },
                { key: "thisMonth", label: t("This Month") },
                { key: "lastMonth", label: t("Last Month") },
                { key: "custom", label: t("Custom Range") },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => handleQuickSelect(key)}
                  style={{
                    margin: "0 2px",
                    backgroundColor: selectedOption === key ? "#3fabf3" : "",
                    color: selectedOption === key ? "#fff" : "var(--terthemecolor)",
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
              <div style={{ padding: "8px", margin: "2px", backgroundColor: "#fff" }}>
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={tempRange}
                  onSelect={setTempRange}
                  formatters={{
                    formatCaption: (month) => format(month, "MMM yyyy"),
                  }}
                  styles={{
                    caption_label: { textTransform: "capitalize" },
                  }}
                />
              </div>
            )}
          </div>

          {showCustomRange && (
            <div
              className="date-range-footer"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "3px",
                paddingTop: "10px",
                borderTop: "1px solid #ddd",
                alignItems: "center",
              }}
            >
              <p className="mb-0">{formatDateRange(startDate, endDate)}</p>
              <div style={{ display: "flex" }}>
                <button
                  className="mr-3 ml-5 simple-btn btn"
                  type="button"
                  onClick={() => {
                    setShowCustomRange(false);
                    setShowDropdown(false);
                    revertInput();
                  }}
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleApplyCustomRange}
                  className="second-btn"
                  disabled={!tempRange?.from || !tempRange?.to}
                  style={{
                    cursor: !tempRange?.from || !tempRange?.to ? "not-allowed" : "pointer",
                  }}
                >
                  {t("Apply")}
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