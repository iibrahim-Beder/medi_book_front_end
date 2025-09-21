import React from 'react';
import DateRangePicker from '../pages/patient-management/patient-information/PatientTabs/DateRangePicker'; // استيراد الكمبوننت

const Test = () => {
  return (
    <div>
      <h1>Welcome to Date Range Picker</h1>
<DateRangePicker 
  onChange={(range) => console.log("Selected Range:", range)} 
  initialRange={{ start: new Date("2025-01-01"), end: new Date("2025-01-10") }}
  width="250px"
/>
    </div>
  );
};

export default Test;
