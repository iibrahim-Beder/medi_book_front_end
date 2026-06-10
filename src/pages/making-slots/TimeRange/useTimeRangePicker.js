// useTimeRangePicker.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toDecimal } from '../helper/helper';

export const useTimeRangePicker = (initialStartTime = '', initialEndTime = '', onChange, name,setShowDropdown) => {
  // State for both times
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Manual inputs
  const [manualStartInput, setManualStartInput] = useState('');
  const [manualEndInput, setManualEndInput] = useState('');
  
  // Active periods
  const [startPeriod, setStartPeriod] = useState('PM');
  const [endPeriod, setEndPeriod] = useState('PM');
  
  // Selected hours and minutes
  const [startHour, setStartHour] = useState('04');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('05');
  const [endMinute, setEndMinute] = useState('00');
  
  // Range and UI states
  const [selectedRange, setSelectedRange] = useState(null);
  const [showTimePickerUI, setShowTimePickerUI] = useState(false);
  const [activeRange, setActiveRange] = useState(-1);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [isStartTimeSelected, setIsStartTimeSelected] = useState(false);

  const [validationError, setValidationError] = useState("");

  const hours = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );
  
  const minutes = ['00', '15', '30', '45'];

  // Filter hours based on range and whether we're selecting start or end
  const getFilteredHours = useCallback((isStart) => {
    if (!selectedRange) return hours;
    
    const rangeStart = selectedRange.start;
    const rangeEnd = selectedRange.end;
    const currentPeriod = isStart ? startPeriod : endPeriod;
    
    if (isStart) {
      // For start time: show all hours in range
      return hours.filter(hour => {
        const hourNum = parseInt(hour, 10);
        const hour24 = currentPeriod === 'PM' 
          ? (hourNum === 12 ? 12 : hourNum + 12)
          : (hourNum === 12 ? 0 : hourNum);
        
        return hour24 >= Math.floor(rangeStart) && hour24 < Math.ceil(rangeEnd);
      });
    } else {
      // For end time: show only hours after start time within range
      if (!startTime) return [];
      
      const startHour24 = startPeriod === 'PM' 
        ? (parseInt(startHour, 10) === 12 ? 12 : parseInt(startHour, 10) + 12)
        : (parseInt(startHour, 10) === 12 ? 0 : parseInt(startHour, 10));
      
      return hours.filter(hour => {
        const hourNum = parseInt(hour, 10);
        const hour24 = currentPeriod === 'PM' 
          ? (hourNum === 12 ? 12 : hourNum + 12)
          : (hourNum === 12 ? 0 : hourNum);
        
        // If start and end are in different periods, adjust logic
        if (startPeriod !== currentPeriod) {
          if (startPeriod === 'AM' && currentPeriod === 'PM') {
            // Start in AM, end in PM - all PM hours are valid
            return hour24 >= Math.max(12, Math.floor(rangeStart)) && hour24 <= Math.floor(rangeEnd);
          } else {
            // Start in PM, end in AM (next day) - only AM hours
            return hour24 >= Math.floor(rangeStart) && hour24 <= Math.min(12, Math.floor(rangeEnd));
          }
        }
        
        // Same period: end time must be after start time
        return hour24 >= startHour24 && hour24 <= Math.floor(rangeEnd);;
      });
    }
  }, [selectedRange, startTime, startHour, startPeriod, hours]);

  // Filter minutes based on hour and whether we're selecting start or end
  const getFilteredMinutes = useCallback((isStart, hour) => {
    if (!selectedRange) return minutes;
    
    const rangeStart = selectedRange.start;
    const rangeEnd = selectedRange.end;
    const currentPeriod = isStart ? startPeriod : endPeriod;
    const hourNum = parseInt(hour, 10);
    
    const hour24 = currentPeriod === 'PM' 
      ? (hourNum === 12 ? 12 : hourNum + 12)
      : (hourNum === 12 ? 0 : hourNum);
    
    return minutes.filter(minute => {
      const minuteNum = parseInt(minute, 10);
      const timeValue = hour24 + (minuteNum / 60);
      
      if (isStart) {
        // For start time: any time in range
        return timeValue >= rangeStart && timeValue < rangeEnd;
      } else {
        // For end time: must be after start time
        if (!startTime) return false;
        
        const startHour24 = startPeriod === 'PM' 
          ? (parseInt(startHour, 10) === 12 ? 12 : parseInt(startHour, 10) + 12)
          : (parseInt(startHour, 10) === 12 ? 0 : parseInt(startHour, 10));
        
        const startTimeValue = startHour24 + (parseInt(startMinute, 10) / 60);
        
        return timeValue > startTimeValue && timeValue <= rangeEnd;
      }
    });
  }, [selectedRange, startTime, startHour, startMinute, startPeriod, minutes]);

  // Initialize from props
  useEffect(() => {
    const initializeFromValue = () => {
      if (initialStartTime) {
        setStartTime(initialStartTime);
        const [hour, minute] = initialStartTime.split(':');
        const hourNum = parseInt(hour, 10);
        setStartHour(hourNum > 12 ? (hourNum - 12).toString().padStart(2, '0') : hour);
        setStartMinute(minute || '00');
        setStartPeriod(hourNum >= 12 ? 'PM' : 'AM');
        setIsStartTimeSelected(true);
      }
      
      if (initialEndTime) {
        setEndTime(initialEndTime);
        const [hour, minute] = initialEndTime.split(':');
        const hourNum = parseInt(hour, 10);
        setEndHour(hourNum > 12 ? (hourNum - 12).toString().padStart(2, '0') : hour);
        setEndMinute(minute || '00');
        setEndPeriod(hourNum >= 12 ? 'PM' : 'AM');
      }
    };
    
    initializeFromValue();
  }, [initialStartTime, initialEndTime]);
  
  // Set default minutes
  useEffect(() => {
    if (!selectedRange) return;

    const validMinutes = getFilteredMinutes(true, startHour);

    if (
      validMinutes.length > 0 &&
      !validMinutes.includes(startMinute)
    ) {
      setStartMinute(validMinutes[0]);
    }
  }, [
    startHour,
    startPeriod,
    selectedRange,
    startMinute,
    getFilteredMinutes,
  ]);

  useEffect(() => {
    if (!selectedRange || isSelectingStart) return;

    const validMinutes = getFilteredMinutes(false, endHour);

    if (
      validMinutes.length > 0 &&
      !validMinutes.includes(endMinute)
    ) {
      setEndMinute(validMinutes[0]);
    }
  }, [
    endHour,
    endPeriod,
    selectedRange,
    endMinute,
    isSelectingStart,
    getFilteredMinutes,
  ]);

  // Handle range selection
  const handleSelectRange = useCallback((range) => {
    if (!range || range.type !== 'free') return;
    
    setActiveRange(range.id);
    setSelectedRange(range);
    setShowTimePickerUI(true);
    setIsSelectingStart(true);
    setIsStartTimeSelected(false);
    
    // Reset to start of range
    const startHour24 = range.start;
    const startHour12 = startHour24 > 12 ? startHour24 - 12 : (startHour24 === 0 ? 12 : startHour24);
    const startMinuteVal = Math.round((range.start - Math.floor(range.start)) * 60);
    
    setStartHour(Math.floor(startHour12).toString().padStart(2, '0'));
    setStartMinute(startMinuteVal.toString().padStart(2, '0'));
    setStartPeriod(range.start >= 12 ? 'PM' : 'AM');
    
    // Reset end time
    setEndTime('');
    setEndHour('00');
    setEndMinute('00');
    setEndPeriod(range.start >= 12 ? "PM" : "AM");
  }, []);

  const getNextQuarterHour = useCallback(
  (hour, minute, period) => {
    let hourNum = parseInt(hour, 10);
    let minuteNum = parseInt(minute, 10);

    minuteNum += 15;

    let nextPeriod = period;

    if (minuteNum >= 60) {
      minuteNum = 0;

      if (hourNum === 11) {
        hourNum = 12;
        nextPeriod = period === "AM" ? "PM" : "AM";
      } else if (hourNum === 12) {
        hourNum = 1;
      } else {
        hourNum += 1;
      }
    }

    return {
      hour: hourNum.toString().padStart(2, "0"),
      minute: minuteNum.toString().padStart(2, "0"),
      period: nextPeriod,
    };
  },
  []
);


  // Handle time selection
