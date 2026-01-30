import React, { useState } from "react";
import HighlightedTextArea from "./HighlightedTextArea";

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  error, 
  forceShowError = false, 
  disabled = false,
  isHasMatched=false,
  searchTerm="",
}) => {
  const [touched, setTouched] = useState(false);

  const showError = error && (touched || forceShowError);

  return (
    <div className={` textarea  form-group ${showError ? "has-error" : ""}` }
    style={{gridColumn:"span 2"}}>
      <label htmlFor={name}>
        <span  className={isHasMatched ? "has-match-field" : ""}>{label}</span>
      </label>
      <div className="input-with-icon">
        {/* <span className={`input-icon ${showError ? "icon-error" : ""}`}>
          {icon}
        </span> */}
          {isHasMatched ? (
          <HighlightedTextArea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          searchTerm={searchTerm}
          isHasMatched={isHasMatched}
          disabled={disabled}
        />
        ):(
        <textarea
         disabled={disabled}        
        style={{minHeight:"100px"}}
          id={name}
          name={name}
          rows={3}
          value={value || ""}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={showError ? "input-error" : ""}
        />)}
      </div>
      {showError && <span className="error-text">{error}</span>}
    </div>
  );
};

export default TextAreaField;
