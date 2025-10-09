import React, { memo } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import TwoLevelAccordion from "./TwoLevelAccordion";
import EditableList from "./EditableList";
import DiagnosedConditionsAccordion from "../appointment-management/tabs/DiagnosedConditionsAccordion";

const NestedAccordion = memo(({
  backgroundColor = "",
  title,
  addNewLabel,
  data,
  formFields,
  onAdd,
  onDelete,
  onUpdate,
  onSave,
  onToggleExpansion,
  onAddNote,
  onDeleteNote,
  onAddPrescription,
  onDeletePrescription,
  onUpdatePrescription,
  onSavePrescription,
  onAddRecipe,
  onDeleteRecipe,
  onUpdateRecipe,
  onSaveRecipe,
  // Diagnosed Conditions
    onAddCondition,
  onDeleteCondition,
  onUpdateCondition,
  onSaveCondition,
}) => {

  // Toggle accordion expansion for editing
  const handleEditClick = (index) => {
    if (onToggleExpansion) {
      onToggleExpansion(index);
    }
  };

  // Update single field value
  const handleFieldChange = (index, field, value) => {
    if (onUpdate) {
      onUpdate(index, field, value);
    }
  };

  // Save item (new or existing)
  const handleSave = (index, e) => {
    e.preventDefault();
    const itemData = data[index];
    onSave(index, itemData);
  };

  // Cancel: remove if new, collapse if existing
  const handleCancel = (index) => {
    if (data[index].isNew) {
      onDelete(index);
    } else {
      if (onToggleExpansion) {
        onToggleExpansion(index);
      }
    }
  };

 return (
    <div className="dc-userexperience nested-accordion">
      {/* Section Header */}
      {title && (
        <div className="dc-tabscontenttitle no-before-line dc-addnew">
          <h3>{title}</h3>
          {onAdd && (
            <a href="!#" onClick={(e) => { e.preventDefault(); onAdd(); }}>
              {addNewLabel}
            </a>
          )}
        </div>
      )}

      {/* Accordion List */}
      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={item.id || index}>
            {/* Accordion Item Header */}
            <div
              className="dc-accordioninnertitle"
              style={{ 
                borderColor: "#eee",
                borderLeft: item.isNew ? "2px solid #ffa500" : "", 
                borderBottomRightRadius:`${item.isExpanded ? "0" : ""}`,
                borderBottomLeftRadius:`${item.isExpanded ? "0" : ""}`,
              }}
            >
              <span>
                {item.icon && (
                  <span style={{ marginRight: "8px" }}>{item.icon}</span>
                )}
                {item.DiagnosisName || item.type || "New Diagnosis"} <em>{item.date}</em>
                {item.isNew && <span style={{color: '#ffa500', marginLeft: '8px'}}>(New)</span>}
              </span>
              <div className="dc-rightarea">
                {/* Edit Button */}
                <a
                  href="#!"
                  onClick={(e) => { e.preventDefault(); handleEditClick(index); }}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a>
                {/* Delete Button */}
                {onDelete && (
                  <a
                    href="#!"
                    onClick={(e) => { e.preventDefault(); onDelete(index); }}
                    className="dc-deleteinfo"
                  >
                    <IoTrashOutline />
                  </a>
                )}
              </div>
            </div>

            {/* Accordion Item Content */}
            <div
              style={{
                backgroundColor: backgroundColor,
                borderRight: "1px solid #eee",
                borderLeft: "1px solid #eee",
                borderBottom: `${ index === data.length - 1 ? "1px solid #eee" : "" }`,
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
                      className={`form-group ${field.half ? "form-group-half" : ""}`}
                    >
                      {field.type === "textarea" ? (
                        <textarea
                          className="form-control"
                          placeholder={field.placeholder}
                          value={item[field.name] || ""}
                          onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="form-control"
                          value={item[field.name] || ""}
                          onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
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
                          onChange={(e) => handleFieldChange(index, field.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                  {/* Buttons for existing item */}
                  {!item.isNew && <div className="dc-btnarea">
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
                      Save
                    </button>
                  </div>}
                </fieldset>
              </form>

              {/* Nested Content (Diagnosed Conditions + Notes + Prescriptions) */}
              {(item.isNew || item.isExpanded) && (
  <>
    {/* Diagnosed Conditions Section */}
    <DiagnosedConditionsAccordion
      noHedarBefore={true}
      backgroundColor="#fcfcfc"
      title="Diagnosed Conditions"
      addNewLabel="Add Condition"
      data={item.conditions || []}
      onAdd={() => onAddCondition(index)}
      onDelete={(conditionIndex) => onDeleteCondition(index, conditionIndex)}
      onUpdate={(conditionIndex, field, value) => onUpdateCondition(index, conditionIndex, field, value)}
      onSave={(conditionIndex, conditionData) => onSaveCondition(index, conditionIndex, conditionData)}
    />

                  {/* Notes Section */}
                  <div className="dc-notes"> 
                    <EditableList
                      btnClass="second-btn"
                      headerComponent={
                        <div className="dc-tabscontenttitle no-before-line dc-addnew">
                          <h3>Notes</h3>
                        </div>
                      }
                      title="Notes"
                      placeholder="Enter note..."
                      addBtnText="Add"
                      onAddItem={(note) => onAddNote(index, note)}
                      onDeleteItem={(noteIndex) => onDeleteNote(index, noteIndex)}
                      initialItems={item.notes || []}
                      fieldKey="note"
                      minItems={0}
                    />
                  </div>

                  {/* Prescriptions with nested recipes */}
                  <TwoLevelAccordion
                    noHedarBefore={true}
                    backgroundColor="#fcfcfc"
                    title="Prescription"
                    addNewLabel="Add Prescription"
                    data={item.prescriptions || []}
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
                    onAdd={() => onAddPrescription(index)}
                    onDelete={(prescriptionIndex) => onDeletePrescription(index, prescriptionIndex)}
                    onUpdate={(prescriptionIndex, field, value) => onUpdatePrescription(index, prescriptionIndex, field, value)}
                    onSave={(prescriptionIndex, prescriptionData) => onSavePrescription(index, prescriptionIndex, prescriptionData)}
                    onAddRecipe={(prescriptionIndex) => onAddRecipe(index, prescriptionIndex)}
                    onDeleteRecipe={(prescriptionIndex, recipeIndex) => onDeleteRecipe(index, prescriptionIndex, recipeIndex)}
                    onUpdateRecipe={(prescriptionIndex, recipeIndex, field, value) => onUpdateRecipe(index, prescriptionIndex, recipeIndex, field, value)}
                    onSaveRecipe={(prescriptionIndex, recipeIndex, recipeData) => onSaveRecipe(index, prescriptionIndex, recipeIndex, recipeData)}
                  />
                </>
              )}
              {/* Buttons for new item */}
              {item.isNew && <div className="dc-btnarea">
                <button 
                  type="button" 
                  className="dc-btn dc-cancel-btn" 
                  onClick={() => handleCancel(index)}
                  style={{ margin: "11px 4px" }}
                >
                  Cancel
                </button>
                <button 
                  onClick={(e) => handleSave(index, e)}
                  type="submit" 
                  className="dc-btn" 
                  style={{ margin: "11px 4px" }}
                >
                  Add Diagnosis
                </button>
              </div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default NestedAccordion;