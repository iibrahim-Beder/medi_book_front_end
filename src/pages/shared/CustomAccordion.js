import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import DropdownWithSearch from "./DropdownWithSearch";
import TextAreaField from "../ui/form-fields/TextAreaField";
import Field from "../ui/form-fields/Field";
import SelectField from "../ui/form-fields/SelectField";
import FileField from "../ui/form-fields/FileField";
import SectionTitle from "./SectionTitle";
import PopupMessage from "./PopupMessage";
import { useTranslation } from "react-i18next";
import TimeRangePicker from "../making-slots/TimeRange/TimeRangePicker";
import { renderCheckboxes } from "../making-slots/cards/renderCheckboxes";
const CustomAccordion = memo(({
  oneAccordion = false,
  titleBackgroundColor = "",
  backgroundColor = "",
  title,
  titleIcon,
  addNewLabel = "add",
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
 isHasMatched = () => false,
 searchTerm,
 timeline,
}) => {
  const { t } = useTranslation();
  const [dataRead, setDataRead] = useState(data);
  const [deletePopup, setDeletePopup] = useState({ show: false, index: null, itemName: "" });

  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  // === Delete Confirmation ===
  const handleShowDeleteConfirm = (index) => {
    const item = dataRead[index];
    const itemName = getItemTitle ? getItemTitle(item) : (item.title || item.type || "Item");
    setDeletePopup({ show: true, index, itemName });
  };

  const handleCloseDeleteConfirm = () => {
    setDeletePopup({ show: false, index: null, itemName: "" });
  };

  const handleConfirmDelete = () => {
    if (deletePopup.index !== null && onDelete) {
      onDelete(deletePopup.index);
    }
    handleCloseDeleteConfirm();
  };

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
        const currentData = dataRead || [];
        currentData.forEach((_, i) => {
        currentData[index]._initialTitle = renderItemTitle(currentData[index]);
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
  setDataRead(prev =>
    prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
};

  const handleSave = (index, e) => {
    e.preventDefault();
    const currentData = dataRead || [];
    const itemData = currentData[index];
  //    if (itemData && !readOnly&& itemData.isExpanded===false) {
  //   itemData._initialTitle = renderItemTitle(itemData);
  // }
    if (onSave && itemData) {
      onSave(index, dataRead[index]);
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
      searchTerm: searchTerm
    };

    if (field.type === "textarea") {
      return <TextAreaField
       isHasMatched={isHasMatched(item,field.name)||false}
      {...commonProps} onChange={(e) => onChange(index, field.name, e.target.value)} />;
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
    } else if (field.type === "timeRange") {
      return <TimeRangePicker
      timeline={timeline}
        {...commonProps}
        accept={field.accept}
        buttonIcon={field.buttonIcon}
        hint={field.hint}
        onChange={(e) => onChange(index, field.name, e)}
      />;
    } else if (field.type === "checkboxes") {
      return renderCheckboxes(field, index, onChange, item, errors, forceShowError, readOnly,t);
    } else {
      return <Field
        isHasMatched={isHasMatched(item,field.name)||false}
        {...commonProps}
        type={field.type || "text"}
        min={field.min}
        max={field.max}
        disabled={readOnly || field.disabled}
        onChange={(e) => onChange(index, field.name, e.target.value)}
      />;
    }
  };

  const renderFormFields = (index, item) => {
    return formFields.map((field, fIdx) => {
      if (field.type === "dropdown") return null;

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
    if (getItemTitle) return getItemTitle(item);
    return item.title || item.type || item.medication ||  "New Item";
  };

  return (
    <div className="dc-userexperience custom-accordion">
      {/* Title Section */}
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
          {onAdd && !readOnly && (
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

      {/* Global Error */}
      {forceShowError && globalError && (
        <div className="alert alert-danger">{globalError}</div>
      )}

      {/* No Data */}
      {dataRead.length === 0 && noDataMessage ? (
        <div className="alert alert-info">{noDataMessage}</div>
      ) : (
        <ul className="dc-experienceaccordion accordion">
          {dataRead.map((item, index) => {
            if (!item._initialTitle && !readOnly ) {item._initialTitle = renderItemTitle(item);}
            const isSingle = oneAccordion && dataRead.length === 1;
            const collapseClass = isSingle ? "dc-collapseexp show" : `dc-collapseexp ${item.isExpanded ? "show" : "hide"}`;

            return (
              <li key={item.id || index}>
                {/* Accordion Title - Fixed Overflow */}
                <div
                  className={`${isHasMatched(item,"main") ? "has-match-inner" : ""}  dc-accordioninnertitle ${accordioninnertitleSize}`}
                  style={{
                    display: isSingle ? "none" : "",
                    backgroundColor: titleBackgroundColor,
                    borderColor: noHedarBefore ? "#eee" : "",
                    borderLeft: item.isNew ? "2px solid #ffa500" : "",
                  }}
                >
                  <span
                    onClick={() => !readOnly && handleEditClick(index)}
                    style={{
                      cursor: "pointer",
                      flex: 1,
                      minWidth: 0, 
                    }}
                  >
                    {item.icon && <span style={{ marginRight: "8px" }}>{item.icon}</span>}
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "98%",
                        verticalAlign: "middle",
                      }}
                      title={renderItemTitle(item)}
                    >
                    {item.isNew && (
                      <span style={{ color: "#ffa500", margin:"0 5px", fontWeight: "bold" }}>
                        (New)
                      </span>
                    )}
                      {/* {truncateTitle(renderItemTitle(item), 60)} */}
                      {/* {readOnly ? (renderItemTitle(item)) : ( {item.isExpanded? item._initialTitle: renderItemTitle(item)})   }*/}
                    {readOnly? renderItemTitle(item): (item.isExpanded ? item._initialTitle : renderItemTitle(item))}
                    {item.date && <em style={{ marginLeft: "8px", color: "#666", margin: "0 11px"}}>{item.date}</em>} 

                    </span>
                  </span>

                  {/* Action Buttons */}
                  <div className="dc-rightarea" onClick={(e) => e.stopPropagation()}>
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
                          e.stopPropagation(); 
                          handleShowDeleteConfirm(index);
                        }}
                        className="dc-deleteinfo"
                        style={{ marginLeft: "8px" }}
                      >
                        <IoTrashOutline />
                      </a>
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                <div style={{ backgroundColor }} className={collapseClass}>
                  {formFields.map(
                    (field, idx) =>
                      field.type === "dropdown" && (
                        <div key={idx} className={`dropdown-with-search-in-accordion ${ field.half ? "form-group-half" :"" } `} >
                          <DropdownWithSearch
                            type={field.DropdownType}
                            value={item[field.name] || ""}
                            onChange={(val) => handleFieldChange(index, field.name, val)}
                          />
                        </div>
                      )
                  )}

                  <form
                    className="dc-formtheme dc-userform"
                    onSubmit={liveUpdate ? (e) => e.preventDefault() : (e) => handleSave(index, e)}
                  >
                    <fieldset>
                      <div className="form-group">{renderFormFields(index, item)}</div>
                      {hint && (
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
                            {t("Cancel")}
                          </button>
                          <button
                            type="submit"
                            className="second-btn"
                            style={{ margin: "11px 4px" }}
                          >
                            {item.isNew ? t("Add"): t("Save")}
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

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <PopupMessage
          type="danger"
          title="Delete Item"
          message={`Are you sure you want to delete "${deletePopup.itemName}"? This action cannot be undone.`}
          buttons={[
            {
              text: "Cancel",
              onClick: handleCloseDeleteConfirm,
              variant: "secondary"
            },
            {
              text: "Delete",
              onClick: handleConfirmDelete,
              variant: "danger"
            }
          ]}
          onClose={handleCloseDeleteConfirm}
        />
      )}
    </div>
  );
});

export default CustomAccordion;