// CustomAccordion.jsx (نسخة معدلة)
import React, { memo, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import "../MainCss.css";
import DropdownWithSearch from "./DropdownWithSearch";
import TextAreaField from "../ui/form-fields/TextAreaField";
import Field from "../ui/form-fields/Field";
import SelectField from "../ui/form-fields/SelectField";
import FileField from "../ui/form-fields/FileField";
import SectionTitle from "./SectionTitle";
import PopupMessage from "./PopupMessage";
import { useTranslation } from "react-i18next";
import TimeRangePicker from "../making-slots/TimeRange/TimeRangePicker";
import RenderCheckboxes from "../making-slots/components/RenderCheckboxe";
import { BiSolidInfoCircle } from "react-icons/bi";
import CustomAccordionSkeleton from "./CustomAccordionSkeleton";

const CustomAccordion2 = memo(
  ({
    oneAccordion = false,
    titleBackgroundColor = "",
    backgroundColor = "",
    title,
    titleIcon,
    addNewLabel = "add",
    data = [], // external data (will be passed to editableList via sync)
    formFields = [],
    onAdd, // will call editableList.add()
    onDelete, // will call editableList.delete()
    onUpdate, // optional: for live updates
    onSave, // will call editableList.save() with item
    noHedarBefore = false,
    accordioninnertitleSize = "",
    readOnly = false,
    liveUpdate = false,
    allowMultipleOpen = false,
    getItemTitle = null,
    noDataMessage = "",
    globalError = null,
    forceShowError = false,
    hint,
    errors: externalErrors = {}, // not used directly, we use internal errors from hook
    isHasMatched = () => false,
    searchTerm,
    timeline,
    hedarClassName = "",
    handleToggle,
    applyRule,
    buttonsAvailable = true,
    isUpdateOut = false,
    MainHint = "",
    isFetching = false,
    // New: injected editableList hook
    editableList,
    titileDelete = "Delete",
  }) => {
    const { t } = useTranslation();
    const [deletePopup, setDeletePopup] = React.useState({
      show: false,
      id: null,
      itemName: "",
    });

    // Sync external data changes with the editableList hook
    useEffect(() => {
      if (editableList && data.length > 0) {
        // Only sync if data changed externally (compare ids)
        const currentIds = editableList.items.map((item) => item.id);
        const newIds = data.map((item) => item.id);
        if (JSON.stringify(currentIds) !== JSON.stringify(newIds)) {
          editableList.syncExternalItems(data);
        }
      }
    }, [data, editableList]);

    // Handle add
    const handleAdd = (e) => {
      e.preventDefault();
      if (editableList) {
        editableList.add();
      } else if (onAdd) {
        onAdd();
      }
    };

    // Handle edit (open accordion)
    const handleEditClick = (id, isExpanded) => {
      if (readOnly) return;
      if (!isExpanded && editableList) {
        editableList.edit(id);
      } else if (isExpanded && editableList) {
        editableList.cancel(id);
      }
    };

    // Handle field change
    const handleFieldChange = (id, field, value) => {
      if (editableList) {
        editableList.updateDraftField(id, field, value);
      } else if (onUpdate) {
        // Fallback for backward compatibility
        const index = data.findIndex((item) => item.id === id);
        if (index !== -1) onUpdate(index, field, value);
      }
    };

    // Handle save
    const handleSave = async (id, e) => {
      e.preventDefault();
      if (editableList) {
        const success = await editableList.save(id);
        if (success && onSave) {
          // Notify parent if needed
          const savedItem = editableList.getDisplayItem(id);
          onSave(id, savedItem);
        }
      } else if (onSave) {
        const index = data.findIndex((item) => item.id === id);
        if (index !== -1) onSave(index, data[index]);
      }
    };

    // Handle cancel
    const handleCancel = (id) => {
      if (editableList) {
        editableList.cancel(id);
      }
    };

    // Handle delete confirmation
    const handleShowDeleteConfirm = (id, item) => {
      if (readOnly) return;
      const itemName = getItemTitle ? getItemTitle(item, t) : item.title || item.type || "Item";
      setDeletePopup({ show: true, id, itemName });
    };

    const handleCloseDeleteConfirm = () => {
      setDeletePopup({ show: false, id: null, itemName: "" });
    };

    const handleConfirmDelete = async () => {
      if (deletePopup.id && editableList) {
        await editableList.delete(deletePopup.id);
        if (onDelete) onDelete(deletePopup.id);
      }
      handleCloseDeleteConfirm();
    };

    // Get items from hook or fallback to data
    const items = editableList ? editableList.items : data;
    const getErrors = (id) => (editableList ? editableList.getErrors(id) : externalErrors);

    // Render form field component
    const getFieldComponent = (field, id, item, errors, forceShowError, readOnly) => {
      const value = item[field.name];
      const error = errors[field.name];
      const commonProps = {
        label: field.label,
        name: field.name,
        value,
        icon: field.icon,
        error,
        forceShowError,
        disabled: readOnly || field.readOnly,
        placeholder: field.placeholder,
        searchTerm: searchTerm,
      };

      switch (field.type) {
        case "textarea":
          return (
            <TextAreaField
              isHasMatched={isHasMatched(item, field.name) || false}
              {...commonProps}
              onChange={(e) => handleFieldChange(id, field.name, e.target.value)}
            />
          );
        case "select":
          return (
            <SelectField
              {...commonProps}
              options={field.options}
              onChange={(e) => handleFieldChange(id, field.name, e.target.value)}
            />
          );
        case "file":
          return (
            <FileField
              {...commonProps}
              accept={field.accept}
              buttonIcon={field.buttonIcon}
              hint={field.hint}
              onChange={(e) => handleFieldChange(id, field.name, e.target.files)}
            />
          );
        case "timeRange":
          return (
            <TimeRangePicker
              timeline={timeline}
              {...commonProps}
              onChange={(e) => handleFieldChange(id, field.name, e)}
              lastActiveId={item.ruleId}
            />
          );
        case "checkboxes":
          return (
            <RenderCheckboxes
              field={field}
              onChange={(id, fieldName, value) => handleFieldChange(id, fieldName, value)}
              index={id}
              item={item}
            />
          );
        default:
          return (
            <Field
              isHasMatched={isHasMatched(item, field.name) || false}
              {...commonProps}
              type={field.type || "text"}
              min={field.min}
              max={field.max}
              disabled={readOnly || field.disabled}
              onChange={(e) => handleFieldChange(id, field.name, e.target.value)}
            />
          );
      }
    };

    const renderFormFields = (id, item) => {
      const errors = getErrors(id);
      return formFields
        .map((field) => {
          if (field.type === "dropdown") return null;
          return (
            <div
              key={field.name}
              className={`form-group ${field.half ? "form-group-half" : ""}`}
            >
              {getFieldComponent(field, id, item, errors, forceShowError, readOnly)}
            </div>
          );
        })
        .filter(Boolean);
    };

    const renderItemTitle = (item) => {
      if (getItemTitle) return getItemTitle(item, t);
      return item.title || item.type || item.medication || "New Item";
    };

    return (
      <div className="dc-userexperience custom-accordion">
        {title && (
          <div
            className={`${titleIcon ? "title-with-icon" : "dc-tabscontenttitle dc-addnew"} ${
              noHedarBefore ? "no-before" : ""
            } ${hedarClassName}`}
            style={{ backgroundColor: titleBackgroundColor }}
          >
            {titleIcon ? (
              <SectionTitle icon={titleIcon} title={title} />
            ) : (
              <h3>{title}</h3>
            )}
            {onAdd && !readOnly && (
              <a href="#!" onClick={handleAdd}>
                {addNewLabel}
              </a>
            )}
          </div>
        )}

        {forceShowError && globalError && (
          <div className="alert alert-danger">{globalError}</div>
        )}

        {isFetching ? (
          <CustomAccordionSkeleton oneBtn={!onDelete} headar={false} number={3} className={"d-grid"} />
        ) : items.length === 0 && noDataMessage ? (
          <div className="dc-experienceaccordion accordion">{noDataMessage}</div>
        ) : (
          <>
            <ul className="dc-experienceaccordion accordion">
              {items.map((item) => {
                const isEditing = item._isEditing || false;
                const isSingle = oneAccordion && items.length === 1;
                const collapseClass = isSingle
                  ? "dc-collapseexp show"
                  : `dc-collapseexp ${isEditing ? "show" : "hide"}`;
                const displayData = item;

                return (
                  <li key={item.id} className={`${isEditing ? "show" : ""}`}>
                    <div
                      className={`${
                        isHasMatched(item, "main") || item.hasMatch ? "has-match-inner" : ""
                      } dc-accordioninnertitle ${accordioninnertitleSize}`}
                      style={{
                        display: isSingle ? "none" : "",
                        backgroundColor: titleBackgroundColor,
                        borderColor: noHedarBefore ? "#eee" : "",
                        borderLeft: item.isNew ? "2px solid #ffa500" : "",
                      }}
                    >
                      <span
                        onClick={() => handleEditClick(item.id, isEditing)}
                        style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
                      >
                        {item.icon && <span style={{ marginRight: "8px" }}>{item.icon}</span>}
                        <span
                          style={{
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "98%",
                            verticalAlign: "middle",
                          }}
                          title={renderItemTitle(item)}
                        >
                          {item.isNew && (
                            <span style={{ color: "#ffa500", margin: "0 5px", fontWeight: "bold" }}>
                              (New)
                            </span>
                          )}
                          {readOnly ? renderItemTitle(item) : renderItemTitle(item)}
                          {item.date && (
                            <em style={{ marginLeft: "8px", color: "#666", margin: "0 11px" }}>
                              {item.date}
                            </em>
                          )}
                        </span>
                      </span>

                      <div className="dc-rightarea" onClick={(e) => e.stopPropagation()}>
                        <a
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditClick(item.id, isEditing);
                          }}
                          className="dc-addinfo dc-skillsaddinfo"
                        >
                          <FiEdit2 />
                        </a>
                        {onDelete && !readOnly && (
                          <a
                            href="#!"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleShowDeleteConfirm(item.id, item);
                            }}
                            className="dc-deleteinfo"
                            style={{ marginLeft: "8px" }}
                          >
                            <IoTrashOutline />
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ backgroundColor }} className={collapseClass}>
                      {formFields.map(
                        (field, idx) =>
                          field.type === "dropdown" && (
                            <div
                              key={idx}
                              className={`dropdown-with-search-in-accordion ${
                                field.half ? "form-group-half" : ""
                              }`}
                            >
                              <DropdownWithSearch
                                type={field.DropdownType}
                                value={displayData[field.name] || ""}
                                onChange={(val) => handleFieldChange(item.id, field.name, val)}
                              />
                            </div>
                          )
                      )}

                      <form
                        className="dc-formtheme dc-userform"
                        onSubmit={liveUpdate ? (e) => e.preventDefault() : (e) => handleSave(item.id, e)}
                      >
                        <fieldset>
                          <div style={{ borderBottom: "1px solid #ddd" }} className="form-group mb-2 pb-2">
                            {renderFormFields(item.id, displayData)}
                          </div>
                          {hint && (
                            <div className="form-group">
                              <span>{hint}</span>
                            </div>
                          )}

                          {!readOnly && !liveUpdate && buttonsAvailable && (
                            <div className="dc-btnarea d-flex">
                              <button
                                type="button"
                                className="simple-btn"
                                onClick={() => handleCancel(item.id)}
                                style={{ margin: "11px 4px" }}
                              >
                                {t("Cancel")}
                              </button>
                              <button type="submit" className="second-btn" style={{ margin: "11px 4px" }}>
                                {item.isNew ? t("Add") : t("Save")}
                              </button>
                            </div>
                          )}
                          {handleToggle && (
                            <button
                              type="button"
                              onClick={() => handleToggle(item)}
                              className={`second-btn ${item.isActive ? "deactivate-btn" : ""}`}
                              style={{ margin: "11px 4px", minWidth: "fit-content" }}
                            >
                              {item.isActive ? t("Deactivate") : t("Activate")}
                            </button>
                          )}
                          {applyRule && (
                            <button type="button" className="add-btn" onClick={() => applyRule(item)}>
                              {t("Apply Rule")}
                            </button>
                          )}
                        </fieldset>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
            {MainHint && (
              <span className="align-items-center d-inline-flex">
                <BiSolidInfoCircle style={{ fontSize: "x-large", margin: "10px 5px", minWidth: "fit-content" }} />
                {MainHint}
              </span>
            )}
          </>
        )}

        {deletePopup.show && (
          <PopupMessage
            type="danger"
ش           message={`Are you sure you want to delete "${deletePopup.itemName.slice(0, 120)}${
              deletePopup.itemName.length > 120 ? "..." : ""
            }"? This action cannot be undone.`}
            buttons={[
              {
                text: "Cancel",
                onClick: handleCloseDeleteConfirm,
                variant: "simple-cancel-btn shadow-0",
              },
              {
                text: "Delete",
                onClick: handleConfirmDelete,
                variant: "danger",
              },
            ]}
            onClose={handleCloseDeleteConfirm}
          />
        )}
      </div>
    );
  }
);

export default CustomAccordion2;