import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect } from "react";
import "../MainCss.css";
import CustomAccordion from "./CustomAccordion";

const TwoLevelAccordion = ({
  backgroundColor="",
  title,
  addNewLabel,
  data,
  formFields,
  onAdd,
  onDelete,
  noHedarBefore = false,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
useEffect(() => {
  setOpenIndex(null);
}, [data]);

  const handleEditClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="dc-userexperience">
      {/* Header */}
      {title && (
        <div
          className={`dc-tabscontenttitle dc-addnew ${
            noHedarBefore ? "no-before" : ""
          }`}
        >
          <h3>{title}</h3>
          {onAdd && (
            <a href="#" onClick={onAdd}>
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
              className="dc-accordioninnertitle medium"
              style={{
                borderColor: "#eee",
                borderLeft:
                  openIndex === index ? "2px solid var(--themecolor)" : "",
                borderBottomLeftRadius: openIndex === index ? "0" : "",
                backgroundColor: "#fcfcfc",
              }}
            >
              <span>
                {item.icon && (
                  <span style={{ marginRight: "8px" }}>{item.icon}</span>
                )}
                {item.title || item.type} <em>{item.date}</em>
              </span>
              <div className="dc-rightarea">
                {/* Edit button */}
                {/* <a
                  href="#!"
                  onClick={() => handleEditClick(index)}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a> */}
                {/* Delete button */}
                {/* {onDelete && (
                  <a
                    href="#!"
                    onClick={() => onDelete(index)}
                    className="dc-deleteinfo"
                  >
                    <IoTrashOutline />
                  </a> */}
                {/* )} */}

                      <button className="view-btn btn btn-outline-primary btn-sm edit" onClick={() => handleEditClick(index)} style={{ backgroundColor:`${openIndex === index ? "#3fabf3" : ""}`, color:`${openIndex === index ? "#fff" : "#55acee"}`}} >
                  {openIndex === index ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {/* Accordion Item Content */}
            <div
              style={{
                borderColor: "#eee",
                borderLeft: "2px solid var(--themecolor)",
                backgroundColor: `${backgroundColor}`,
              }}
              className={`dc-collapseexp collapse ${
                openIndex === index ? "show" : "hide"
              }`}
            >
              <form
                className="dc-formtheme dc-userform"
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
                </fieldset>
              </form>
              <CustomAccordion
                accordioninnertitleSize="small"
                noHedarBefore={true}
                backgroundColor="#fff"
                titleBackgroundColor="#fff"
                title="Recipes"
                addNewLabel="Add Recipe"
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

export default TwoLevelAccordion;
