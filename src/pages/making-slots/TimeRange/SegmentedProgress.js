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
function timeStringToNumber(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}
const isInActiveRange = (seg, activeRange) => {
  if (!activeRange) return false;

  const start = timeStringToNumber(activeRange.start);
  const end = timeStringToNumber(activeRange.end);

  return seg.start < end && seg.end > start;
};
export default function SegmentedProgress({
  segments = [],
  mode = "continuous",
  showTimeline = true,
  height = 16,
  gap = 8,
  colors = {
    busy: "#1e90ff",
    free: "#e6f4ff",
    break: "#ffc107",

    "active-busy": "#86efac",
    // "active-free": "#86efac",
    "active-free": "#e6f4ff",
    "active-alone": "#bbf7d0",

    other: "#cbd5e1",
  },
  showTooltips = true,
  className = "",
  handleSelectRange,
  activeRange,
  activeRangeValue,
  lastActiveId,
}) {
  const parsedActiveRange = activeRangeValue
    ? {
        start: timeStringToNumber(activeRangeValue.start),
        end: timeStringToNumber(activeRangeValue.end),
      }
    : null;

  const processedSegments = useMemo(() => {
    return splitSegmentsByActiveRange(segments, parsedActiveRange);
  }, [segments, parsedActiveRange]);
  // normalize to ratios (0..1)
  const [hoverInfo, setHoverInfo] = useState(null);
  const { normalized, min, max, total } = useMemo(() => {
    if (!segments?.length) return { normalized: [], min: 0, max: 0, total: 1 };

    const min = Math.min(...segments.map((s) => s.start));
    const max = Math.max(...segments.map((s) => s.end));
    const total = Math.max(0.0001, max - min);

    const normalized = processedSegments.map((s, i, arr) => {
      const isActive = isInActiveRange(s, activeRangeValue);
      const prev = arr[i - 1];
      const next = arr[i + 1];

      const prevIsFree =
        prev &&
        (prev.type === "free" || isInActiveRange(prev, activeRangeValue));

      const nextIsFree =
        next &&
        (next.type === "free" || isInActiveRange(next, activeRangeValue));

      let visualType = s.type;
      let grouped = false;

      if (isActive) {
        visualType = "active-busy";
        grouped = true;
      }
      if (s.ruleId === lastActiveId && !isActive) {
        s.type = "free";
        visualType = "free";
      } else if (
        s.type === "free" &&
        ((prev && isInActiveRange(prev, activeRangeValue)) ||
          (next && isInActiveRange(next, activeRangeValue)))
      ) {
        visualType = "free";
        grouped = true;
      }

      return {
        ...s,
        type: isActive ? "free" : s.type,
        key: i,
        ratio: (s.end - s.start) / total,
        display: getTimelineLabel(s),
        visualType,
        grouped,
      };
    });
    return { normalized, min, max, total };
  }, [segments]);
  const mergedSegments = useMemo(() => {
    if (!normalized.length) return [];

    const result = [];
    for (let i = 0; i < normalized.length; i++) {
      const groupStartIndex = i;
      const current = normalized[i];

      if (current.grouped || current.visualType === "active-alone") {
        let start = current.start;
        let end = current.end;
        let ratio = current.ratio;

        let visualType = current.visualType;

        while (i + 1 < normalized.length && normalized[i + 1].type === "free") {
          const next = normalized[i + 1];
          end = next.end;
          ratio += next.ratio;
          i++;
        }

        result.push({
          ...current,
          start,
          end,
          ratio,
          merged: true,
          visualType,
          children: normalized.slice(groupStartIndex, i + 1),
        });
      } else {
        result.push(current);
      }
    }

    return result;
  }, [normalized]);

  const ticks = useMemo(() => buildTicks(min, max, 0.5), [min, max]);
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
              color: "var(--terthemecolor)",
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
                  setHoverInfo({
                    seg,
                    x: e.clientX,
                    y: e.clientY,
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
          {mergedSegments.map((seg, idx) => {
            const isMerged = seg.merged;
            const mergedChildren = seg.children;

            return (
              <div
                key={seg.key}
                className={`sp-pill ${activeRange === seg.id ? "active" : ""}`}
                style={{
                  flex: seg.ratio,
                  height,
                  borderRadius: 6,
                  cursor: "pointer",
                  overflow: "hidden", // ensures children stay inside rounded corners
                }}
                onClick={() => handleSelectRange(seg)}
                // onClick={() =>
                //   handleSelectRange({
                //     start: seg.start,
                //     end: seg.end,
                //     isMerged: seg.merged,
                //     type: seg.visualType || seg.type,
                //   })
                // }
                onMouseEnter={(e) => {
                  setHoverInfo({
                    seg,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseLeave={() => setHoverInfo(null)}
              >
                {isMerged ? (
                  // Render children side by side with no gaps
                  <div
                    style={{ display: "flex", height: "100%", width: "100%" }}
                  >
                    {mergedChildren.map((child) => {
                      // Compute width of child inside this merged pill
                      const childRatio =
                        (child.end - child.start) / (seg.end - seg.start);
                      const bgColor =
                        child.visualType && colors[child.visualType]
                          ? colors[child.visualType]
                          : child.type && colors[child.type]
                            ? colors[child.type]
                            : colors.other;

                      return (
                        <div
                          key={child.key}
                          style={{
                            flex: childRatio,
                            background: bgColor,
                            height: "100%",
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  // Single segment: just background color
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        seg.visualType && colors[seg.visualType]
                          ? colors[seg.visualType]
                          : seg.type && colors[seg.type]
                            ? colors[seg.type]
                            : colors.other,
                    }}
                  />
                )}
              </div>
            );
          })}
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
              background: "var(--cardcolor)",
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
              <strong>{hoverInfo.seg.end - hoverInfo.seg.start}h</strong>
            </div>
            <div>Start: {formatHour(hoverInfo.seg.start, false)}</div>
            <div>End: {formatHour(hoverInfo.seg.end, false)}</div>
            {hoverInfo.seg.price && (
              <div className="d-flex justify-content-between">
                Slot Price: <strong>{hoverInfo.seg.price}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function splitSegmentsByActiveRange(segments, activeRange) {
  if (!activeRange) return segments;

  const result = [];

  segments.forEach((seg) => {
    const overlapStart = Math.max(seg.start, activeRange.start);
    const overlapEnd = Math.min(seg.end, activeRange.end);

    const hasOverlap = overlapStart < overlapEnd;

    if (!hasOverlap) {
      result.push(seg);
      return;
    }

    if (seg.start < overlapStart) {
      result.push({
        ...seg,
        end: overlapStart,
      });
    }

    result.push({
      ...seg,
      start: overlapStart,
      end: overlapEnd,
      type: "free",
      visualType: "active-busy",
      isActivePart: true,
    });

    if (seg.end > overlapEnd) {
      result.push({
        ...seg,
        start: overlapEnd,
      });
    }
  });

  return result;
}
