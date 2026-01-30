import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
// import "../MainCss.css";
// import DropdownWithSearch from "./DropdownWithSearch";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import FileField from "../../ui/form-fields/FileField";
import SectionTitle from "../../shared/SectionTitle";
import PopupMessage from "../../shared/PopupMessage";
import { useTranslation } from "react-i18next";

const DoctorSlotsAccordion = memo(({
  title,
  titleIcon,
  addNewLabel = "Add New Slot",
  data = [],
  clinics = [],
  appointmentTypes = [],
  currencies = [],
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
  const { t } = useTranslation();
  const [dataRead, setDataRead] = useState(data);
  const [deletePopup, setDeletePopup] = useState({ show: false, index: null, itemName: "" });

  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  // Form Fields definition for slots
  const formFields = [
    {
      name: "clinic",
      label: t("clinic"),
      type: "select",
      options: [{ value: "", label: t("selectClinic") }, ...clinics.map(c => ({ value: c.id, label: c.name }))],
      required: true
    },
    {
      name: "SlotDurationInMinutes",
      label: t("slotDurationMinutes"),
      type: "number",
      min: 5,
      step: 5,
      half: true
    },
    {
      name: "DaysInAdvance",
      label: t("daysInAdvance"),
      type: "number",
      min: 1,
      half: true
    },
    {
      name: "startTime",
      label: t("startTime"),
      type: "time",
      half: true
    },
    {
      name: "endTime",
      label: t("endTime"),
      type: "time",
      half: true
    },
    {
      name: "Price",
      label: t("price"),
      type: "number",
      min: 0,
      half: true
    },
    {
      name: "Currency",
      label: t("currency"),
      type: "select",
      options: [{ value: "", label: t("selectCurrency") }, ...currencies.map(c => ({ value: c, label: c }))],
      half: true
    },
    {
      name: "AllowedAppointmentTypes",
      label: t("allowedAppointmentTypes"),
      type: "checkboxes",
      options: appointmentTypes
    }
  ];

  // === Delete Confirmation ===
  const handleShowDeleteConfirm = (index) => {
    const item = dataRead[index];
    const clinicName = clinics.find(c => c.id.toString() === item.clinic?.toString())?.name || "Unknown Clinic";
    const itemName = `${clinicName} - ${item.startTime} ${t("to")} ${item.endTime}`;
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

  // Custom field renderer for checkboxes
  const renderCheckboxes = (field, index, onChange, item, errors, forceShowError, readOnly) => {
    const value = item[field.name] || [];
    const errorKey = `${field.name}_${index}`;
    const error = errors[errorKey];

    return (<>
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
                    : value.filter(item => item !== option);
                  onChange(index, field.name, newValue);
                }}
                disabled={readOnly}
              />
              <label htmlFor={`${field.name}_${index}_${optIndex}`}>
                {t(`appointmentTypes.${option}`)}
              </label>
            </span>
          ))}
        </div>
        {forceShowError && error && (
          <div className="text-danger small">{error}</div>
        )}
      </div></>
    );
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
    } else if (field.type === "checkboxes") {
      return renderCheckboxes(field, index, onChange, item, errors, forceShowError, readOnly);
    } else {
      return <Field
        {...commonProps}
        type={field.type || "text"}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => onChange(index, field.name, e.target.value)}
      />;
    }
  };

  const renderFormFields = (index, item) => {
    return formFields.map((field, fIdx) => {
      const fieldComponent = getFieldComponent(field, index, handleFieldChange, item, errors, forceShowError, readOnly);

      return (
        <div
          key={field.name}
          className={`form-group ${field.half ? "form-group-half" : ""}`}
        >
          {fieldComponent}
        </div>
      );
    });
  };

  const renderItemTitle = (item) => {
    if (getItemTitle) return getItemTitle(item);
    
    const clinicName = clinics.find(c => c.id.toString() === item.clinic?.toString())?.name || t("selectClinic");
    return `${clinicName} - ${item.startTime || "00:00"} to ${item.endTime || "00:00"}`;
  };

  // === Truncate long titles ===
  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="dc-userexperience custom-accordion w-100">
      {/* Title Section */}
      {title && (
        // <div
        //   className={`${titleIcon ? "title-with-icon" : "dc-tabscontenttitle dc-addnew"} ${noHedarBefore ? "no-before" : ""}`}
        // >
        //   {titleIcon ? (
        //     <SectionTitle icon={titleIcon} title={title} />
        //   ) : (
        //     <h3>{title}</h3>
        //   )}
        //   {onAdd && (
        //     <a
        //       href="#!"
        //       onClick={(e) => {
        //         e.preventDefault();
        //         onAdd();
        //       }}
        //     >
        //       {addNewLabel}
        //     </a>
        //   )}
        // </div>
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{title}</h3>
        </div>
        <div>
          <button className="add-btn"    onClick={(e) => {e.preventDefault();onAdd();}}>
            {addNewLabel}
          </button>
        </div>
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
        <ul style={{padding:'30px'}} className=" table-card  dc-experienceaccordion accordion">
          {dataRead.map((item, index) => {
            const isSingle = false; // We don't need single accordion mode here
            const collapseClass = `dc-collapseexp ${item.isExpanded ? "show" : "hide"}`;

            return (
              <li key={item.id || index}>
                {/* Accordion Title */}
                <div
                  className={`dc-accordioninnertitle ${accordioninnertitleSize}`}
                  style={{
                    display: isSingle ? "none" : "",
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
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                        verticalAlign: "middle",
                      }}
                      title={renderItemTitle(item)}
                    >
                      {item.isNew && (
                        <span style={{ color: "#ffa500", marginRight: "8px", fontWeight: "bold" }}>
                          ({t("new")})
                        </span>
                      )}
                      {truncateTitle(renderItemTitle(item), 60)}
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
                <div className={collapseClass}>
                  <form
                    className="dc-formtheme dc-userform"
                    onSubmit={liveUpdate ? (e) => e.preventDefault() : (e) => handleSave(index, e)}
                  >
                    <fieldset>
                      <div className="form-group">
                        {renderFormFields(index, item)}
                      </div>
                      
                      {hint && (
                        <div className="form-group">
                          <span className="text-muted">{hint}</span>
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
                            {t("cancel")}
                          </button>
                          <button
                            type="submit"
                            className="second-btn"
                            style={{ margin: "11px 4px" }}
                          >
                            {item.isNew ? t("add") : t("save")}
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
          title={t("delete Slot")}
          message={t("confirmDeleteSlot", { slot: deletePopup.itemName })}
          buttons={[
            {
              text: t("cancel"),
              onClick: handleCloseDeleteConfirm,
              variant: "secondary"
            },
            {
              text: t("Delete"),
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

export default DoctorSlotsAccordion;