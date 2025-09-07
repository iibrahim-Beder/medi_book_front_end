import React, { useState } from "react";
import { FaPencilAlt, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { PiListThin } from "react-icons/pi";
import { useTranslation } from "react-i18next";
const EditableList = ({
  title = "Items",
  placeholder = "Enter item...",
  addBtnText = "Add",
  initialItems = [],
  minItems = 1,
  headerComponent = null, 
  errorMessage,           
  onChange,
}) => {

  const { t } = useTranslation();
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState("");
  const [editingIndices, setEditingIndices] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState("");

  const getErrorMessage = () => {
    if (typeof errorMessage === "function") {
      return errorMessage(minItems); 
    }
    if (typeof errorMessage === "string") {
      return errorMessage; 
    }
    return t("validation.dynamic.minItems", { minItems });
  };

  const updateParent = (updated) => {
    setItems(updated);
    if (onChange) onChange(updated);

    if (updated.length < minItems) {
      setError(getErrorMessage());
    } else {
      setError("");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim() === "") {
      setError(t("validation.dynamic.required"));
      return;
    }
    updateParent([...items, newItem.trim()]);
    setNewItem("");
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    updateParent(updated);
    setEditingIndices(editingIndices.filter((i) => i !== index));
    const updatedValues = { ...editValues };
    delete updatedValues[index];
    setEditValues(updatedValues);
  };

  const handleEditClick = (index) => {
    if (editingIndices.includes(index)) {
      setEditingIndices(editingIndices.filter((i) => i !== index));
    } else {
      setEditingIndices([...editingIndices, index]);
      setEditValues({ ...editValues, [index]: items[index] });
    }
  };

  const handleSave = (index) => {
    const newValue = editValues[index]?.trim();
    if (!newValue) return;
    const updated = [...items];
    updated[index] = newValue;
    updateParent(updated);
    setEditingIndices(editingIndices.filter((i) => i !== index));
  };

  const handleCancel = (index) => {
    setEditingIndices(editingIndices.filter((i) => i !== index));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") handleSave(index);
    else if (e.key === "Escape") handleCancel(index);
  };

  return (
    <div className="dc-skills dc-tabsinfo">
   {headerComponent ? (
  headerComponent
) : (
  <div className="dc-tabscontenttitle">
    <h3>{title}</h3>
  </div>
)}

      <div className="dc-skillscontent-holder">
        <form className="dc-formtheme dc-skillsform" onSubmit={handleAdd}>
          <fieldset>
            <div className="form-group">
              <div className="form-group-holder">
                <input
                  type="text"
                  name="rate"
                  className="form-control"
                  placeholder={placeholder}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
              </div>
            </div>
               <div className="form-group dc-btnarea">
              <button style={{maxWidth: "170px", padding:"0"}} type="submit" className="dc-btn">
                {addBtnText}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="dc-myskills">
          <ul className="sortable list">
            {items.map((item, idx) => (
              <li key={idx}>
                {editingIndices.includes(idx) ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      className="edit-input"
                      value={editValues[idx] || ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, [idx]: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      autoFocus
                    />
                    <div className="edit-actions same">
                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => handleSave(idx)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        className="cancel-btn same"
                        onClick={() => handleCancel(idx)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="skill-dynamic-html">
                      <PiListThin /> <span className="skill-val">{item}</span>
                    </span>
                    <div className="dc-rightarea">
                      <a
                        className="dc-addinfo dc-skillsaddinfo"
                        onClick={() => handleEditClick(idx)}
                      >
                        <FaPencilAlt />
                      </a>
                      <a
                        className="dc-deleteinfo"
                        onClick={() => handleDelete(idx)}
                      >
                        <FaTrash />
                      </a>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* error message */}
        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default EditableList;
