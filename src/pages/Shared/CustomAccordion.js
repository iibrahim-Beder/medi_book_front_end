import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect } from "react";
import "../MainCss.css";

const CustomAccordion = ({
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
  
  return (
    <div className="dc-userexperience">
      {/* Header */}
     {title && <div className="dc-tabscontenttitle dc-addnew">
        <h3>{title}</h3>
        {onAdd && (
          <a href="#" onClick={onAdd}>
            {addNewLabel}
          </a>
        )}
      </div>}

      {/* Accordion List */}
      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={index}>
            {/* Accordion Item Title */}
            <div className="dc-accordioninnertitle">
              <span>
                {item.icon && <span style={{ marginRight: "8px" }}>{item.icon}</span>}
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
              style={{backgroundColor:`${backgroundColor}`}}
              className={`dc-collapseexp collapse ${
                openIndex === index ? "show" : "hide"
              }`}
            >
              <form className="dc-formtheme dc-userform">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomAccordion;
