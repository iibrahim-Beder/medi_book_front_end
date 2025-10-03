import React, { use, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect } from "react";
import "../MainCss.css";
import TwoLevelAccordion from "./TwoLevelAccordion";
import EditableList from "./EditableList";

const NestedAccordion = ({
  backgroundColor="",
  title,
  addNewLabel,
  data,
  formFields,
  onAdd,
  onDelete,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
useEffect(() => {
  setOpenIndex(null);
}, [data]);

  const handleEditClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
   const [Notes ,setNotes] = useState ([
  {
    "id": 1,
    "note": "Patient requested to reschedule the appointment to 5:00 PM",
    "createdAt": "2025-10-02T14:30:00"
  },
  {
    "id": 2,
    "note": "Patient is allergic to penicillin, please consider when prescribing",
  }
]);
    
  return (
    <div className="dc-userexperience nested-accordion">
      {/* Header */}
      {title && (
        <div className="dc-tabscontenttitle no-before-line dc-addnew">
          <h3>{title}</h3>
          {onAdd && (
            <a href="!#" onClick={onAdd}>
              {addNewLabel}
            </a>
          )}
        </div>
      )}

      {/* Accordion List */}
      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={index}>
            {/* Accordion Item Title */}
            <div
              className="dc-accordioninnertitle"
              style={{ borderColor: "#eee" }}
            >
              <span>
                {item.icon && (
                  <span style={{ marginRight: "8px" }}>{item.icon}</span>
                )}
                {item.title || item.type} <em>{item.date}</em>
              </span>
              <div className="dc-rightarea">
                {/* Edit button */}
                <a
                  href="#!"
                  onClick={() => handleEditClick(index)}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a>
                {/* Delete button */}
                {onDelete && (
                  <a
                    href="#!"
                    onClick={() => onDelete(index)}
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
                border: "1px solid #eee",
                borderTop:
                  openIndex === data.length - 1 && openIndex === index
                    ? "none"
                    : "1px solid #eee",
                borderBottom:
                  openIndex !== null &&
                  openIndex === index &&
                  openIndex !== data.length - 1
                    ? "none"
                    : "1px solid #eee",
              }}
              className={`dc-collapseexp collapse ${
                openIndex === index ? "show" : "hide"
              }`}
            >
              <form
                className="dc-formtheme dc-userform "
                style={{ marginBottom: "20px" }}
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
                          defaultValue={item[field.name] || ""}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="form-control"
                          defaultValue={item[field.name] || ""}
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
                          defaultValue={item[field.name] || ""}
                        />
                      )}
                    </div>
                  ))}
                  <button type="submit" className="second-btn" style={{ float: "inline-end",margin:" 11px 4px"}}>
                    Save
                  </button>
                </fieldset>
              </form>
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
                initialItems={[
                  { id: 1, note: "Patient requested reschedule" },
                  { id: 2, note: "Allergic to penicillin" },
                ]}
                fieldKey="note"
                minItems={0}
              />{" "}
             </div>
              <TwoLevelAccordion
                noHedarBefore={true}
                backgroundColor="#fcfcfc"
                title="Medical Prescriptions"
                addNewLabel="Add Prescription"
                data={[
                  {
                    type: "Medical",
                    icon: "",
                    date: "2025-09-13",
                    content: "Patient requires monitoring.",
                  },
                  {
                    type: "Follow-up",
                    icon: "",
                    date: "2025-09-10",
                    content: "Schedule follow-up in 2 weeks.",
                  },
                ]}
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
                onAdd={() => alert("Add Note")}
                onDelete={(index) => alert("Delete note " + index)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NestedAccordion;
