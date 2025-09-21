import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  subDays, 
  startOfDay, 
  endOfDay,
  format 
} from 'date-fns';
import { CiCalendar } from "react-icons/ci";
import './new.css';

const DateRangePicker = ({ onChange, initialRange, width = "300px" }) => {
  const [startDate, setStartDate] = useState(
    initialRange?.start || startOfDay(subDays(new Date(), 6))
  );
  const [endDate, setEndDate] = useState(
    initialRange?.end || endOfDay(new Date())
  );
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
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
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setShowDropdown(false);
        return;
      default:
        start = null;
        end = null;
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedOption(option);
    setShowDropdown(false);
    setShowCustomRange(false);

    if (onChange) onChange({ start, end });
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setSelectedOption('custom');
      setShowCustomRange(false);

      if (onChange) onChange({ start: tempStartDate, end: tempEndDate });
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'اختار الفترة';
    return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
  };

  return (
    <div style={{ position: 'relative', width }} ref={dropdownRef}>
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          className="form-control Select1"
          value={formatDateRange()}
          readOnly
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ 
            padding: '10px 40px 10px 10px',
            cursor: 'pointer', 
            width: '100%', 
            borderRadius: '5px' 
          }}
        />
        <CiCalendar 
          style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none', 
            color: '#555' 
          }} 
          size={20} 
        />
      </div>

      {showDropdown && (
        <div style={{ 
          position: 'absolute', 
          top: '40px', 
          left: 0, 
          width: '100%', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          backgroundColor: '#fff',
          zIndex: 1000
        }}>
          {['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth', 'custom'].map(opt => (
            <div 
              key={opt} 
              onClick={() => handleQuickSelect(opt)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
            >
              {opt === 'today' && 'اليوم'}
              {opt === 'yesterday' && 'البارحة'}
              {opt === 'last7Days' && 'آخر 7 أيام'}
              {opt === 'last30Days' && 'آخر 30 يوم'}
              {opt === 'thisMonth' && 'هذا الشهر'}
              {opt === 'lastMonth' && 'الشهر السابق'}
              {opt === 'custom' && 'اختيار مخصص'}
            </div>
          ))}
        </div>
      )}

      {showCustomRange && (
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '15px', 
          borderRadius: '5px', 
          backgroundColor: '#f9f9f9',
          marginTop: '5px',
          position:"absolute"
        }}>
          <DatePicker
            selected={tempStartDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setTempStartDate(start);
              setTempEndDate(end);
            }}
            startDate={tempStartDate}
            endDate={tempEndDate}
            selectsRange
            monthsShown={2}
            inline
            dateFormat="dd/MM/yyyy"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              onClick={handleApplyCustomRange}
              disabled={!tempStartDate || !tempEndDate}
              style={{
                padding: '10px 20px',
                backgroundColor: (!tempStartDate || !tempEndDate) ? '#ccc' : '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: (!tempStartDate || !tempEndDate) ? 'not-allowed' : 'pointer'
              }}
            >
              تطبيق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
