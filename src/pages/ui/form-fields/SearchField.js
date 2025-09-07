import React from "react";

const SearchField = ({ value, onChange, placeholder, icon }) => {
  return (
    <div className="search-field">
      {icon && <span className="search-icon">{icon}</span>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};

export default SearchField;