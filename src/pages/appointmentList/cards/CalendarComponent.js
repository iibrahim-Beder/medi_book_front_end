
import React, { useState } from "react";
import Calendar from "react-calendar";
import '../../MainCss.css';
import { useTranslation } from "react-i18next";


export default function CalendarComponent({date, setDate}) {

  const { i18n } = useTranslation();

  const onChange = (date) => {
    setDate(date);
  };
  
  return (
    <div className="dc-calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        locale={`${i18n.language}`}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
}
