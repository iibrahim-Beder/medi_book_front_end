// components/RenderCheckboxes.jsx

import React from "react";

export default function RenderCheckboxes({
  field,
  index,
  onChange,
  item,
  errors = {},
  forceShowError = false,
  readOnly = false,
}) {
  const value = item?.[field.name ] || [];
  const errorKey = `${field.name}_${index}`;
  const error = errors?.[errorKey];

  return (
    <>
      {field.label && <label>{field.label}</label>}

      <div className="form-group">
        <div className="dc-checkboxgroup">
          {field.options.map((option, optIndex) => (
            <span key={option} className="dc-checkbox">
              <input
                id={`${field.name}_${index}_${optIndex}`}
                type="checkbox"
                name={field.name}
                value={option}
                checked={value.includes(option)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...value, option]
                    : value.filter((v) => v !== option);
                    index===null?onChange(field.name,newValue):onChange(index,field.name,newValue);

                  // onChange(index,field.name, newValue);
                }}
                disabled={readOnly}
              />

              <label htmlFor={`${field.name}_${index}_${optIndex}`}>
                {(option)}
              </label>
            </span>
          ))}
        </div>

        {forceShowError && error && (
          <div className="text-danger small">{error}</div>
        )}
      </div>
    </>
  );
}