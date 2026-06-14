import React, { memo, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import CustomAccordion from "./CustomAccordion";
import TextAreaField from "../ui/form-fields/TextAreaField";
import SelectField from "../ui/form-fields/SelectField";
import Field from "../ui/form-fields/Field";
import { useTranslation } from "react-i18next";
import PopupMessage from "./PopupMessage"; 

const TwoLevelAccordion = memo(({
  formFieldsRecipe = [],
  backgroundColor = "",
  titleBackgroundColor = "",
  title,
  addNewLabel = "Add",
  data = [],
  formFields = [],
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  onAddRecipe,
  onDeleteRecipe,
  onUpdateRecipe,
  onSaveRecipe,
  noHedarBefore = false,
  readOnly = false,
  getItemTitleRecipe ,
  isHasMatched = () => false,
  searchTerm ="",
  forceShowError = false,
}) => {
  const [dataRead, setDataRead] = useState(data);
  const [deletePopup, setDeletePopup] = useState({ show: false, index: null, itemName: "" });
  const { t } = useTranslation();

  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  // === Delete Confirmation ===
  const handleShowDeleteConfirm = (index) => {
    const item = data[index] || dataRead[index];
    const itemName = item.title || item.MedicationName || item.type || "Prescription";
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
            isExpanded: i === index ? !item.isExpanded : false
          }))
        );
        return;
      }
      const currentData = data || [];
      const item = currentData[index];
      if (item?.isExpanded === true) {
        item._initialTitle = renderItemTitle(item);
      }

      if (onUpdate) {
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

  const accordionData = readOnly ? dataRead : data;
  const renderItemTitle = (item) => {
    return item.title || item.medication || item.type || "New Prescription";
  };

  return (
    <div className="dc-userexperience two-level-accordion">
      {/* Header */}
      {title && (
        <div
          className={`dc-tabscontenttitle dc-addnew ${noHedarBefore ? "no-before" : ""}`}
          style={{ backgroundColor: titleBackgroundColor }}
        >
          <h3>{title}</h3>
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

      {/* Items */}
      <ul className="dc-experienceaccordion accordion">
        {(accordionData || []).map((item, index) => {

          if (!item._initialTitle) {
            item._initialTitle = renderItemTitle(item);
          }

          return (
            <li key={item.id || index}>
              <div
                className={` ${(isHasMatched(item,"main")) ||item.hasMedicationMatch ? "has-match-inner" : ""}  dc-accordioninnertitle ${readOnly ? "" : "medium"}`}
                style={{
                  borderColor: "#eee",
                  borderLeft: item.isNew
                    ? "2px solid #ffa500"
                    : item.isExpanded
                    ? "2px solid var(--themecolor)"
                    : "",
                  borderBottomLeftRadius: item.isExpanded ? "0" : "",
                  backgroundColor: titleBackgroundColor,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "98%",
                      display: "inline-block",
                    }}
                    title={renderItemTitle(item)}
                  >
                {item.isNew && (
                    <span  style={{ color: "#ffa500", fontWeight: "bold",margin:"0 5px", fontSize: "0.9em" }}>
                      (New)
                    </span>
                  )}
                    {item.isExpanded ? item._initialTitle : renderItemTitle(item)}

                  {item.date && <em style={{ color: "#666", fontSize: "0.9em" }}>{item.date}</em>}
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

              {/* Item Body */}
              <div
                style={{
                  borderLeft: "2px solid var(--themecolor)",
                  backgroundColor: backgroundColor,
                }}
                className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
              >
                {/* Form */}
                <form
                  className="dc-formtheme dc-userform"
                  style={{ marginBottom: "20px" }}
                  onSubmit={(e) => handleSave(index, e)}
                >
                  <fieldset>
                    {(formFields || []).map((field, idx) => (
                      <div
                        key={idx}
                        className={`form-group ${field.half ? "form-group-half" : ""}`}
                      >
                        {field.type === "textarea" ? (
                          <TextAreaField
                            label={field.label}
                            name={field.name}
                            value={item[field.name] || ""}
                            onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                            placeholder={field.placeholder}
                            icon={field.icon}
                            disabled={readOnly}
                            isHasMatched={isHasMatched(item,field.name)||false}
                            searchTerm={searchTerm}

                          />
                        ) : field.type === "select" ? (
                          <SelectField
                            label={field.label}
                            disabled={readOnly}
                            value={item[field.name] || ""}
                            name={field.name}
                            options={field.options}
                            onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                            isHasMatched={isHasMatched(item,field.name)||false}
                            searchTerm={searchTerm}
                          />
                        ) : field.type === "number" ? (
                          <input
                            disabled={readOnly}
                            type="number"
                            className="form-control"
                            placeholder={field.placeholder}
                            value={item[field.name] || ""}
                            onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                            min="0"
                          />
                        ) : (
                          <Field
                            label={field.label}
                            disabled={readOnly}
                            type={field.type}
                            className="form-control"
                            placeholder={field.placeholder}
                            value={item[field.name] || ""}
                            onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                            isHasMatched={isHasMatched(item,field.name)||false}
                            searchTerm={searchTerm}
                          />
                        )}
                      </div>
                    ))}

                    {!readOnly && (
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
                          {item.isNew ? t("Add") : t("Save")}
                        </button>
                      </div>
                    )}
                  </fieldset>
                </form>

                {/* Nested Medications */}
                {(item.isNew || item.isExpanded) && (
                  <CustomAccordion
                   getItemTitle={getItemTitleRecipe}
                    readOnly={readOnly}
                    accordioninnertitleSize="small"
                    noHedarBefore={true}
                    backgroundColor="var(--cardcolor)"
                    titleBackgroundColor="var(--cardcolor)"
                    title={t("Prescribed Medication")}
                    addNewLabel={t("Add Medication Detail")}
                    data={item.recipes || []}
                    formFields={formFieldsRecipe}
                    onAdd={() => onAddRecipe(index)}
                    onDelete={(recipeIndex) => onDeleteRecipe(index, recipeIndex)}
                    onUpdate={(recipeIndex, field, value) =>
                      onUpdateRecipe(index, recipeIndex, field, value)
                    }
                    onSave={(recipeIndex, recipeData) =>
                      onSaveRecipe(index, recipeIndex, recipeData)
                    }
                   isHasMatched={isHasMatched}
                   searchTerm={searchTerm}
                   forceShowError={forceShowError}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <PopupMessage
          type="danger"
          title={t("Delete Prescription")}
          message={`${t("Are you sure you want to delete")} "${deletePopup.itemName}"? ${t("This action cannot be undone.")}`}
          buttons={[
            {
              text: t("Cancel"),
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

export default TwoLevelAccordion;
