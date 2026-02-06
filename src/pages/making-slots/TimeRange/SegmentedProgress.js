import "./SegmentedBar.css";
import React, { useMemo, useState } from "react";

function buildTicks(min, max, step = 1) {
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let t = start; t <= max; t += step) {
    ticks.push(t);
  }
  return ticks;
}
const MIN_RATIO_FOR_FULL_LABEL = 0.18;
const Max_MIN_RATIO_FOR_FULL_LABEL = 0.6;

const getTimelineLabel = (seg) => {
  if (seg.ratio < MIN_RATIO_FOR_FULL_LABEL) {
    if (seg.ratio < Max_MIN_RATIO_FOR_FULL_LABEL) {
      return formatHour(seg.start, true);
      // : `${formatTime(seg.end)} ${seg.period}`;
    }
    return formatHour(seg.start, false);
  }
  return `${formatHour(seg.start, false)}-${formatHour(seg.end, false)}`;
};

export function formatHour(hour, short = true) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);

  const dateHour = h % 24;
  const period = dateHour >= 12 ? "PM" : "AM";
  const displayHour = dateHour % 12 === 0 ? 12 : dateHour % 12;
  if (short) {
    if (m) {
      return `${displayHour} : ${m} ${period}`;
    }
    return `${displayHour} ${period}`;
  } else
    return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}
export default function SegmentedProgress({
  segments,
  mode = "continuous",
  showTimeline = true,
  height = 16,
  gap = 8,
  colors = {
    busy: "#1e90ff", // blue
    free: "#e6f4ff", // light
    break: "#ffc107", // neutral
    other: "#cbd5e1",
  },
  showTooltips = true,
  className = "",
  handleSelectRange,
  activeRange,
}) {
  // normalize to ratios (0..1)
  const [hoverInfo, setHoverInfo] = useState(null);
  const { normalized, min, max, total } = useMemo(() => {
    if (!segments?.length) return { normalized: [], min: 0, max: 0, total: 1 };

    const min = Math.min(...segments.map((s) => s.start));
    const max = Math.max(...segments.map((s) => s.end));
    const total = Math.max(0.0001, max - min);

    const normalized = segments.map((s, i) => ({
      ...s,
      key: i,
      ratio: (s.end - s.start) / total,
      display: getTimelineLabel(s),
    }));

    return { normalized, min, max, total };
  }, [segments]);

  const ticks = useMemo(() => buildTicks(min, max, 1), [min, max]);
  const Ruler = (
    <div style={{ position: "relative", height: 20, marginBottom: 6 }}>
      {ticks.map((t, i) => {
        const left = ((t - min) / total) * 100;
        return (
          <div
            key={t}
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: `${left}%`,
              transform: "translateX(-50%)",
              textAlign: "center",
              fontSize: 11,
              color: "#475569",
              zIndex: 1,
              paddingLeft: `${gap}px`,
            }}
          >
            <div>{formatHour(t)}</div>
            <div
              style={{
                height: 8,
                width: 1,
                background: "#94a3b8",
                margin: "0 auto",
              }}
            />
          </div>
        );
      })}
    </div>
  );

  if (!normalized.length) return null;

  if (mode === "continuous") {
    // build a single inner bar by stacking segments as background gradient or by absolute children
    // simpler: create left filled portion = sum of busy ratios up to point? But we want colored segments inside continuous -> use multiple children with no gap and border-radius only on container
    return (
      <div className="">
        <div className={`sp-wrap ${className}`} style={{ padding: 6 }}>
          {showTimeline && Ruler}
          <div
            className="sp-rail"
            style={{
              height,
              borderRadius: height,
            }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={1}
          >
            {normalized.map((seg) => (
              <div
                key={seg.key}
                className={`sp-seg ${activeRange === seg.id ? "active" : ""} `}
                style={{
                  cursor: "pointer",
                  flex: seg.ratio,
                  background:
                    seg.type && colors[seg.type]
                      ? colors[seg.type]
                      : colors.other,
                  height,
                }}
                onClick={() => handleSelectRange(seg)}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setHoverInfo({
                    seg,
                    x: rect.left + rect.width / 2,
                    y: rect.bottom,
                  });
                }}
                onMouseLeave={() => setHoverInfo(null)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // segmented mode (pills with gaps)
  return (
    <div className="segmented-progress-container">
      <div className={`sp-wrap ${className}`}>
        {showTimeline && Ruler}

        <div
          className="sp-pills"
          style={{
            height,
            gap: `${gap}px`,
          }}
        >
          {normalized.map((seg, idx) => (
            <div
              onClick={() => handleSelectRange(seg)}
              onMouseEnter={(e) => {
                const rect = e.target.getBoundingClientRect();
                setHoverInfo({
                  seg,
                  x: rect.left + rect.width / 2,
                  y: rect.bottom,
                });
              }}
              onMouseLeave={() => setHoverInfo(null)}
              key={seg.key}
              className={`sp-pill ${activeRange === seg.id ? "active" : ""} `}
              style={{
                flex: seg.ratio,
                background:
                  seg.type && colors[seg.type]
                    ? colors[seg.type]
                    : colors.other,
                height,
                borderRadius: 6, // pill shape
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        {hoverInfo && (
          <div
            className="hover-tooltip tooltip-arrow"
            style={{
              position: "fixed",
              top: hoverInfo.y + 8,
              left: hoverInfo.x,
              transform: "translateX(-50%)",
              padding: "6px 10px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              fontSize: 12,
              zIndex: 9999,
              whiteSpace: "nowrap",
            }}
          >
            <div className="d-flex justify-content-between">
              <strong>{hoverInfo.seg.type.toUpperCase()}</strong>
              <strong>{hoverInfo.seg.end-hoverInfo.seg.start}h</strong>
            </div>
            <div>Start: {formatHour(hoverInfo.seg.start, false)}</div>
            <div>End: {formatHour(hoverInfo.seg.end, false)}</div>
            {hoverInfo.seg.price && <div className="d-flex justify-content-between">Slot Price: <strong>{hoverInfo.seg.price}</strong></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// SegmentedProgress.propTypes = {
//   segments: PropTypes.arrayOf(
//     PropTypes.shape({
//       start: PropTypes.number.isRequired,
//       end: PropTypes.number.isRequired,
//       type: PropTypes.string,
//       label: PropTypes.string,
//     }),
//   ).isRequired,
//   mode: PropTypes.oneOf(["continuous", "segmented"]),
//   height: PropTypes.number,
//   gap: PropTypes.number,
//   colors: PropTypes.object,
//   showTooltips: PropTypes.bool,
//   className: PropTypes.string,
// };
