import React, { useState } from "react";
import { FaPencilAlt, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { PiListThin } from "react-icons/pi";

const Specializations = () => {
  const { t } = useTranslation();

  const [specializations, setSpecializations] = useState([
    "Dentist",
    "Dental Surgeon",
    "Dental Surgeon"
  ]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [editingIndices, setEditingIndices] = useState([]); 
  const [editValues, setEditValues] = useState({}); 

  const handleAddSpecialization = (e) => {
    e.preventDefault();
    if (newSpecialization.trim() !== "") {
      setSpecializations([...specializations, newSpecialization]);
      setNewSpecialization("");
    }
  };

  const handleDeleteSpecialization = (index) => {
    const updatedSpecializations = specializations.filter((_, i) => i !== index);
    setSpecializations(updatedSpecializations);
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
      setEditValues({ ...editValues, [index]: specializations[index] });
    }
  };

  const handleSaveEdit = (index) => {
    const newValue = editValues[index]?.trim();
    if (!newValue) return;

    const updatedSpecializations = [...specializations];
    updatedSpecializations[index] = newValue;
    setSpecializations(updatedSpecializations);

    // اقفل بعد الحفظ
    setEditingIndices(editingIndices.filter((i) => i !== index));
  };

  const handleCancelEdit = (index) => {
    setEditingIndices(editingIndices.filter((i) => i !== index));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      handleSaveEdit(index);
    } else if (e.key === "Escape") {
      handleCancelEdit(index);
    }
  };

  return (
    <div className="dc-skills dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("specializations.title")}</h3>
      </div>
      <div className="dc-skillscontent-holder">
        <form
          className="dc-formtheme dc-skillsform"
          onSubmit={handleAddSpecialization}
        >
          <fieldset>
            <div className="form-group">
              <div className="form-group-holder">
                <input
                  type="text"
                  name="rate"
                  className="form-control"
                  placeholder={t("specializations.placeholder")}
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group dc-btnarea">
              <button type="submit" className="dc-btn">
                {t("specializations.addBtn")}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="dc-myskills">
          <ul className="sortable list">
            {specializations.map((spec, idx) => (
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
                        onClick={() => handleSaveEdit(idx)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        className="cancel-btn   same"
                        onClick={() => handleCancelEdit(idx)}
                      >
                        <FaTimes />
                      </button>
                      {/* <div class="dc-rightarea">
																	<a href="javascript:void(0);" class="dc-addinfo"><i class="lnr lnr-pencil"></i></a>
																	<a href="javascript:void(0);" class="dc-deleteinfo"><i class="lnr lnr-trash"></i></a>
																</div> */}
                               
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="skill-dynamic-html">
                     <PiListThin/> <span className="skill-val">{spec}</span>
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
                        onClick={() => handleDeleteSpecialization(idx)}
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

export default Specializations;
