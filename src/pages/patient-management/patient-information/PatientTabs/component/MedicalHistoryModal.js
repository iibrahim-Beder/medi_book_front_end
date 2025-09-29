import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Field from "../../../../ui/form-fields/Field";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import { MdClose } from "react-icons/md";
import DropdownWithSearch from "../../../../shared/DropdownWithSearch";
import SelectField from "../../../../ui/form-fields/SelectField";

const MedicalHistoryModal = ({
  show,
  onClose,
  onSave,
  record,
  setRecord,
  hereditaryDiseases = [], 
  title = "Add Medical History",
  errors = {},
  forceShowError = true,
}) => {
  
  const historyTypes = [
    { id: "1", label: "Surgery" },
    { id: "2", label: "Accident" },
    { id: "3", label: "Hospitalization" },
    { id: "4", label: "Family History" },
    { id: "5", label: "Vaccination" },
    { id: "6", label: "Others" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setRecord({ ...record, [name]: value });
  };

// toggle hereditaryDisease and relatedPerson based on historyType
  useEffect(() => {
    if (record?.historyType === "Family History") {
      setRecord(prev => ({
        ...prev,
        hereditaryDisease: prev.hereditaryDisease || "",
        relatedPerson: prev.relatedPerson || ""
      }));
    } else {
      // if not FamilyHistory, clear these fields
      setRecord(prev => ({
        ...prev,
        hereditaryDisease: "",
        relatedPerson: ""
      }));
    }
  }, [record?.historyType]);

  return (
    <Modal show={show} onHide={onClose} centered className="custom-edit-modal">
      <Modal.Header style={{ 
        position: "relative", 
        borderBottom: "1px solid #dee2e6", 
        padding: "1.5rem 1.5rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Modal.Title style={{ fontWeight: "600", fontSize: "1.4rem", margin: 0 }}>
          {title}
        </Modal.Title>
        
        <Button 
          onClick={onClose} 
          style={{
            zIndex: 1050,
            fontSize: "1.5rem",
            padding: "0.35rem 0.65rem",
            lineHeight: 1,
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            color: "black",
            borderRadius: "50%",
            opacity: 0.8,
            margin: 0,
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          <MdClose/>
        </Button>
      </Modal.Header>

      <Modal.Body style={{ padding: "0.5rem 1.5rem 1rem" }}>
        {record && (
          <div className="form-grid" style={{ rowGap: "0.8rem" }}>
            {/* History Type Dropdown - normal Select */}
            <SelectField
              label="History Type *"
              name="historyType"
              value={record.historyType || ""}
              onChange={handleChange}
              options={historyTypes}
              placeholder="Select history type"
              error={errors?.historyType}
              forceShowError={forceShowError}
            />

            {/* Date of Event */}
            <Field
              label="Date of Event"
              name="dateOfEvent"
              type="date"
              value={record.dateOfEvent || ""}
              onChange={handleChange}
              error={errors?.dateOfEvent}
              forceShowError={forceShowError}
            />

            {/* Hereditary Disease (if FamilyHistory) - DropdownWithSearch */}
            <div style={{ gridColumn: "span 2", marginBottom: "1rem", opacity: record.historyType !== "Family History" ? 0.6 : 1 }}>
              <label style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontWeight: "500",
                color: "#333"
              }}>
                Hereditary Disease
              </label>
              <DropdownWithSearch
                label="Select Disease"
                options={hereditaryDiseases}
                placeholder={
                  record.historyType === "Family History" 
                    ? "Select hereditary disease" 
                    : "Select Family History first"
                }
                onSelect={(value) => handleDropdownChange("hereditaryDisease", value)}
                itemsPerPage={6}
                disabled={record.historyType !== "Family History"}
              />
            </div>

            {/* Related Person (if FamilyHistory) - Input  */}
            <div style={{ gridColumn: "span 2"}}>
            <Field
              label="Related Person"
              name="relatedPerson"
              type="text"
              value={record.relatedPerson || ""}
              onChange={handleChange}
              placeholder={
                record.historyType === "Family History" 
                  ? "e.g., Father, Mother, Brother..." 
                  : "Available for Family History only"
              }
              disabled={record.historyType !== "Family History"}
              error={errors?.relatedPerson}
              forceShowError={forceShowError}
            />
          </div>
            {/* Description */}
            <TextAreaField
              label="Description"
              name="description"
              value={record.description || ""}
              onChange={handleChange}
              placeholder="Enter description of the medical event"
              rows={3}
              error={errors?.description}
              forceShowError={forceShowError}
            />

            {/* Notes */}
            <TextAreaField
              label="Additional Notes"
              name="notes"
              value={record.notes || ""}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows={2}
              error={errors?.notes}
              forceShowError={forceShowError}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          border: "none",
          padding: "0.5rem 1.5rem 1.5rem",
          gap: "0.8rem",
        }}
      >
        <button className="btn simple-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="second-btn" onClick={onSave}>
          Save Medical History
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicalHistoryModal;