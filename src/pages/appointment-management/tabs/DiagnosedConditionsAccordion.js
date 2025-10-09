import React, { memo } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import DropdownWithSearch from "../../shared/DropdownWithSearch";
import SelectField from "../../ui/form-fields/SelectField";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import "../../MainCss.css";

const DiagnosedConditionsAccordion = memo(({
  titleBackgroundColor = "",
  backgroundColor = "",
  title = "Diagnosed Conditions",
  data,
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  noHedarBefore = true,
  accordioninnertitleSize = "",
  addNewLabel = "Add New Condition",
}) => {

  const handleEditClick = (index) => {
    setTimeout(() => {
      if (onUpdate) {
        data.forEach((_, i) => {
          onUpdate(i, 'isExpanded', i === index ? !data[index].isExpanded : false);
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
    if (onSave) onSave(index, data[index]);
  };

  const handleCancel = (index) => {
    if (data[index].isNew) {
      onDelete(index);
    } else {
      onUpdate(index, 'isExpanded', false);
    }
  };

  return (
    <div className="dc-userexperience">
      {/* Header */}
      <div 
        className={`dc-tabscontenttitle dc-addnew ${noHedarBefore ? "no-before" : ""}`}
        style={{ backgroundColor: titleBackgroundColor }}
      >
        <h3>{title}</h3>
        {onAdd && (
          <a href="#!" onClick={(e) => { e.preventDefault(); onAdd(); }}>
            {addNewLabel}
          </a>
        )}
      </div>

      {/* Accordion List */}
      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={item.id || index}>
            {/* Accordion Title */}
            <div
              className={`dc-accordioninnertitle ${accordioninnertitleSize}`}
              style={{
                backgroundColor: titleBackgroundColor,
                borderColor: noHedarBefore ? "#eee" : "",
                borderLeft: item.isNew ? "2px solid #ffa500" : ""
              }}
            >
              <span>
                {item.title || item.type || "New Condition"} <em>{item.date}</em>
                {item.isNew && <span style={{color: '#ffa500', marginLeft: '8px'}}>(New)</span>}
              </span>
              <div className="dc-rightarea">
                <a
                  href="#!"
                  onClick={(e) => { e.preventDefault(); handleEditClick(index); }}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a>
                {onDelete && (
                  <a
                    href="#!"
                    onClick={(e) => { e.preventDefault(); onDelete(index); }}
                    className="dc-deleteinfo"
                    style={{ marginLeft: "8px" }}
                  >
                    <IoTrashOutline />
                  </a>
                )}
              </div>
            </div>

            {/* Accordion Content */}
            <div 
              style={{ backgroundColor: backgroundColor }}
              className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
            >
              <form onSubmit={(e) => handleSave(index, e)}>
                <fieldset>
                  {/* MedicalCondition */}
                  <div className="form-group">
                    <DropdownWithSearch
                      label="Medical Condition"
                      options={item.medicalOptions || []}
                      value={item.MedicalCondition || ""}
                      onChange={(val) => handleFieldChange(index, "MedicalCondition", val)}
                    />
                  </div>

                  {/* Severity with SelectField */}
                  <SelectField
                    label="Severity"
                    name="Severity"
                    value={item.Severity || ""}
                    onChange={(e) => handleFieldChange(index, "Severity", e.target.value)}
                    options={[
                      { value: "", label: "Select Severity" },
                      { value: "Mild", label: "Mild" },
                      { value: "Moderate", label: "Moderate" },
                      { value: "Severe", label: "Severe" },
                    ]}
                  />

                  {/* Notes with TextAreaField */}
                  <TextAreaField
                    label="Notes"
                    name="Notes"
                    value={item.Notes || ""}
                    onChange={(e) => handleFieldChange(index, "Notes", e.target.value)}
                    placeholder="Enter additional notes"
                  />

                  {/* Buttons */}
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
                </fieldset>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default DiagnosedConditionsAccordion;
