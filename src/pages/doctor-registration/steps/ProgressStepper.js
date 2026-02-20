import React from "react";

const ProgressStepper = ({ currentStep, stepsMeta }) => {
  const progressPct = ((currentStep - 1) / (stepsMeta.length )) * 100;

  return (
    <div className="table-card progress-container">
      <div className="progress-steps">
        {stepsMeta.map((s, i) => {
          const stepNumber = i + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={stepNumber}
              className={`step ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
            >
              <span className="step-circle">{stepNumber}</span>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="progress-line">
        <div
          className="progress-fill"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressStepper;
