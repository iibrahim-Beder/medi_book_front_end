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
  fieldKey = "value", // The key to use for each item
  btnClass="dc-btn"
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState("");
  const [editingIds, setEditingIds] = useState([]);
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
    const newObj = {
      id: Date.now(),
      [fieldKey]: newItem.trim(),
    };
    updateParent([...items, newObj]);
    setNewItem("");
  };

  const handleDelete = (id) => {
    const updated = items.filter((it) => it.id !== id);
    updateParent(updated);
    setEditingIds(editingIds.filter((i) => i !== id));
    const updatedValues = { ...editValues };
    delete updatedValues[id];
    setEditValues(updatedValues);
  };

  const handleEditClick = (id, item) => {
    if (editingIds.includes(id)) {
      setEditingIds(editingIds.filter((i) => i !== id));
    } else {
      setEditingIds([...editingIds, id]);
      setEditValues({ ...editValues, [id]: { ...item } });
    }
  };

  const handleSave = (id) => {
    const newValue = editValues[id]?.[fieldKey]?.trim();
    if (!newValue) return;
    const updated = items.map((it) =>
      it.id === id ? { ...it, [fieldKey]: newValue } : it
    );
    updateParent(updated);
    setEditingIds(editingIds.filter((i) => i !== id));
  };

  const handleCancel = (id) => {
    setEditingIds(editingIds.filter((i) => i !== id));
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") handleSave(id);
    else if (e.key === "Escape") handleCancel(id);
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
            <div className="form-group input">
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
              <button
                style={{ maxWidth: "170px", padding: "0" }}
                type="submit"
                className={btnClass}
              >
                {addBtnText}
              </button>
            </div>
          </fieldset>
        </form>
         {/* error message */}
        {error && (
          <p className="error-text" style={{  color: "red", margin:"10px" }}>
            {error}
          </p>
        )}

        <div className="dc-myskills">
          <ul className="sortable list">
            {items.map((item) => (
              <li key={item.id}>
                {editingIds.includes(item.id) ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      className="edit-input"
                      value={editValues[item.id]?.[fieldKey] || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [item.id]: {
                            ...editValues[item.id],
                            [fieldKey]: e.target.value,
                          },
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      autoFocus
                    />
                    <div className="edit-actions same">
                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => handleSave(item.id)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        className="cancel-btn same"
                        onClick={() => handleCancel(item.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="skill-dynamic-html">
                      <PiListThin />{" "}
                      <span className="skill-val">{item[fieldKey]}</span>
                    </span>
                    <div className="dc-rightarea">
                      <a
                        className="dc-addinfo dc-skillsaddinfo"
                        onClick={() => handleEditClick(item.id, item)}
                      >
                        <FaPencilAlt />
                      </a>
                      <a
                        className="dc-deleteinfo"
                        onClick={() => handleDelete(item.id)}
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

    
      </div>
    </div>
  );
};

export default EditableList;
