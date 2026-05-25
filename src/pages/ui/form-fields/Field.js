import React, { useEffect, useState } from "react";
import SelectDatePicker from "./SelectDatePicker";
import HighlightedInput from "./HighlightedFild";
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
  half = false,
  required = false,
  isHasMatched=false,
  searchTerm="",
}) => {
  const [touched, setTouched] = useState(false);
  const showError = Boolean(error) && (touched || forceShowError);


  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

if (type==="date") {
  return (
     <SelectDatePicker
     label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      error={error}
      forceShowError={forceShowError}
      disabled={disabled}
      required={required}
    />
  );
  
}
  return (
    <div className={`form-group ${half ? "form-group-half" : ""} ${showError ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          <span  className={isHasMatched ? "has-match-field" : ""}>{label}</span>
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-with-icon">
        {/* {icon && (
          <span className={`input-icon ${showError ? "icon-error" : ""}`}>
            {icon}
          </span>
        )} */}
        {isHasMatched ? (
          <HighlightedInput
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          searchTerm={searchTerm}
          isHasMatched={isHasMatched}
          disabled={disabled}
        />
        ):(
        <input 
          disabled={disabled}
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={showError ? "input-error" : ""}
        />)}
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Field;