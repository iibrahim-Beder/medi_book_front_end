import React, { memo, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import CustomAccordion from "./CustomAccordion";
import TextAreaField from "../ui/form-fields/TextAreaField";
import SelectField from "../ui/form-fields/SelectField";
import Field from "../ui/form-fields/Field";
import { useTranslation } from "react-i18next";
const TwoLevelAccordion = memo(({
  formFieldsRecipe = [], 
  backgroundColor = "",
  titleBackgroundColor = "",
  title,
  addNewLabel="Add",
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
  readOnly = false
}) => {
  // Local state for read-only mode
  const [dataRead, setDataRead] = useState(data);

  const { t } = useTranslation();

  // Keep local state in sync with parent data
  useEffect(() => {
    setDataRead(data || []);
  }, [data]);

  // Handle accordion expand/collapse
  const handleEditClick = (index) => {
    setTimeout(() => {
      if (readOnly) {
        // Update local state when in read-only mode
        setDataRead(prev =>
          prev.map((item, i) => ({
            ...item,
            isExpanded: i === index ? !item.isExpanded : false
          }))
        );
        return;
      }

      // Trigger parent update when editable
      if (onUpdate) {
        const currentData = data || [];
        currentData.forEach((_, i) => {
          onUpdate(i, "isExpanded", i === index ? !currentData[index]?.isExpanded : false);
        });
      }
    }, 0);
  };

  // Handle input/select/textarea changes
  const handleFieldChange = (index, field, value) => {
    if (onUpdate) {
      onUpdate(index, field, value);
    }
  };

  // Save current item
  const handleSave = (index, e) => {
    e.preventDefault();
    const currentData = data || [];
    const itemData = currentData[index];
    if (onSave && itemData) {
      onSave(index, itemData);
    }
  };

  // Cancel editing (remove new item or collapse existing one)
  const handleCancel = (index) => {
    const currentData = data || [];
    if (currentData[index]?.isNew) {
      if (onDelete) {
        onDelete(index);
      }
    } else {
      if (onUpdate) {
        onUpdate(index, "isExpanded", false);
      }
    }
  };

  // Choose data source depending on read-only mode
  const accordionData = readOnly ? dataRead : data;

  return (
    <div className="dc-userexperience two-level-accordion">
      {/* Accordion Header */}
      {title && (
        <div
          className={`dc-tabscontenttitle dc-addnew ${noHedarBefore ? "no-before" : ""}`}
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

      {/* Accordion Items */}
      <ul className="dc-experienceaccordion accordion">
        {(accordionData || []).map((item, index) => (
          <li key={item.id || index}>
            {/* Item Header */}
            <div
              className={`dc-accordioninnertitle ${readOnly ? "" : "medium"} `}
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
              <span>
                {item.icon && (
                  <span style={{ marginRight: "8px" }}>{item.icon}</span>
                )}
                {/* Display medication name or default title */}
                {item.medication || item.title || item.type || "New Prescription"}{" "}
                <em>{item.date}</em>
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
                {onDelete && (
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(index);
                    }}
                    className="dc-deleteinfo"
                  >
                    <IoTrashOutline />
                  </a>
                )}
              </div>
            </div>

            {/* Item Content */}
            <div
              style={{
                borderLeft: "2px solid var(--themecolor)",
                backgroundColor: backgroundColor,
              }}
              className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
            >
              {/* Editable Form */}
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
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }
                          placeholder={field.placeholder}
                          icon={field.icon}
                          disabled={readOnly}
                        />
                        
                      ) : field.type === "select" ? (
                        <SelectField
                          label={field.label}
                          disabled={readOnly}
                          className="form-control"
                          value={item[field.name] || ""}
                          name={field.name}
                          options={field.options}
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }

                        />
                      ) : field.type === "number" ? (
                        <input
                          disabled={readOnly}
                          type="number"
                          className="form-control"
                          placeholder={field.placeholder}
                          value={item[field.name] || ""}
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }
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
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                  { !readOnly &&
                  <div className="dc-btnarea">
                    <button
                      type="button"
                      // className="btn-simple"
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
                      {item.isNew ? "Add" : "Save"}
                    </button>
                  </div>}
                </fieldset>
              </form>

              {/* Nested Accordion for Medication Details */}
              {(item.isNew || item.isExpanded) && (
                <CustomAccordion
                  readOnly={readOnly}
                  accordioninnertitleSize="small"
                  noHedarBefore={true}
                  backgroundColor="var(--cardcolor)"
                  titleBackgroundColor="var(--cardcolor)"
                  title="Prescribed Medication"
                  addNewLabel="Add Medication Detail"
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
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default TwoLevelAccordion;