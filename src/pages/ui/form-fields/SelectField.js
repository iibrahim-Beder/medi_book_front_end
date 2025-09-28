import React, { useState } from "react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  error,
  forceShowError = false, // ✅ جديد
}) => {
  const [touched, setTouched] = useState(false);

  const showError = error && (touched || forceShowError);

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-with-icon">
        <span className={`input-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          className={showError ? "input-error" : ""}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectField;
