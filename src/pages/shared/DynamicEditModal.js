import React from "react";
import { Modal, Button } from "react-bootstrap";
import Field from "../ui/form-fields/Field"; 
import TextAreaField from "../ui/form-fields/TextAreaField";
import SelectField from "../ui/form-fields/SelectField";
import { MdClose } from "react-icons/md";
import DropdownWithSearch from "./DropdownWithSearch";
import { useTranslation } from "react-i18next";

const DynamicEditModal = ({
  addMode,
  show,
  onClose,
  onSave,
  onDelete,
  record,
  setRecord,
  fields,
  title = "Edit Record",
  errors = {},
  forceShowError = true,
  typeDropdown = "disease",
}) => {

  const { t } = useTranslation();

  // Handle changes in basic input fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;

    // Convert numeric input values to numbers
    if (type === "number") val = value === "" ? "" : Number(value);

    // Ensure boolean values are correctly parsed for "isActive"
    if (name === "isActive") {
      val = (value === true) || (value === "true");
    }

    setRecord({ ...record, [name]: val });
  };

  console.log("record", record);
  // Handle dropdown selection for medical conditions
  // const handleMedicalConditionChange = (selectedOption) => {
  //   if (selectedOption) {
  //     setRecord({ 
  //       ...record, 
  //       medicalConditionName: selectedOption.name,
  //       medicalConditionId: selectedOption.id 
  //     });
  //   } else {
  //     setRecord({ 
  //       ...record, 
  //       medicalConditionName: "",
  //       medicalConditionId: null
  //     });
  //   }
  // };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-edit-modal">
      <Modal.Header style={{
        position: "relative",
        borderBottom: "1px solid #dee2e6",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Modal.Title className="text-ellipsis" style={{ fontWeight: "600", fontSize: "17px", margin: 0 }}>
          {title}
        </Modal.Title>

        <Button
          onClick={onClose}
          style={{
            zIndex: 1050,
            fontSize: "1.5rem",
            padding: "0.35rem 0.65rem",
            lineHeight: 1,
            borderRadius: "50%",
            opacity: 0.8,
            margin: 0,
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            color: "black"
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          <MdClose />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ padding: "0.5rem 1.5rem 1rem" }}>
        {record && (
          <div className="form-grid" style={{ rowGap: "0.8rem" }}>
            {fields.map((field) => {
              if (field.type === "dropdown") {
    const value = record[`${field.name}`]
      ? {
          id: record[`${field.name}Id`],
          name: record[`${field.name}`],
        }
      : null;

    return (
      <div key={field.name} style={{ marginBottom: "0", gridColumn: "span 2" }}>
        <DropdownWithSearch
          type={typeDropdown}
          value={value}
          onChange={(selected) => {
            setRecord({
              ...record,
              [`${field.name}Id`]: selected ? selected.id : null,
              [`${field.name}`]: selected ? selected.name : "",
            });
          }}
          disabled={false}
        />

        {errors?.[field.name] && forceShowError && (
          <div style={{
            color: "red",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}>
            {errors[field.name]}
          </div>
        )}
      </div>
    );
  }

              if (field.type === "textarea") {
                return (
                  <TextAreaField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={record[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    error={errors?.[field.name]}
                    forceShowError={forceShowError}
                  />
                );
              }

              if (field.type === "select") {
                return (
                  <SelectField
                    isAllWidth={field.AllWidth}               
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={record[field.name] ?? ""}
                    onChange={handleChange}
                    options={field.options.map(option => {
                      return typeof option === 'string'
                        ? { value: option, label: option }
                        : option;
                    })}
                    icon={field.icon}
                    error={errors?.[field.name]}
                    forceShowError={forceShowError}
                  />
                );
              }

              return (
                <Field
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={record[field.name] ?? ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  icon={field.icon}
                  options={field.options}
                  error={errors?.[field.name]}
                  forceShowError={forceShowError}
                />
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer style={{ border: "none", padding: "0.5rem 1.5rem 1.5rem", gap: "0.8rem" }}>
        <button className="simple-btn" onClick={onClose}>{t("Cancel")}</button>
        {!addMode && <button onClick={onDelete} className="btn-simple">{t("Delete")}</button>}
        <button onClick={onSave} className="second-btn">{t("Save")}</button>
      </Modal.Footer>
    </Modal>
  );
};

export default DynamicEditModal;