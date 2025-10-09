import React, { memo } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import CustomAccordion from "./CustomAccordion";

const TwoLevelAccordion = memo(({
  backgroundColor = "",
  titleBackgroundColor = "",
  title,
  addNewLabel,
  data,
  formFields,
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  onAddRecipe,
  onDeleteRecipe,
  onUpdateRecipe,
  onSaveRecipe,
  noHedarBefore = false,
}) => {

  // Toggle expand/collapse for an accordion item
 const handleEditClick = (index) => {
  setTimeout(() => {
    if (onUpdate) { 
      data.forEach((_, i) => {
        onUpdate(i, 'isExpanded', i === index ? !data[index].isExpanded : false);
      });
    }
  }, 0);
};


  // Handle input/select/textarea value changes
  const handleFieldChange = (index, field, value) => {
    if (onUpdate) {
      onUpdate(index, field, value);
    }
  };

  // Save new or existing item
  const handleSave = (index, e) => {
    e.preventDefault();
    const itemData = data[index];
    onSave(index, itemData);
  };

  // Cancel action (delete if new, collapse if existing)
  const handleCancel = (index) => {
    if (data[index].isNew) {
      onDelete(index);
    } else {
      if (onUpdate) {
        onUpdate(index, 'isExpanded', false);
      }
    }
  };

  return (
    <div className="dc-userexperience  two-level-accordion">
      {/* Accordion Header */}
      {title && (
        <div
          className={`dc-tabscontenttitle dc-addnew ${
            noHedarBefore ? "no-before" : ""
          }`}
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

      {/* Accordion List */}
      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={item.id || index}>
            {/* Item Title */}
            <div
              className="dc-accordioninnertitle medium"
              style={{
                borderColor: "#eee",
                borderLeft: item.isNew
                  ? "2px solid #ffa500"
                  : item.isExpanded
                  ? "2px solid var(--themecolor)"
                  : "",
                borderBottomLeftRadius: item.isExpanded ? "0" : "",
                backgroundColor: `${titleBackgroundColor}`,
              }}
            >
              <span>
                {item.icon && (
                  <span style={{ marginRight: "8px" }}>{item.icon}</span>
                )}
                {item.title || item.type || "New Prescription"}{" "}
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
                paddingRight: "15px",
                borderLeft: "2px solid var(--themecolor)",
                backgroundColor: `${backgroundColor}`,
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
                  {formFields.map((field, idx) => (
                    <div
                      key={idx}
                      className={`form-group ${
                        field.half ? "form-group-half" : ""
                      }`}
                    >
                      {field.type === "textarea" ? (
                        <textarea
                          className="form-control"
                          placeholder={field.placeholder}
                          value={item[field.name] || ""}
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="form-control"
                          value={item[field.name] || ""}
                          onChange={(e) =>
                            handleFieldChange(index, field.name, e.target.value)
                          }
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
                  <div className="dc-btnarea">
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
                </fieldset>
              </form>

              {/* Nested Recipes Accordion */}
              {(item.isNew || item.isExpanded) && (
                <CustomAccordion
                  accordioninnertitleSize="small"
                  noHedarBefore={true}
                  backgroundColor="var(--cardcolor)"
                  titleBackgroundColor="var(--cardcolor)"
                  title="Prescribed Medication"
                  addNewLabel="Add Prescribed Medication"
                  data={item.recipes || []}
                  formFields={[
                    {
                      name: "type",
                      type: "select",
                      options: [
                        "Medical",
                        "Follow-up",
                        "Behavioral",
                        "Communication",
                        "Administrative",
                        "Urgent",
                      ],
                      placeholder: "Select Note Type",
                      half: true,
                    },
                    {
                      name: "date",
                      type: "date",
                      placeholder: "Date",
                      half: true,
                    },
                    {
                      name: "content",
                      type: "textarea",
                      placeholder: "Note Content",
                    },
                  ]}
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
