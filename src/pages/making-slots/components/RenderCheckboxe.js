
import React from "react";
import { useTranslation } from "react-i18next";
export default function RenderCheckboxes({
  field,
  index,
  onChange,
  item,
  errors = {},
  forceShowError = false,
  readOnly = false,
  outError = false,
  style
}) {
  const { t } = useTranslation();
  const value = item?.[field.name ] || [];
  const errorKey = `${field.name}_${index}`;
  const error = errors?.[errorKey];

  return (
    <>
      {field.label && <label>{field.label}</label>}

      <div className="form-group">
        <div className="dc-checkboxgroup" style={style} >
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
                {(t(option))}
              </label>
            </span>
          ))}
        </div>

        {((forceShowError && error ) || outError )&& (
          <div className="error-text">{error ||outError}</div>
        )}
      </div>
    </>
  );
}