const handleTimeSelect = useCallback(() => {
  setValidationError("");

  if (!selectedRange) return;

  if (isSelectingStart) {
    const startVal = toDecimal(startHour, startMinute, startPeriod);

    if (startVal < selectedRange.start || startVal >= selectedRange.end) {
      setValidationError("Start time must be within selected range.");
      return;
    }

    const hour24 =
      startPeriod === "PM"
        ? parseInt(startHour, 10) === 12
          ? 12
          : parseInt(startHour, 10) + 12
        : parseInt(startHour, 10) === 12
        ? 0
        : parseInt(startHour, 10);

    const timeValue = `${hour24.toString().padStart(2, "0")}:${startMinute}`;
    setStartTime(timeValue);
    setIsStartTimeSelected(true);
    setIsSelectingStart(false);

    const nextTime = getNextQuarterHour(
      startHour,
      startMinute,
      startPeriod
    );

    setEndHour(nextTime.hour);
    setEndMinute(nextTime.minute);
    setEndPeriod(nextTime.period);
  } else {
    const endVal = toDecimal(endHour, endMinute, endPeriod);
    const startVal = toDecimal(startHour, startMinute, startPeriod);

    if (endVal > selectedRange.end || endVal < selectedRange.start) {
      setValidationError("End time must be within selected range.");
      return;
    }

    if (endVal <= startVal) {
      setValidationError("End time must be after Start");
      return;
    }

    const hour24 =
      endPeriod === "PM"
        ? parseInt(endHour, 10) === 12
          ? 12
          : parseInt(endHour, 10) + 12
        : parseInt(endHour, 10) === 12
        ? 0
        : parseInt(endHour, 10);

    const timeValue = `${hour24.toString().padStart(2, "0")}:${endMinute}`;
    setEndTime(timeValue);

    const startHour24 =
      startPeriod === "PM"
        ? parseInt(startHour, 10) === 12
          ? 12
          : parseInt(startHour, 10) + 12
        : parseInt(startHour, 10) === 12
        ? 0
        : parseInt(startHour, 10);

    const startTimeValue = `${startHour24
      .toString()
      .padStart(2, "0")}:${startMinute}`;

    if (onChange) {
      onChange({
        name,
        start: startTimeValue,
        end: timeValue,
      });
    }

    setShowTimePickerUI(false);
    setShowDropdown(false);
  }
}, [
  isSelectingStart,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod,
  selectedRange,
]);
  // Handle edit start time
  const handleEditStartTime = useCallback(() => {
    setIsSelectingStart(true);
    setIsStartTimeSelected(false);
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setSelectedRange(null);
    setShowTimePickerUI(false);
    setActiveRange(null);
  }, []);

  // Scroll functions for start time
  const scrollStartHourUp = useCallback(() => {
    const filteredHours = getFilteredHours(true);
    if (filteredHours.length === 0) return;
    
    const currentIndex = filteredHours.indexOf(startHour);
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredHours.length - 1;
    setStartHour(filteredHours[nextIndex]);
  }, [startHour, getFilteredHours]);

  const scrollStartHourDown = useCallback(() => {
    const filteredHours = getFilteredHours(true);
    if (filteredHours.length === 0) return;
    
    const currentIndex = filteredHours.indexOf(startHour);
    const nextIndex = currentIndex < filteredHours.length - 1 ? currentIndex + 1 : 0;
    setStartHour(filteredHours[nextIndex]);
  }, [startHour, getFilteredHours]);

  const scrollStartMinuteUp = useCallback(() => {
    const filteredMinutes = getFilteredMinutes(true, startHour);
    if (filteredMinutes.length === 0) return;
    
    const currentIndex = filteredMinutes.indexOf(startMinute);
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredMinutes.length - 1;
    setStartMinute(filteredMinutes[nextIndex]);
  }, [startHour, startMinute, getFilteredMinutes]);

  const scrollStartMinuteDown = useCallback(() => {
    const filteredMinutes = getFilteredMinutes(true, startHour);
    if (filteredMinutes.length === 0) return;
    
    const currentIndex = filteredMinutes.indexOf(startMinute);
    const nextIndex = currentIndex < filteredMinutes.length - 1 ? currentIndex + 1 : 0;
    setStartMinute(filteredMinutes[nextIndex]);
  }, [startHour, startMinute, getFilteredMinutes]);

  // Scroll functions for end time
  const scrollEndHourUp = useCallback(() => {
    const filteredHours = getFilteredHours(false);
    if (filteredHours.length === 0) return;
    
    const currentIndex = filteredHours.indexOf(endHour);
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredHours.length - 1;
    setEndHour(filteredHours[nextIndex]);
  }, [endHour, getFilteredHours]);

  const scrollEndHourDown = useCallback(() => {
    const filteredHours = getFilteredHours(false);
    if (filteredHours.length === 0) return;
    
    const currentIndex = filteredHours.indexOf(endHour);
    const nextIndex = currentIndex < filteredHours.length - 1 ? currentIndex + 1 : 0;
    setEndHour(filteredHours[nextIndex]);
  }, [endHour, getFilteredHours]);

  const scrollEndMinuteUp = useCallback(() => {
    const filteredMinutes = getFilteredMinutes(false, endHour);
    if (filteredMinutes.length === 0) return;
    
    const currentIndex = filteredMinutes.indexOf(endMinute);
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredMinutes.length - 1;
    setEndMinute(filteredMinutes[nextIndex]);
  }, [endHour, endMinute, getFilteredMinutes]);

  const scrollEndMinuteDown = useCallback(() => {
    const filteredMinutes = getFilteredMinutes(false, endHour);
    if (filteredMinutes.length === 0) return;
    
    const currentIndex = filteredMinutes.indexOf(endMinute);
    const nextIndex = currentIndex < filteredMinutes.length - 1 ? currentIndex + 1 : 0;
    setEndMinute(filteredMinutes[nextIndex]);
  }, [endHour, endMinute, getFilteredMinutes]);

  // Toggle periods
  const toggleStartPeriod = useCallback(() => {
    setStartPeriod(prev => prev === 'AM' ? 'PM' : 'AM');
  }, []);

  const toggleEndPeriod = useCallback(() => {
    setEndPeriod(prev => prev === 'AM' ? 'PM' : 'AM');
  }, []);

  return {
    // State
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

    validationError,
    
    // Getters
    getFilteredHours,
    getFilteredMinutes,
    
    // Handlers
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
    
    // Setters
    setManualStartInput,
    setManualEndInput,
    setShowTimePickerUI,
  };
};