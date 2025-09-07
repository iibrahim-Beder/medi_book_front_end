// Field.jsx
import React, { useState } from "react";

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur, // ✅ إضافة دعم لـ onBlur
  placeholder,
  icon,
  type = "text",
  error,
  forceShowError = false,
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);
  console.log("Field render:", { name, value, error,  forceShowError, showError });
  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e); // ✅ استدعاء onBlur إذا كان موجودًا
  };

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-with-icon">
        <span className={`input-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span>
        <input
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