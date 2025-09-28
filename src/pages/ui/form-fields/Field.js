import React, { useState } from "react";

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur, 
  placeholder,
  icon,
  type = "text",
  error,
  forceShowError = false,
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);
  // console.log("Field render:", { name, value, error,  forceShowError, showError });
  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`} style={{ opacity: disabled ? 0.6 : 1 }}>
      <label htmlFor={name}>{label}</label>
      <div className="input-with-icon">
        <span className={`input-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span>
        <input disabled={disabled}
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={showError ? "input-error" : ""}
        />
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Field;