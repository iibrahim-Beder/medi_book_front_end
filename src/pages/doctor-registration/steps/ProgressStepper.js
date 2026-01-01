import React from "react";

const ProgressStepper = ({ currentStep, stepsMeta, progressPct }) => {
  return (
    <div className="progress-container">
      <div className="progress-steps">
        {/* <div
          className="progress-bar"
          style={{ width: `${progressPct}%` }}
        /> */}
        {stepsMeta.map((s, i) => {
          const n = i + 1;
          const state =
            currentStep === n
              ? "active"
              : currentStep > n
              ? "completed"
              : "";
          return (
            <div key={n} className={`step ${state}`}>
              <span className="step-icon">{s.icon}</span>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;