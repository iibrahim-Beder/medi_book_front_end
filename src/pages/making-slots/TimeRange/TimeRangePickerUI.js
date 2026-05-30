import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const TimeRangePickerUI = ({
  // Start time values
  startHour,
  startMinute,
  startPeriod,
  
  // End time values
  endHour,
  endMinute,
  endPeriod,
  
  // State
  isSelectingStart,
  isStartTimeSelected,
  
  // Handlers
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
  handleTimeSelect,
  handleEditStartTime,
  handleCancel,
  
  // Data
  getFilteredHours,
  getFilteredMinutes,
}) => {
  
  const renderTimePicker = (isStart) => {
    const hour = isStart ? startHour : endHour;
    const minute = isStart ? startMinute : endMinute;
    const period = isStart ? startPeriod : endPeriod;
    
    const filteredHours = getFilteredHours(isStart);
    const filteredMinutes = getFilteredMinutes(isStart, hour);
    
    const canScrollHourUp = filteredHours.length > 0;
    const canScrollHourDown = filteredHours.length > 0;
    const canScrollMinuteUp = filteredMinutes.length > 0;
    const canScrollMinuteDown = filteredMinutes.length > 0;
    
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
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
            marginBottom: '8px',
          }}>
            Hour
          </div>
          <button type="button"
            onClick={isStart ? scrollStartHourUp : scrollEndHourUp}
            disabled={!canScrollHourUp}
            style={{
              width: '40px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canScrollHourUp ? '#f1f5f9' : '#f8fafc',
              color: !canScrollHourUp ? '#94a3b8' : '#012047',
              fontSize: '16px',
              fontWeight: '600',
              cursor: !canScrollHourUp ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
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
            margin: '4px 0',
          }}>
            {hour}
          </div>
          <button type="button"
            onClick={isStart ? scrollStartHourDown : scrollEndHourDown}
            disabled={!canScrollHourDown}
            style={{
              width: '40px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canScrollHourDown ? '#f1f5f9' : '#f8fafc',
              color: !canScrollHourDown ? '#94a3b8' : '#012047',
              fontSize: '16px',
              fontWeight: '600',
              cursor: !canScrollHourDown ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
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
          marginTop: '25px',
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
            marginBottom: '8px',
          }}>
            Min
          </div>
          <button type="button"
            onClick={isStart ? scrollStartMinuteUp : scrollEndMinuteUp}
            disabled={!canScrollMinuteUp}
            style={{
              width: '40px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canScrollMinuteUp ? '#f1f5f9' : '#f8fafc',
              color: !canScrollMinuteUp ? '#94a3b8' : '#012047',
              fontSize: '16px',
              fontWeight: '600',
              cursor: !canScrollMinuteUp ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
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
            margin: '4px 0',
          }}>
            {minute}
          </div>
          <button type="button"
            onClick={isStart ? scrollStartMinuteDown : scrollEndMinuteDown}
            disabled={!canScrollMinuteDown}
            style={{
              width: '40px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canScrollMinuteDown ? '#f1f5f9' : '#f8fafc',
              color: !canScrollMinuteDown ? '#94a3b8' : '#012047',
              fontSize: '16px',
              fontWeight: '600',
              cursor: !canScrollMinuteDown ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
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
            marginBottom: '8px',
          }}>
            AM/PM
          </div>
          <button type="button"
            onClick={isStart ? toggleStartPeriod : toggleEndPeriod}
            style={{
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--bluecolor)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: '10px',
            }}
          >
            {period}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Time Pickers */}
      <div className='time-pickers-container'>
        {/* Start Time Picker */}
        <div style={{
          opacity: isSelectingStart ? 1 : 0.6,
          pointerEvents: isSelectingStart ? 'all' : 'none',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            // color: '#012047',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            Start Time
          </div>
          {renderTimePicker(true)}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
        }}>
          <div className='right-line'/>
          <div className='second-btn'
          onClick={isSelectingStart?handleTimeSelect:handleEditStartTime}
           style={{
            fontSize: '25px',
            // color: '#64748b',
            // fontWeight: '500',
            padding: '8px',
            paddingBottom: '10px',
            // backgroundColor: '#f8fafc',
            // borderRadius: '4px',
            width:"fit-content",
          }}>
            {isSelectingStart ? '→' : '←'} 
          </div>
        </div>

        {/* End Time Picker */}
        <div style={{
          opacity: !isSelectingStart && isStartTimeSelected ? 1 : 0.4,
          pointerEvents: !isSelectingStart && isStartTimeSelected ? 'all' : 'none',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            End Time
          </div>
          {renderTimePicker(false)}
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '24px',
      }}>
        <button type="button" className='simple-btn' onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" 
          className='second-btn p-0' 
          onClick={handleTimeSelect}
          style={{
            minWidth: '120px',
          }}
          disabled={!isStartTimeSelected || isSelectingStart}
        >
          Confirm Time
        </button>
      </div>
    </div>
  );
};

export default TimeRangePickerUI;