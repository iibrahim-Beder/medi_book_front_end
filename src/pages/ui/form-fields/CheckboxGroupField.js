import React from "react";

const CheckboxGroupField = ({
  label,
  name,
  value = [],
  onChange,
  options,
  icon
}) => {
  const handleChange = (e) => {
    const optionValue = e.target.value;
    const isChecked = e.target.checked;
    
    let newValue;
    if (isChecked) {
      newValue = [...value, optionValue];
    } else {
      newValue = value.filter(item => item !== optionValue);
    }
    
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="checkbox-group">
        {options.map((option) => (
          <div key={option.value} className="checkbox-item">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={handleChange}
            />
            <label htmlFor={`${name}-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroupField;