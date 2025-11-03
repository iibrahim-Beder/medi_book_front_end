import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { FaClinicMedical, FaCalendarDay, FaExchangeAlt, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import CustomAccordion from "../../shareds/CustomAccordion";
import PopupMessage from "../../shareds/PopupMessage";

const ShiftsAccordion = memo(({
  shifts = [],
  clinics = [],
  daysOfWeek = [],
  shiftTypes = [],
  onAddShift,
  onDeleteShift,
  onUpdateShift,
  onSaveShift,
  ComponentProp = null,
  header = true,
  regist = false,
  allowMultipleOpen = false,
}) => {
  const { t } = useTranslation();
  const [dataRead, setDataRead] = useState([]);
  const [deletePopup, setDeletePopup] = useState({ show: false, index: null, itemName: "" });

  useEffect(() => {
    const formattedData = shifts.map(shift => ({
      ...shift,
      id: shift.id,
      isExpanded: shift.isExpanded || false,
      isNew: shift.isNew || false,
    }));
    setDataRead(formattedData);
  }, [shifts]);

  const getShiftTitle = (shift) => {
    const clinicName = clinics.find(c => c.id?.toString() === shift.clinic?.toString())?.name || t("shifts.select_clinic");
    const day = shift.day || t("shifts.select_day");
    const shiftType = shift.shiftType || "";
   
    let title = `${clinicName} - ${day}`;
    if (shiftType) {
      title += ` - ${shiftType}`;
    }
    return title;
  };

  const handleShowDeleteConfirm = (index) => {
    const item = dataRead[index];
    const itemName = getShiftTitle(item);
    setDeletePopup({ show: true, index, itemName });
  };

  const handleCloseDeleteConfirm = () => {
    setDeletePopup({ show: false, index: null, itemName: "" });
  };

  const handleConfirmDelete = () => {
    if (deletePopup.index !== null && onDeleteShift) {
      const shiftId = dataRead[deletePopup.index]?.id;
      if (shiftId) {
        onDeleteShift(shiftId);
      }
    }
    handleCloseDeleteConfirm();
  };

  const handleEditClick = (index) => {
    const clickedShift = dataRead[index];
    const newExpandedState = !clickedShift.isExpanded;
    const updatedData = dataRead.map((item, i) => ({
      ...item,
      isExpanded: i === index ? newExpandedState : (allowMultipleOpen ? item.isExpanded : false)
    }));
   
    setDataRead(updatedData);
    updatedData.forEach((item, i) => {
      if (onUpdateShift && item.id) {
        onUpdateShift(item.id, "isExpanded", item.isExpanded);
      }
    });
  };

  const handleFieldChange = (index, field, value) => {
    if (onUpdateShift) {
      const shiftId = dataRead[index]?.id;
      if (shiftId) {
        onUpdateShift(shiftId, field, value);
      }
    }
  };

  const handleSelectChange = (index, fieldName) => (e) => {
    handleFieldChange(index, fieldName, e.target.value);
  };

  const handleInputChange = (index, fieldName) => (e) => {
    handleFieldChange(index, fieldName, e.target.value);
  };

  const handleSave = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
   
    const shiftId = dataRead[index]?.id;
    const shiftData = dataRead[index];
    if (onSaveShift && shiftData) {
      const cleanedBreaks = (shiftData.breaks || []).map(({ from, to, id }) => ({ from, to, id }));
      const shiftDataWithBreaks = {
        ...shiftData,
        breaks: cleanedBreaks
      };
     
      onSaveShift(shiftId, shiftDataWithBreaks);
    }
  };

  const handleCancel = (index) => {
    const item = dataRead[index];
    if (item?.isNew) {
      if (onDeleteShift) {
        const shiftId = dataRead[index]?.id;
        if (shiftId) {
          onDeleteShift(shiftId);
        }
      }
    } else {
      if (onUpdateShift) {
        const shiftId = dataRead[index]?.id;
        if (shiftId) {
          onUpdateShift(shiftId, "isExpanded", false);
        }
      }
    }
  };

  const handleAddBreak = (shiftId) => {
    const shiftIndex = dataRead.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return;
    const currentBreaks = dataRead[shiftIndex]?.breaks || [];
    const newBreak = {
      from: "",
      to: "",
      id: `break_${shiftId}_${Date.now()}`,
      isExpanded: true,
      isNew: true
    };
    const updatedBreaks = [...currentBreaks, newBreak];
    handleFieldChange(shiftIndex, "breaks", updatedBreaks);
  };

  const handleUpdateBreak = (shiftId, breakIndex, field, value) => {
    const shiftIndex = dataRead.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return;
    const currentBreaks = dataRead[shiftIndex]?.breaks || [];
    const updatedBreaks = currentBreaks.map((breakItem, index) =>
      index === breakIndex ? { ...breakItem, [field]: value } : breakItem
    );
    handleFieldChange(shiftIndex, "breaks", updatedBreaks);
  };

  const handleDeleteBreak = (shiftId, breakIndex) => {
    const shiftIndex = dataRead.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return;
    const currentBreaks = dataRead[shiftIndex]?.breaks || [];
    const updatedBreaks = currentBreaks.filter((_, index) => index !== breakIndex);
    handleFieldChange(shiftIndex, "breaks", updatedBreaks);
  };

  const handleSaveBreak = (shiftId, breakIndex, breakData) => {
    const shiftIndex = dataRead.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return;
    const currentBreaks = dataRead[shiftIndex]?.breaks || [];
    const updatedBreaks = currentBreaks.map((breakItem, index) =>
      index === breakIndex ? { ...breakData, isNew: false, isExpanded: false } : breakItem
    );
    handleFieldChange(shiftIndex, "breaks", updatedBreaks);
  };

  const renderFormFields = (index, item) => {
    const baseFields = [
      {
        name: "clinic",
        label: t("shifts.clinic"),
        type: "select",
        options: [
          { value: "", label: t("shifts.select_clinic") },
          ...clinics.map(c => ({ value: c.id, label: c.name }))
        ],
        value: item.clinic || '',
        icon: <FaClinicMedical />,
        isHalf: false 
      },
      {
        name: "day",
        label: t("shifts.day"),
        type: "select",
        options: [
          { value: "", label: t("shifts.select_day") },
          ...daysOfWeek.map(day => ({ value: day, label: day }))
        ],
        value: item.day || '',
        icon: <FaCalendarDay />,
        isHalf: true 
      },
      {
        name: "shiftType",
        label: t("shifts.shift_type"),
        type: "select",
        options: [
          { value: "", label: t("shifts.select_shift_type") },
          ...shiftTypes.map(type => ({ value: type, label: type }))
        ],
        value: item.shiftType || '',
        icon: <FaExchangeAlt />,
        isHalf: true 
      }
    ];

    const customTimeFields = item.shiftType === t("shiftTypes.custom") ? [
      {
        name: "customFrom",
        label: t("shifts.start_time"),
        type: "time",
        value: item.customFrom || '',
        isHalf: true
      },
      {
        name: "customTo",
        label: t("shifts.end_time"),
        type: "time",
        value: item.customTo || '',
        isHalf: true }
    ] : [];

    const allFields = [...baseFields, ...customTimeFields];
    
    return allFields.map((field, fIdx) => {
      const commonProps = {
        key: `${field.name}_${fIdx}`,
        label: field.label,
        name: `${field.name}_${index}`,
        value: field.value,
        icon: field.icon,
        half: field.isHalf, 
      };
      
      if (field.type === "select") {
        return (
          <div key={field.name} className={`form-group ${field.isHalf ? 'form-group-half' : ''}`}>
            <SelectField
              {...commonProps}
              options={field.options}
              onChange={handleSelectChange(index, field.name)}
            />
          </div>
        );
      } else {
        return (
          <div key={field.name} className={`form-group ${field.isHalf ? 'form-group-half' : ''}`}>
            <Field
              {...commonProps}
              type={field.type}
              onChange={handleInputChange(index, field.name)}
            />
          </div>
        );
      }
    });
  };

  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const renderItemTitle = (item) => {
    return getShiftTitle(item);
  };

  if (regist && dataRead.length === 1) {
    const shift = dataRead[0];
    return (
      <div className="dc-shiftsmanager dc-tabsinfo ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {ComponentProp}
          {!header && onAddShift && (
            <a href="#!" onClick={(e) => {
              e.preventDefault();
              onAddShift();
            }}>
              {t("shifts.add_shift")}
            </a>
          )}
        </div>
        <form className="dc-formtheme dc-userform" onSubmit={(e) => handleSave(0, e)}>
          <fieldset>
            <div className="form-group-wrap">
              {renderFormFields(0, shift)}
            </div>
            <div className="dc-btnarea d-flex">
              <button
                type="button"
                className="simple-btn"
                onClick={() => handleCancel(0)}
                style={{ margin: "11px 4px" }}
              >
                {t("actions.cancel")}
              </button>
              <button
                type="submit"
                className="second-btn"
                style={{ margin: "11px 4px" }}
              >
                {shift.isNew ? t("actions.add") : t("actions.save")}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  return (
    <div className="dc-shiftsmanager dc-tabsinfo two-level-accordion shifts">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("shifts.manage_shifts")}</h3>
            {onAddShift && (
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                onAddShift();
              }}>
                <FaPlus /> {t("shifts.add_shift")}
              </a>
            )}
          </div>
        )}
        {!header && onAddShift && (
          <a href="#!" onClick={(e) => {
            e.preventDefault();
            onAddShift();
          }}>
            <FaPlus /> {t("shifts.add_shift")}
          </a>
        )}
      </div>
      <ul className="dc-experienceaccordion accordion">
        {dataRead.map((item, index) => (
          <li key={item.id || index}>
            <div
              className="dc-accordioninnertitle"
              style={{
                borderColor: "#eee",
                borderLeft: item.isNew
                  ? "2px solid #ffa500"
                  // : item.isExpanded
                  // ? "2px solid var(--themecolor)"
                  : "",
                borderBottomLeftRadius: item.isExpanded ? "0" : "",
                backgroundColor: "var(--cardcolor)",
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
                onClick={() => handleEditClick(index)}
              >
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                  }}
                  title={renderItemTitle(item)}
                >
                  {truncateTitle(renderItemTitle(item), 60)}
                  {item.date && <em style={{ color: "#666", fontSize: "0.9em" }}>{item.date}</em>}
                </span>
                {item.isNew && (
                  <span style={{ color: "#ffa500", fontWeight: "bold", fontSize: "0.9em" }}>
                    ({t("status.new")})
                  </span>
                )}
              </span>
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
                {onDeleteShift && (
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
            <div
              style={{
                // borderLeft: "2px solid var(--themecolor)",
                backgroundColor: "var(--cardcolor)",
              }}
              className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
            >
              <form
                className="dc-formtheme dc-userform"
                style={{ marginBottom: "20px" }}
                onSubmit={(e) => handleSave(index, e)}
              >
                <fieldset>
                  <div className="form-group-wrap">
                    {renderFormFields(index, item)}
                  </div>
                 
                  <CustomAccordion
                    accordioninnertitleSize="small"
                    noHedarBefore={true}
                    backgroundColor="var(--badybkcolor)"
                    // titleBackgroundColor="var(--cardcolor)"
                    title={t("breaks.title")}
                    addNewLabel={t("breaks.add_break")}
                    data={item.breaks || []}
                    formFields={[
                      {
                        name: "from",
                        label: t("breaks.start_time"),
                        type: "time",
                        half: true,
                      },
                      {
                        name: "to",
                        label: t("breaks.end_time"),
                        type: "time",
                        half: true,
                      },
                    ]}
                    onAdd={() => handleAddBreak(item.id)}
                    onDelete={(breakIndex) => handleDeleteBreak(item.id, breakIndex)}
                    onUpdate={(breakIndex, field, value) => handleUpdateBreak(item.id, breakIndex, field, value)}
                    onSave={(breakIndex, breakData) => handleSaveBreak(item.id, breakIndex, breakData)}
                    allowMultipleOpen={true}
                    getItemTitle={(breakItem) => `${breakItem.from || t("breaks.start")} - ${breakItem.to || t("breaks.end")}`}
                    noDataMessage={t("breaks.no_breaks")}
                    liveUpdate={true}
                  />
                  <div className="dc-btnarea d-flex " style={{marginTop:"20px"}}>
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
                </fieldset>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {deletePopup.show && (
        <PopupMessage
          type="danger"
          title={t("popup.delete_shift_title")}
          message={t("popup.delete_shift_confirm", { name: deletePopup.itemName })}
          buttons={[
            {
              text: t("actions.cancel"),
              onClick: handleCloseDeleteConfirm,
              variant: "secondary"
            },
            {
              text: t("actions.delete"),
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

export default ShiftsAccordion;