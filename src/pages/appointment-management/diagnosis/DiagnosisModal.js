import { Modal } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import Field from "../../ui/form-fields/Field";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import CustomAccordion from "../../shared/CustomAccordion";
import TwoLevelAccordion from "../../shared/TwoLevelAccordion";

import { useNestedItemHandlers } from "./useNestedItemHandlers";
import { createIndexBasedHandlers, createTwoLevelHandlers } from "./handlerUtils";

const DiagnosisModal = ({
  editingDiagnosis,
  setEditingDiagnosis,
  onUpdateDiagnosis,
  onCancel,
  onSave,
  onDelete,
  setCurrentItems,
  t
}) => {
  const {
    handleAddCondition,
    handleDeleteCondition,
    handleUpdateCondition,
    handleSaveCondition,
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    handleSaveNote,
    handleAddPrescription,
    handleDeletePrescription,
    handleUpdatePrescription,
    handleSavePrescription,
    handleAddRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe,
    handleSaveRecipe,
    handleCancelNestedItem
  } = useNestedItemHandlers(editingDiagnosis, setEditingDiagnosis,setCurrentItems);

  if (!editingDiagnosis) return null;

  return (
    <Modal
      className="mobile-view"
      show={true}
      onHide={onCancel}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header className="border-bottom-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              {editingDiagnosis?.isNew
                ? t("Add New Diagnosis")
                : t("Manage Diagnosis")}
            </span>
          </div>
        </Modal.Title>
        <button className="btn-modal-close" onClick={onCancel}>
          <MdClose />
        </button>
      </Modal.Header>

      <Modal.Body className="space-y-4 pt-0">
        {/* Basic Information */}
        <div className="mb-4">
          <div className="row">
            <div className="col-lg-12 col-sm-12 small-field">
              <Field
                label={t("Diagnosis Name")}
                value={editingDiagnosis?.diagnosisName || ""}
                onChange={(e) =>
                  onUpdateDiagnosis("diagnosisName", e.target.value)
                }
                placeholder={t("Enter diagnosis name")}
              />
            </div>
            <div className="col-lg-12 col-sm-12">
              <TextAreaField
                label={t("Symptoms Description")}
                value={editingDiagnosis?.symptomsDescription || ""}
                onChange={(e) =>
                  onUpdateDiagnosis("symptomsDescription", e.target.value)
                }
                placeholder={t("Enter symptoms description")}
              />
            </div>
          </div>
          <TextAreaField
            label={t("Diagnosis Description")}
            value={editingDiagnosis?.description || ""}
            onChange={(e) => onUpdateDiagnosis("description", e.target.value)}
            placeholder={t("Enter diagnosis description")}
          />
          <Field
            label={t("Code")}
            value={editingDiagnosis?.code || ""}
            onChange={(e) => onUpdateDiagnosis("code", e.target.value)}
            placeholder={t("Enter diagnosis code")}
          />
        </div>

        {/* Conditions */}
        <div className="mb-4">
          <CustomAccordion
            addNewLabel={t("Add Condition")}
            titleBackgroundColor="var(--scbccolor)"
            title={t("Diagnosed Conditions")}
            readOnly={false}
            backgroundColor="var(--scbccolor)"
            data={editingDiagnosis?.conditions || []}
            onAdd={handleAddCondition}
            {...createIndexBasedHandlers(editingDiagnosis?.conditions || [], {
              onDelete: handleDeleteCondition,
              onUpdate: handleUpdateCondition,
              onSave: handleSaveCondition,
              onCancel: (conditionId) =>
                handleCancelNestedItem("conditions", conditionId),
            })}
            getItemTitle={(condition) =>
              condition.medicalCondition || "No Condition"
            }
            itemType="conditions"
            formFields={[
              {
                label: t("Medical Condition"),
                name: "medicalCondition",
                placeholder: t("Enter medical condition"),
                half: true,
              },
              {
                label: t("Severity"),
                name: "severity",
                placeholder: t("Select severity"),
                type: "select",
                options: ["Mild", "Moderate", "Severe"],
                half: true,
              },
              {
                label: t("Notes"),
                name: "notes",
                type: "textarea",
                placeholder: t("Enter notes"),
              },
            ]}
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <CustomAccordion
            addNewLabel={t("Add Note")}
            titleBackgroundColor="var(--scbccolor)"
            title={t("Notes")}
            readOnly={false}
            backgroundColor="var(--scbccolor)"
            data={editingDiagnosis?.notes || []}
            getItemTitle={(note) => note.note || "No Note"}
            onAdd={handleAddNote}
            {...createIndexBasedHandlers(editingDiagnosis?.notes || [], {
              onDelete: handleDeleteNote,
              onUpdate: handleUpdateNote,
              onSave: handleSaveNote,
              onCancel: (noteId) => handleCancelNestedItem("notes", noteId),
            })}
            itemType="notes"
            formFields={[
              {
                label: t("Note Content"),
                name: "note",
                type: "textarea",
                placeholder: t("Enter note content"),
              },
            ]}
          />
        </div>

        {/* Prescriptions */}
        <div className="mb-4">
          <TwoLevelAccordion
            addNewLabel={t("Add Prescription")}
            title={t("Prescriptions")}
            readOnly={false}
            backgroundColor="var(--scbccolor)"
            titleBackgroundColor="var(--scbccolor)"
            getItemTitleRecipe={(recipe) => recipe.medication || "medication"}
            data={editingDiagnosis?.prescriptions || []}
            onAdd={handleAddPrescription}
            {...createTwoLevelHandlers(editingDiagnosis?.prescriptions || [], {
              onDelete: handleDeletePrescription,
              onUpdate: handleUpdatePrescription,
              onSave: handleSavePrescription,
              onCancel: (prescriptionId) =>
                handleCancelNestedItem("prescriptions", prescriptionId),
              onAddRecipe: handleAddRecipe,
              onDeleteRecipe: handleDeleteRecipe,
              onUpdateRecipe: handleUpdateRecipe,
              onSaveRecipe: handleSaveRecipe,
            })}
            itemType="prescriptions"
            formFields={[
              {
                label: t("Prescription Title"),
                name: "title",
                type: "text",
                placeholder: t("Enter prescription title"),
                half: true,
              },
              {
                label: t("Status"),
                name: "status",
                type: "select",
                options: ["Active", "Completed", "Cancelled", "Expired"],
                placeholder: t("Select status"),
                half: true,
              },
              {
                label: t("Note"),
                name: "notes",
                type: "textarea",
                placeholder: t("Enter prescription note"),
              },
            ]}
            formFieldsRecipe={[
              {
                label: t("Medication"),
                name: "medication",
                type: "dropdown",
                options: [
                  "Ibuprofen",
                  "Paracetamol",
                  "Amoxicillin",
                  "Aspirin",
                  "Metformin",
                  "Atorvastatin",
                  "Lisinopril",
                  "Levothyroxine",
                  "Amlodipine",
                  "Omeprazole",
                ],
                placeholder: t("Select medication"),
                half: true,
              },
              {
                label: t("Dosage"),
                name: "dosage",
                placeholder: t("Enter dosage"),
                half: true,
              },
              {
                label: t("Start Date"),
                name: "startDate",
                type: "date",
                placeholder: t("Select start date"),
                half: true,
              },
              {
                label: t("End Date"),
                name: "endDate",
                type: "date",
                placeholder: t("Select end date"),
                half: true,
              },
              {
                label: t("Duration (Days)"),
                name: "durationInDays",
                type: "number",
                placeholder: t("Enter duration in days"),
                half: true,
              },
              {
                label: t("Instructions"),
                name: "instructions",
                placeholder: t("Enter instructions"),
                type: "textarea",
              },
            ]}
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top-0" style={{ gap: "16px" }}>
        <button className="simple-btn" onClick={onCancel}>
          {t("Cancel")}
        </button>
        {!editingDiagnosis?.isNew && (
          <button
            onClick={() =>
              onDelete(editingDiagnosis.diagnosisId || editingDiagnosis.id)
            }
            className="btn-simple"
          >
            {t("Delete")}
          </button>
        )}
        <button className="second-btn" onClick={onSave}>
          {t("Save")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DiagnosisModal;