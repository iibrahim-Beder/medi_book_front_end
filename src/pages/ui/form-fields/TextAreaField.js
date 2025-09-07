import React, { useState } from "react";

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  error, 
  forceShowError = false, // ✅ جديد
}) => {
  const [touched, setTouched] = useState(false);

  // ✅ الشرط統一: يظهر لو الحقل اتلمس أو لو Save اتعمل
  const showError = error && (touched || forceShowError);

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`}>
      <label htmlFor={name}>
        <span>{label}</span>
      </label>
      <div className="input-with-icon">
        <span className={`input-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span>
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value || ""}
          onChange={onChange}
          onBlur={() => setTouched(true)} // ✅ يبان الخطأ بعد ما يسيب الحقل
          placeholder={placeholder}
          className={showError ? "input-error" : ""}
        />
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default TextAreaField;
