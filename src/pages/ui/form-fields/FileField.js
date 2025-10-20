import React, { useState } from "react";

const FileField = ({
  label,
  name,
  accept,
  onChange,
  icon,
  buttonIcon,
  hint,
  error,
  forceShowError = false, 
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setTouched(true);
    onChange(e);
  };

  const showError = error && (touched || forceShowError);

  return (
    <div className={`form-group ${showError ? "has-error" : ""}`}>
      <label>{label}</label>
      <label className={`file-upload ${showError ? "file-error" : ""}`}>
        <span className={`file-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span>
        <p>{hint}</p>
        <span className="btn">
          {buttonIcon} رفع ملف
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleChange}
            hidden
          />
        </span>
      </label>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FileField;
