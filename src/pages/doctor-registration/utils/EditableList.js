// src/components/EditableList.jsx

import React, { useState, useMemo, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

import { useTranslation } from "react-i18next";

import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "../../shared/SectionTitle";
import SelectField from "../../ui/form-fields/SelectField";

const EditableList = ({
  title = "Items",
  addBtnText = "Add",
  initialItems = [],
  minItems = 1,
  headerComponent = <SectionTitle title={"Specializations"} />,
  errorMessage,
  onChange,
  fieldKey = "value",
  btnClass = "dc-btn",
  options = [],
  isLoading = false,
  selectName = "select",
  selectLabel = "Select Item",
  onPrimaryChange,
  primarySpecialtyId = "",
  outError = false
}) => {
  const { t } = useTranslation();

  const [items, setItems] = useState(initialItems);
  const [selectedValue, setSelectedValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);
  const getErrorMessage = () => {
    if (typeof errorMessage === "function") return errorMessage(minItems);
    if (typeof errorMessage === "string") return errorMessage;
    return t("validation.dynamic.minItems", { minItems, title });
  };

  const updateParent = (updated) => {
    setItems(updated);
    if (onChange) onChange(updated);

    if (updated.length < minItems) setError(getErrorMessage());
    else setError("");
  };

  // filter options based on selected items
  const filteredOptions = useMemo(() => {
    const selectedValues = items.map((item) => String(item[fieldKey]));
    return options.filter((opt) => !selectedValues.includes(String(opt.value)));
  }, [options, items, fieldKey]);

  const handleAdd = (e) => {
    e.preventDefault();

    if (!selectedValue) {
      setError("Select an option first");
      return;
    }

    const selectedOption = filteredOptions.find(
      (opt) => String(opt.value) === String(selectedValue),
    );

    if (!selectedOption) return;

    const newObj = {
      id: Date.now(),
      [fieldKey]: selectedOption.value,
      label: selectedOption.label,
    };

    const updated = [...items, newObj];

    updateParent(updated);

    if (!primarySpecialtyId && updated.length === 1) {
      onPrimaryChange?.(newObj.value);
    }

    setSelectedValue("");
  };

  const handleDelete = (id) => {
    const deletedItem = items.find((it) => it.id === id);
    const updated = items.filter((it) => it.id !== id);

    updateParent(updated);

    if (
      deletedItem &&
      String(deletedItem.value) === String(primarySpecialtyId)
    ) {
      const newPrimary = updated[0]?.value || "";
      onPrimaryChange?.(newPrimary);
    }
  };
  const showPrimarySpecialty =
  (!error && !outError) || (!error && items.length > 0);

const showOutError =
  outError && !error && items.length === 0 ;

  return (
    <div className="dc-skills dc-tabsinfo">
      {headerComponent ? (
        headerComponent
      ) : (
        <div className="dc-tabscontenttitle mt-3">
          <h3>{title}</h3>
        </div>
      )}

      <div className="dc-skillscontent-holder">
        <form className="dc-formtheme dc-skillsform">
          <fieldset>
            <SelectField
              value={selectedValue}
              name={selectName}
              // label={selectLabel}
              options={[
                {
                  value: "",
                  label: "Select Specialization ",
                  disabled: true,
                },
                ...filteredOptions,
              ]}
              onChange={(e) => setSelectedValue(e.target.value)}
              disabled={isLoading || filteredOptions.length === 0}
            />

            <div className="form-group dc-btnarea pt-1">
              <button
                onClick={handleAdd}
                style={{ maxWidth: "70px", padding: "0", width:"70px", minWidth:"auto" }}
                type="submit"
                className={btnClass}
                disabled={isLoading || filteredOptions.length === 0}
              >
                {addBtnText}
              </button>
            </div>
          </fieldset>
        </form>

       {showPrimarySpecialty && (
      <span
        className="error-text"
        style={{
          height: "40px",
          color: "var(--text-sub)",
          margin: "10px",
        }}
      >
        Primary specialty <FaStar color="#ffc107" />
      </span>
    )}

    {error && (
      <span className="error-text">
        {error}
      </span>
    )}

    {showOutError && (
      <span className="error-text">
        {outError}
      </span>
    )}
        <div className="dc-myskills">
          <AnimatePresence mode="popLayout">
            <ul className="sortable list">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="view-mode">
                    <span className="skill-dynamic-html">
                      <span className="skill-val">{item.label}</span>
                    </span>

                    <div
                      className="dc-rightarea small"
                      style={{ display: "flex", gap: "8px" }}
                    >
                      <button
                        type="button"
                        onClick={() => onPrimaryChange(item.value)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color:
                            String(item.value) === String(primarySpecialtyId)
                              ? "#ffc107"
                              : "#ccc",
                          padding: "2px 9px 0",
                          fontSize: "17px",
                        }}
                      >
                        {String(item.value) === String(primarySpecialtyId) ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>

                      <a
                        className="dc-deleteinfo"
                        onClick={() => handleDelete(item.id)}
                      >
                        <IoTrashOutline />
                      </a>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EditableList;
