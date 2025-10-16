import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  error,
  forceShowError = false,
  isAllWidth = false
}) => {
  const [touched, setTouched] = useState(false);
  const showError = error && (touched || forceShowError);

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`}
    style={{ gridColumn: isAllWidth ? "span 2" : "" }}
    >
      <label htmlFor={name}>{label}</label>

      <div className="input-with-icon select-wrapper">
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
     <FaChevronDown className="select-arrow" />

      </div>

      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default SelectField;
