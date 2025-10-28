import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import DropdownWithSearch from "./DropdownWithSearch";
import TextAreaField from "../ui/form-fields/TextAreaField";
import Field from "../ui/form-fields/Field";
import SelectField from "../ui/form-fields/SelectField";
import FileField from "../ui/form-fields/FileField";
import SectionTitle from "../shared/SectionTitle";
import { useDevice } from "../../context/useIsMobile";
const CustomAccordion = memo(({
  oneAccordion = false,
  titleBackgroundColor = "",
  backgroundColor = "",
  title,
  titleIcon,
  addNewLabel="add",
  data = [],
  formFields = [],
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  noHedarBefore = false,
  accordioninnertitleSize = "",
  readOnly = false,
  liveUpdate = false,
  allowMultipleOpen = false,
  getItemTitle = null,
  noDataMessage = null,
  globalError = null,
  forceShowError = false,
  hint,
  errors = {},
}) => {
  const [dataRead, setDataRead] = useState(data);
   const {isMobile} = useDevice();
  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  const handleEditClick = (index) => {
    setTimeout(() => {
      if (readOnly) {
        setDataRead(prev =>
          prev.map((item, i) => ({
            ...item,
            isExpanded: i === index 
              ? !item.isExpanded 
              : allowMultipleOpen ? item.isExpanded : false,
          }))
        );
        return;
      } else if (onUpdate) {
        const currentData = data || [];
        currentData.forEach((_, i) => {
          if (i === index) {
            onUpdate(i, "isExpanded", !currentData[index]?.isExpanded);
          } else if (!allowMultipleOpen) {
            onUpdate(i, "isExpanded", false);
          }
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

  const getFieldComponent = (field, index, onChange, item, errors, forceShowError, readOnly) => {
    const value = item[field.name];
    const errorKey = `${field.name}_${index}`;
    const error = errors[errorKey];
    const commonProps = {
      label: field.label,
      name: field.name,
      value,
      icon: field.icon,
      error,
      forceShowError,
      disabled: readOnly || field.readOnly,
      placeholder: field.placeholder,
    };

    if (field.type === "textarea") {
      return <TextAreaField {...commonProps} onChange={(e) => onChange(index, field.name, e.target.value)} />;
    } else if (field.type === "select") {
      return <SelectField {...commonProps} options={field.options} onChange={(e) => onChange(index, field.name, e.target.value)} />;
    } else if (field.type === "file") {
      return <FileField 
        {...commonProps} 
        accept={field.accept} 
        buttonIcon={field.buttonIcon} 
        hint={field.hint}
        onChange={(e) => onChange(index, field.name, e.target.files)} 
      />;
    } else {
      return <Field 
        {...commonProps} 
        type={field.type || "text"} 
        min={field.min} 
        max={field.max} 
        onChange={(e) => onChange(index, field.name, e.target.value)} 
      />;
    }
  };

  const renderFormFields = (index, item) => {
    return formFields.map((field, fIdx) => {
      if (field.type === "dropdown") return null; // Handled outside the form

      const fieldComponent = getFieldComponent(field, index, handleFieldChange, item, errors, forceShowError, readOnly);

      return (
        <div
          key={field.name}
          className={`form-group ${field.half ? "form-group-half" : ""}`}
        >
          {fieldComponent}
        </div>
      );
    }).filter(Boolean);
  };

  const renderItemTitle = (item) => {
    if (getItemTitle) {
      return getItemTitle(item);
    }
    return item.title || item.type || "New Recipe";
  };

  return (
    <div className="dc-userexperience  custom-accordion  ">
      {title && (
        <div
          className={`${titleIcon ? "title-with-icon" : "dc-tabscontenttitle dc-addnew"} ${noHedarBefore ? "no-before" : ""}`}
          style={{ backgroundColor: titleBackgroundColor }}
        >
          {titleIcon ? (
            <SectionTitle icon={titleIcon} title={title} />
          ) : (
            <h3>{title}</h3>
          )}
          {onAdd && (
            <a
              href="#!"
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

      {forceShowError && globalError && (
        <div className="alert alert-danger">{globalError}</div>
      )}

      {dataRead.length === 0 && noDataMessage ? (
        <div className="alert alert-info">{noDataMessage}</div>
      ) : (
        <ul className="dc-experienceaccordion accordion">
          {dataRead.map((item, index) => {
            const isSingle = oneAccordion && dataRead.length === 1;
            const collapseClass = isSingle ? "dc-collapseexp show" : `dc-collapseexp ${item.isExpanded ? "show" : "hide"}`;
            return (
              <li key={item.id || index}>
                <div
                  className={`dc-accordioninnertitle ${accordioninnertitleSize}`}
                  style={{
                    display: isSingle ? "none" : "",
                    backgroundColor: titleBackgroundColor,
                    borderColor: noHedarBefore ? "#eee" : "",
                    borderLeft: item.isNew ? "2px solid #ffa500" : "",
                  }}
                >
                  <span
                    onClick={() => !readOnly && handleEditClick(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.icon && (
                      <span style={{ marginRight: "8px" }}>{item.icon}</span>
                    )}
                    {renderItemTitle(item)} {  !isMobile &&  <em>{item.date}</em>}
                    {item.isNew && (
                      <span style={{ color: "#ffa500", marginLeft: "8px" }}>
                        (New)
                      </span>
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

                    {onDelete && !readOnly && (
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

                <div style={{ backgroundColor }} className={collapseClass}>
                  {formFields.map(
                    (field, idx) =>
                      field.type === "dropdown" && (
                        <div
                          key={idx}
                          className="dropdown-with-search-in-accordion"
                        >
                          <DropdownWithSearch
                            label={field.label || "Medication"}
                            options={field.options || []}
                            value={item[field.name] || ""}
                            onChange={(val) =>
                              handleFieldChange(index, field.name, val)
                            }
                            placeholder={field.placeholder}
                          />
                        </div>
                      )
                  )}

                  <form
                    className="dc-formtheme dc-userform"
                    onSubmit={
                      liveUpdate
                        ? (e) => e.preventDefault()
                        : (e) => handleSave(index, e)
                    }
                  >
                    <fieldset>
                      <div className="form-group">
                        {renderFormFields(index, item)}
                      </div>
                      { hint && (
                        <div className="form-group">
                          <span>{hint}</span>
                        </div>
                      )}

                      {!readOnly && !liveUpdate && (
                        <div className="dc-btnarea d-flex">
                          <button
                            type="button"
                            className="simple-btn"
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
            );
          })}
        </ul>
      )}
    </div>
  );
});

export default CustomAccordion;