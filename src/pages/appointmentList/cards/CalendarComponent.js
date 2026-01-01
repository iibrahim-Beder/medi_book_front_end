
import React, { useState } from "react";
import Calendar from "react-calendar";
import '../../MainCss.css';
import { useTranslation } from "react-i18next";


export default function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const { i18n } = useTranslation();

  return (
    <div className="dc-calendar-container">
      <Calendar
        onChange={setDate}
        value={date}
        locale={`${i18n.language}`}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
}
