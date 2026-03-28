// src/components/GenerationRuleStep.jsx

import { useTranslation } from "react-i18next";
import SegmentedProgress from "../pages/making-slots/TimeRange/SegmentedProgress";
import TimeRangePicker from "../pages/making-slots/TimeRange/TimeRangePicker";
export const mockSegments1 = [
  { id: 1, start: 8, end: 8.25, type: "break" },
  { id: 2, start: 8.25, end: 8.75, type: "free" },
  { id: 3, start: 8.75, end: 9, type: "busy" },
  { id: 4, start: 9, end: 10.25, type: "busy" },
  { id: 5, start: 10.25, end: 10.5, type: "busy" },
  { id: 6, start: 10.5, end: 11.75, type: "busy" },
  { id: 7, start: 11.75, end: 12, type: "busy" },
];

export const activeRange1 = {
  start: "08:45",
  end: "09:15",
};
export const mockSegments2 = [
  { id: 1, start: 8, end: 9, type: "free" },
  { id: 2, start: 9, end: 10, type: "busy" },
];

export const activeRange2 = {
  start: "08:15",
  end: "08:30",
};
export const mockSegments3 = [
  { id: 1, start: 8, end: 9, type: "busy" },
  { id: 2, start: 9, end: 10, type: "free" },
];

export const activeRange3 = {
  start: "08:20",
  end: "08:40",
};
export const mockSegments4 = [
  { id: 1, start: 8, end: 8.5, type: "free" },
  { id: 2, start: 8.5, end: 9, type: "busy" },
  { id: 3, start: 9, end: 9.5, type: "free" },
];

export const activeRange4 = {
  start: "08:15",
  end: "09:15",
};
export const mockSegments5 = [
  { id: 1, start: 10, end: 11, type: "free" },
  { id: 2, start: 11, end: 12, type: "busy" },
];

export const activeRange5 = {
  start: "08:00",
  end: "09:00",
};
export const mockSegments6 = [
  { id: 1, start: 8, end: 8.5, type: "free" },
  { id: 2, start: 8.5, end: 9, type: "busy" },
];

export const activeRange6 = {
  start: "08:30",
  end: "09:00",
};
export const mockSegments7 = [
  { id: 1, start: 8, end: 8.25, type: "free" },
  { id: 2, start: 8.25, end: 8.5, type: "busy" },
  { id: 3, start: 8.5, end: 8.75, type: "free" },
  { id: 4, start: 8.75, end: 9, type: "busy" },
  { id: 5, start: 9, end: 9.25, type: "free" },
];

export const activeRange7 = {
  start: "08:20",
  end: "08:50",
};
export const mockSegments8 = [
  { id: 1, start: 8, end: 9, type: "free" },
  { id: 2, start: 9, end: 10, type: "busy" },
];

export const activeRange8 = {
  start: "08:25",
  end: "8:36",
};

export default function Doctor() {
  const { t } = useTranslation();

  return (
    <div className="table-card">
      <h1>Doctor generation rules</h1>
      <TimeRangePicker
        timeline={mockSegments8}
        // onChange={(e) => handleUpdateAddSlot("rangeTime", e)}
        value={activeRange8}
      />
      <TimeRangePicker
        timeline={mockSegments2}
        value={activeRange2}
      />
      <TimeRangePicker
        timeline={mockSegments4}
        value={activeRange4}
      />
      <TimeRangePicker
        timeline={mockSegments5}
        value={activeRange5}
      />
      <TimeRangePicker
        timeline={mockSegments6}
        value={activeRange6}
      />
      <TimeRangePicker
        timeline={mockSegments7}
        value={activeRange7}
      />
      <TimeRangePicker
        timeline={mockSegments8}
        value={activeRange8}
      />
      <TimeRangePicker
        timeline={mockSegments1}
        value={activeRange1}
      />
    </div>
  );
}
