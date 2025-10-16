import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import DropdownWithSearch from "./DropdownWithSearch";

const CustomAccordion = memo(({
  titleBackgroundColor = "",
  backgroundColor = "",
  title,
  addNewLabel,
  data = [],
  formFields = [],
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  noHedarBefore = false,
  accordioninnertitleSize = "",
  readOnly = false,
}) => {
  const [dataRead, setDataRead] = useState(data);

  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  const handleEditClick = (index) => {
    setTimeout(() => {
      if (readOnly) {
        setDataRead(prev =>
          prev.map((item, i) => ({
            ...item,
            isExpanded: i === index ? !item.isExpanded : false
          }))
        );
        return;
      } else if (onUpdate) {
        const currentData = data || [];
        currentData.forEach((_, i) => {
          onUpdate(i, "isExpanded", i === index ? !currentData[index]?.isExpanded : false);
        });
      }
    }, 0);
  };

  const handleFieldChange = (index, field, value) => {
    if (onUpdate) {
      onUpdate(index, field, value);
    }
  };

  const handleSave = (index, e) => {
    e.preventDefault();
    const currentData = data || [];
    const itemData = currentData[index];
    if (onSave && itemData) {
      onSave(index, itemData);
    }
  };

  const handleCancel = (index) => {
    const currentData = data || [];
    if (currentData[index]?.isNew) {
      if (onDelete) onDelete(index);
    } else {
      if (onUpdate) onUpdate(index, "isExpanded", false);
    }
  };

  return (
    <div className="dc-userexperience">
      {title && (
        <div
          className={`dc-tabscontenttitle dc-addnew ${noHedarBefore ? "no-before" : ""}`}
          style={{ backgroundColor: titleBackgroundColor }}
        >
          <h3>{title}</h3>
          {onAdd && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onAdd();
              }}
            >
              {addNewLabel}
            </a>
          )}
        </div>
      )}

      <ul className="dc-experienceaccordion accordion">
        {dataRead.map((item, index) => (
          <li key={item.id || index}>
            <div
              className={`dc-accordioninnertitle ${accordioninnertitleSize}`}
              style={{
                backgroundColor: titleBackgroundColor,
                borderColor: noHedarBefore ? "#eee" : "",
                borderLeft: item.isNew ? "2px solid #ffa500" : "",
              }}
            >
              <span>
                {item.icon && <span style={{ marginRight: "8px" }}>{item.icon}</span>}
                {item.title || item.type || "New Recipe"} <em>{item.date}</em>
                {item.isNew && (
                  <span style={{ color: "#ffa500", marginLeft: "8px" }}>(New)</span>
                )}
              </span>
              <div className="dc-rightarea">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(index);
                  }}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a>

                {onDelete && !readOnly&& (
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(index);
                    }}
                    className="dc-deleteinfo"
                    style={{ marginLeft: "8px" }}
                  >
                    <IoTrashOutline />
                  </a>
                )}
              </div>
            </div>

            <div
              style={{ backgroundColor }}
              className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
            >
              {formFields && formFields.map((field, idx) => (
                <div
                  key={idx}
                  className={`dropdown-with-search-in-accordion`}
                >
                  {field.name === "medication" && field.type === "dropdown" && (
                    <DropdownWithSearch
                      label={field.label || "Medication"}
                      options={field.options || []}
                      value={item[field.name] || ""}
                      onChange={(val) => handleFieldChange(index, field.name, val)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}

<form
  className="dc-formtheme dc-userform"
  onSubmit={(e) => handleSave(index, e)}
>
  <fieldset>
    {formFields && formFields.map((field, idx) => (
      field.name !== "medication" && ( 
        <div
          key={idx}
          className={`form-group ${field.half ? "form-group-half" : ""}`}
        >
          <label className="form-label">{field.label}</label>
          
          {field.type === "textarea" ? (
            <textarea
              disabled={readOnly || field.readOnly} 
              className="form-control"
              placeholder={field.placeholder}
              value={item[field.name] || ""}
              onChange={(e) =>
                handleFieldChange(index, field.name, e.target.value)
              }
              style={field.readOnly ? { 
                backgroundColor: '#f8f9fa', 
                cursor: 'not-allowed' 
              } : {}}
            />
          ) : field.type === "select" ? (
            <select
              disabled={readOnly || field.readOnly} 
              className="form-control"
              value={item[field.name] || ""}
              onChange={(e) =>
                handleFieldChange(index, field.name, e.target.value)
              }
              style={field.readOnly ? { 
                backgroundColor: '#f8f9fa', 
                cursor: 'not-allowed' 
              } : {}}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              disabled={readOnly || field.readOnly} 
              type={field.type}
              className="form-control"
              placeholder={field.placeholder}
              value={item[field.name] || ""}
              onChange={(e) =>
                handleFieldChange(index, field.name, e.target.value)
              }
              style={field.readOnly ? { 
                backgroundColor: '#f8f9fa', 
                cursor: 'not-allowed' 
              } : {}}
            />
          )}
        </div>
      )
    ))}

    {!readOnly && (
      <div className="dc-btnarea d-flex">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => handleCancel(index)}
          style={{ margin: "11px 4px" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="second-btn"
          style={{ margin: "11px 4px" }}
        >
          {item.isNew ? "Add" : "Save"}
        </button>
      </div>
    )}
  </fieldset>
</form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default CustomAccordion;
