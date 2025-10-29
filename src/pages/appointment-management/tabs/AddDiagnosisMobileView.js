// DiagnosisMobileViewWithCRUD.jsx
import React, { useState, useCallback } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import CustomAccordion from "../../shared/CustomAccordion";
import TwoLevelAccordion from "../../shared/TwoLevelAccordion";
import Field from "../../ui/form-fields/Field";
import { useTranslation } from "react-i18next";
import { MdClose, MdExpandMore } from "react-icons/md";
import Pagination from "../../shared/Pagination";
import PopupMessage from "../../shared/PopupMessage";
import TextAreaField from "../../ui/form-fields/TextAreaField";

const DiagnosisMobileViewWithCRUD = () => {
  const { t } = useTranslation();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    diagnosisId: null,
    diagnosisName: ""
  });

  const handleShowDeleteConfirm = (diagnosisId, diagnosisName) => {
    setDeletePopup({
      show: true,
      diagnosisId,
      diagnosisName
    });
  };

  const handleCloseDeleteConfirm = () => {
    setDeletePopup({
      show: false,
      diagnosisId: null,
      diagnosisName: ""
    });
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [diagnosesData, setDiagnosesData] = useState([
    {
      id: "#DZ001",
      DiagnosisName: "Diabetes Mellitus Type 2",
      SymptomsDescription: "Increased thirst, frequent urination, fatigue, blurred vision",
      Description: "Chronic condition affecting the way the body processes blood sugar",
      notes: [
        {
          id: 11,
          note: "Patient started on Metformin 500mg twice daily",
          isNew: false,
          isExpanded: false
        },
        {
          id: 12,
          note: "Blood sugar levels improving with medication",
          isNew: false,
          isExpanded: false
        }
      ],
      conditions: [
        {
          id: 201,
          MedicalCondition: "Diabetic Retinopathy",
          Severity: "Moderate",
          Notes: "Requires regular monitoring",
          isNew: false,
          isExpanded: false
        },
        {
          id: 202,
          MedicalCondition: "Hypertension",
          Severity: "severe",
          Notes: "patient has high blood pressure",
          isNew: false,
          isExpanded: false
        }
      ],
      prescriptions: [
        {
          id: 101,
          title: "Diabetes Management",
          status: "completed",
          note: "Patient requires regular monitoring",
          type: "Medical",
          date: "2025-03-20",
          recipes: [
            {
              id: 1001,
              medication: "Metformin",
              dosage: "500mg",
              durationInDays: 30,
              instructions: "Patient started on Metformin 500mg twice daily",
              type: "medication",
              isNew: false,
              isExpanded: false
            },
            {
              id: 1002,
              medication: "Referral",
              dosage: "5 times per week",
              durationInDays: 20,
              instructions: "Referred to ophthalmologist for regular checkups",
              type: "referral",
              isNew: false,
              isExpanded: false
            }
          ],
          isNew: false,
          isExpanded: false
        }
      ]
    }
  ]);

  // === CRUD Functions ===

  // Add new diagnosis
  const handleAddDiagnosis = useCallback(() => {
    const newDiagnosis = {
      id: `#DZ${Date.now()}`,
      DiagnosisName: "",
      SymptomsDescription: "",
      Description: "",
      notes: [],
      conditions: [],
      prescriptions: [],
      isNew: true,
      isExpanded: false,
    };
    setDiagnosesData(prev => [newDiagnosis, ...prev]);
    setEditingDiagnosis(newDiagnosis);
    setSelectedDiagnosis(newDiagnosis);
  }, []);

  // Save diagnosis (used internally)
  const handleSaveDiagnosis = useCallback((diagnosisData) => {
    const savedDiagnosis = {
      ...diagnosisData,
      isNew: false,        // Critical: becomes "old"
      isExpanded: false
    };

    setDiagnosesData(prev =>
      prev.map(item => (item.id === savedDiagnosis.id ? savedDiagnosis : item))
    );
  }, []);

  // Update diagnosis field
  const handleUpdateDiagnosis = useCallback((field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      [field]: value
    }));
  }, [editingDiagnosis]);

  // === Conditions Management ===
  const handleAddCondition = useCallback(() => {
    if (!editingDiagnosis) return;
    const newCondition = {
      id: Date.now(),
      MedicalCondition: "",
      Severity: "",
      Notes: "",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: [newCondition, ...(prev.conditions || [])]
    }));
  }, [editingDiagnosis]);

  const handleDeleteCondition = useCallback((conditionIndex) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).filter((_, index) => index !== conditionIndex)
    }));
  }, [editingDiagnosis]);

  const handleUpdateCondition = useCallback((conditionIndex, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).map((condition, index) =>
        index === conditionIndex ? { ...condition, [field]: value } : condition
      )
    }));
  }, [editingDiagnosis]);

  const handleSaveCondition = useCallback((conditionIndex, conditionData) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).map((condition, index) =>
        index === conditionIndex ? { ...conditionData, isNew: false, isExpanded: false } : condition
      )
    }));
  }, [editingDiagnosis]);

  // === Notes Management ===
  const handleAddNote = useCallback(() => {
    if (!editingDiagnosis) return;
    const newNote = {
      id: Date.now(),
      note: "",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])]
    }));
  }, [editingDiagnosis]);

  const handleDeleteNote = useCallback((noteIndex) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).filter((_, index) => index !== noteIndex)
    }));
  }, [editingDiagnosis]);

  const handleUpdateNote = useCallback((noteIndex, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).map((note, index) =>
        index === noteIndex ? { ...note, [field]: value } : note
      )
    }));
  }, [editingDiagnosis]);

  const handleSaveNote = useCallback((noteIndex, noteData) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).map((note, index) =>
        index === noteIndex ? { ...noteData, isNew: false, isExpanded: false } : note
      )
    }));
  }, [editingDiagnosis]);

  // === Prescriptions Management ===
  const handleAddPrescription = useCallback(() => {
    if (!editingDiagnosis) return;
    const newPrescription = {
      id: Date.now(),
      title: "",
      status: "",
      note: "",
      type: "Medical",
      date: new Date().toISOString().split("T")[0],
      recipes: [],
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: [newPrescription, ...(prev.prescriptions || [])]
    }));
  }, [editingDiagnosis]);

  const handleDeletePrescription = useCallback((prescriptionIndex) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter((_, index) => index !== prescriptionIndex)
    }));
  }, [editingDiagnosis]);

  const handleUpdatePrescription = useCallback((prescriptionIndex, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex ? { ...prescription, [field]: value } : prescription
      )
    }));
  }, [editingDiagnosis]);

  const handleSavePrescription = useCallback((prescriptionIndex, prescriptionData) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex ? { ...prescriptionData, isNew: false, isExpanded: false } : prescription
      )
    }));
  }, [editingDiagnosis]);

  // === Recipes Management ===
  const handleAddRecipe = useCallback((prescriptionIndex) => {
    if (!editingDiagnosis) return;
    const newRecipe = {
      id: Date.now(),
      medication: "",
      dosage: "",
      durationInDays: "",
      instructions: "",
      type: "medication",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex
          ? {
              ...prescription,
              recipes: [newRecipe, ...(prescription.recipes || [])]
            }
          : prescription
      )
    }));
  }, [editingDiagnosis]);

  const handleDeleteRecipe = useCallback((prescriptionIndex, recipeIndex) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).filter((_, rIndex) => rIndex !== recipeIndex)
            }
          : prescription
      )
    }));
  }, [editingDiagnosis]);

  const handleUpdateRecipe = useCallback((prescriptionIndex, recipeIndex, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).map((recipe, rIndex) =>
                rIndex === recipeIndex ? { ...recipe, [field]: value } : recipe
              )
            }
          : prescription
      )
    }));
  }, [editingDiagnosis]);

  const handleSaveRecipe = useCallback((prescriptionIndex, recipeIndex, recipeData) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map((prescription, index) =>
        index === prescriptionIndex
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).map((recipe, rIndex) =>
                rIndex === recipeIndex ? { ...recipeData, isNew: false, isExpanded: false } : recipe
              )
            }
          : prescription
      )
    }));
  }, [editingDiagnosis]);

  const handleConfirmDelete = () => {
    if (deletePopup.diagnosisId) {
      setDiagnosesData(prev => prev.filter(item => item.id !== deletePopup.diagnosisId));
      setEditingDiagnosis(null);
      setSelectedDiagnosis(null);
      handleCloseDeleteConfirm();
    }
  };

  const handleDeleteDiagnosis = useCallback((id) => {
    const diagnosisToDelete = diagnosesData.find(item => item.id === id);
    if (diagnosisToDelete) {
      handleShowDeleteConfirm(id, diagnosisToDelete.DiagnosisName);
    }
  }, [diagnosesData]);

  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId]
    }));
  };

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Open modal in edit mode
  const handleEditDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setEditingDiagnosis({ ...diagnosis });
  };

  // Save and close modal
  const handleSaveAndClose = () => {
    if (!editingDiagnosis) return;

    const isEmptyNewDiagnosis =
      editingDiagnosis.isNew &&
      !editingDiagnosis.DiagnosisName?.trim() &&
      !editingDiagnosis.SymptomsDescription?.trim() &&
      !editingDiagnosis.Description?.trim();

    if (isEmptyNewDiagnosis) {
      // Remove empty new diagnosis
      setDiagnosesData(prev => prev.filter(item => item.id !== editingDiagnosis.id));
    } else {
      // Save and convert to "old"
      handleSaveDiagnosis(editingDiagnosis);
    }

    setSelectedDiagnosis(null);
    setEditingDiagnosis(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (editingDiagnosis?.isNew) {
      const hasContent =
        editingDiagnosis.DiagnosisName?.trim() ||
        editingDiagnosis.SymptomsDescription?.trim() ||
        editingDiagnosis.Description?.trim();

      if (!hasContent) {
        // Empty → delete
        setDiagnosesData(prev => prev.filter(item => item.id !== editingDiagnosis.id));
        setSelectedDiagnosis(null);
        setEditingDiagnosis(null);
      } else {
        // Has content → ask to delete or keep
        handleShowDeleteConfirm(
          editingDiagnosis.id,
          editingDiagnosis.DiagnosisName || t('New Diagnosis')
        );
        // Do NOT close modal here
        return;
      }
    } else {
      // Old diagnosis → revert to original
      const original = diagnosesData.find(d => d.id === editingDiagnosis.id);
      if (original) {
        setEditingDiagnosis({ ...original });
      }
      setSelectedDiagnosis(null);
      setEditingDiagnosis(null);
    }
  };

  // Handle cancel for nested items
  const handleCancelNestedItem = (itemType, itemIndex) => {
    if (!editingDiagnosis) return;
    if (editingDiagnosis[itemType]?.[itemIndex]?.isNew) {
      const updatedItems = editingDiagnosis[itemType].filter((_, index) => index !== itemIndex);
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    } else {
      const updatedItems = editingDiagnosis[itemType].map((item, index) =>
        index === itemIndex ? { ...item, isExpanded: false } : item
      );
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    }
  };

  // Pagination calculations
  const totalItems = diagnosesData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = diagnosesData.slice(startIndex, endIndex);

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('DiagnosisMobileView.table_title')}</h3>
          <h6 className="table-subtitle">{t('DiagnosisMobileView.table_subtitle')}</h6>
        </div>
        <button onClick={handleAddDiagnosis} className="add-btn">
          {t('Add New Diagnosis')}
        </button>
      </div>

      <div className="p-2">
        <div className="space-y-3">
          {currentItems.map((disease) => (
            <Card key={disease.id} className="mobile-view-card">
              <Card.Body style={{ padding: "15px" }}>
                <div className="">
                  <h5 className="">{disease.DiagnosisName}</h5>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">
                    {t('DiagnosisMobileView.symptoms')} :
                  </small>
                  <div className="expandable-content">
                    <p className="mb-0">
                      {truncateText(disease.SymptomsDescription, 180)}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <small
                    className="text-muted d-flex mb-1"
                    onClick={() => toggleDescription(disease.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {t('Diagnosis Description')} :
                    {disease.Description && (
                      <button
                        className=""
                        onClick={() => toggleDescription(disease.id)}
                        style={{
                          fontSize: '20px',
                          color: '#278fff',
                          padding: "3px 0 0"
                        }}
                      >
                        <MdExpandMore
                          style={{
                            transform: expandedDescriptions[disease.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </button>
                    )}
                  </small>
                  <div className={`expandable-content ${expandedDescriptions[disease.id] ? '' : 'p-0'}`}>
                    <p
                      style={{
                        margin: "0",
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => toggleDescription(disease.id)}
                    >
                      {expandedDescriptions[disease.id] ? disease.Description : ""}
                    </p>
                  </div>
                </div>
                <div className="row text-center mb-3">
                  <div className="col-4">
                    <div className="border-end">
                      <div className="fw-bold text-primary">
                        {disease.conditions?.length || 0}
                      </div>
                      <small className="text-muted">{t('DiagnosisMobileView.conditions')}</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <div className="fw-bold text-primary">
                        {disease.notes?.length || 0}
                      </div>
                      <small className="text-muted">{t('DiagnosisMobileView.notes')}</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold text-primary">
                      {disease.prescriptions?.length || 0}
                    </div>
                    <small className="text-muted">{t('DiagnosisMobileView.prescription')}</small>
                  </div>
                </div>
                <Button
                  className="view-btn btn btn-outline-primary btn-sm"
                  style={{ float: "inline-end" }}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEditDiagnosis(disease)}
                >
                  {t('Manage')}
                </Button>
              </Card.Body>
            </Card>
          ))}
          {currentItems.length === 0 && (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">{t('DiagnosisMobileView.no_diagnosis_found')}</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Edit/Manage Modal */}
      {(selectedDiagnosis || editingDiagnosis) && (
        <Modal
          className="mobile-view"
          show={true}
          onHide={handleCancelEdit}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header className="border-bottom-0">
            <Modal.Title className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  {editingDiagnosis?.isNew
                    ? t('Add New Diagnosis')
                    : t('Manage Diagnosis')
                  }
                </span>
              </div>
            </Modal.Title>
            <button className="btn-modal-close" onClick={handleCancelEdit}>
              <MdClose />
            </button>
          </Modal.Header>
          <Modal.Body className="space-y-4 pt-0">
            {/* Basic Information */}
            <div className="mb-4">
              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <Field
                    label={t('Diagnosis Name')}
                    value={editingDiagnosis?.DiagnosisName || ''}
                    onChange={(e) => handleUpdateDiagnosis('DiagnosisName', e.target.value)}
                    placeholder={t('Enter diagnosis name')}
                  />
                </div>
                <div className="col-lg-6 col-sm-12">
                  <Field
                    label={t('Symptoms Description')}
                    value={editingDiagnosis?.SymptomsDescription || ''}
                    onChange={(e) => handleUpdateDiagnosis('SymptomsDescription', e.target.value)}
                    placeholder={t('Enter symptoms description')}
                  />
                </div>
              </div>
              <TextAreaField
                label={t('Diagnosis Description')}
                value={editingDiagnosis?.Description || ''}
                onChange={(e) => handleUpdateDiagnosis('Description', e.target.value)}
                placeholder={t('Enter diagnosis description')}
              />
            </div>

            {/* Conditions */}
            <div className="mb-4">
              <CustomAccordion
                addNewLabel={t('Add Condition')}
                titleBackgroundColor="var(--scbccolor)"
                title={t('Diagnosed Conditions')}
                readOnly={false}
                backgroundColor="var(--scbccolor)"
                data={editingDiagnosis?.conditions || []}
                onAdd={handleAddCondition}
                onDelete={handleDeleteCondition}
                onUpdate={handleUpdateCondition}
                onSave={handleSaveCondition}
                onCancel={handleCancelNestedItem}
                itemType="conditions"
                formFields={[
                  {
                    label: t('Medical Condition'),
                    name: "MedicalCondition",
                    placeholder: t('Enter medical condition'),
                    half: true,
                  },
                  {
                    label: t('Severity'),
                    name: "Severity",
                    placeholder: t('Select severity'),
                    type: "select",
                    options: ["Mild", "Moderate", "Severe"],
                    half: true,
                  },
                  {
                    label: t('Notes'),
                    name: "Notes",
                    type: "textarea",
                    placeholder: t('Enter notes'),
                  },
                ]}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <CustomAccordion
                addNewLabel={t('Add Note')}
                titleBackgroundColor="var(--scbccolor)"
                title={t('Notes')}
                readOnly={false}
                backgroundColor="var(--scbccolor)"
                data={editingDiagnosis?.notes || []}
                onAdd={handleAddNote}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote}
                onSave={handleSaveNote}
                onCancel={handleCancelNestedItem}
                itemType="notes"
                formFields={[
                  {
                    label: t('Note Content'),
                    name: "note",
                    type: "textarea",
                    placeholder: t('Enter note content'),
                  },
                ]}
              />
            </div>

            {/* Prescriptions */}
            <div className="mb-4">
              <TwoLevelAccordion
                addNewLabel={t('Add Prescription')}
                title={t('Prescriptions')}
                readOnly={false}
                backgroundColor="var(--scbccolor)"
                titleBackgroundColor="var(--scbccolor)"
                data={editingDiagnosis?.prescriptions || []}
                onAdd={handleAddPrescription}
                onDelete={handleDeletePrescription}
                onUpdate={handleUpdatePrescription}
                onSave={handleSavePrescription}
                onAddRecipe={handleAddRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onUpdateRecipe={handleUpdateRecipe}
                onSaveRecipe={handleSaveRecipe}
                onCancel={handleCancelNestedItem}
                itemType="prescriptions"
                formFields={[
                  {
                    label: t('Prescription Title'),
                    name: "title",
                    type: "text",
                    placeholder: t('Enter prescription title'),
                    half: true,
                  },
                  {
                    label: t('Status'),
                    name: "status",
                    type: "select",
                    options: ["Active", "Completed", "Cancelled", "Expired"],
                    placeholder: t('Select status'),
                    half: true,
                  },
                  {
                    label: t('Note'),
                    name: "note",
                    type: "textarea",
                    placeholder: t('Enter prescription note'),
                  },
                ]}
                formFieldsRecipe={[
                  {
                    label: t('Medication'),
                    name: "medication",
                    type: "dropdown",
                    options: [
                      "Ibuprofen", "Paracetamol", "Amoxicillin", "Aspirin",
                      "Metformin", "Atorvastatin", "Lisinopril", "Levothyroxine",
                      "Amlodipine", "Omeprazole"
                    ],
                    placeholder: t('Select medication'),
                    half: true
                  },
                  {
                    label: t('Dosage'),
                    name: "dosage",
                    placeholder: t('Enter dosage'),
                    half: true,
                  },
                  {
                    label: t('Duration (Days)'),
                    name: "durationInDays",
                    type: "number",
                    placeholder: t('Enter duration in days'),
                    half: true,
                  },
                  {
                    label: t('Instructions'),
                    name: "instructions",
                    placeholder: t('Enter instructions'),
                    type: "textarea",
                  },
                ]}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top-0" style={{ gap: "16px" }}>
            <button className="simple-btn" onClick={handleCancelEdit}>
              {t('Cancel')}
            </button>
            {!editingDiagnosis?.isNew && (
              <button
                onClick={() => handleDeleteDiagnosis(editingDiagnosis.id)}
                className="btn-simple"
              >
                {t('Delete')}
              </button>
            )}
            <button className="second-btn" onClick={handleSaveAndClose}>
              {t('Save')}
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <PopupMessage
          type="danger"
          title={t('Delete Diagnosis')}
          message={t('Are you sure you want to delete diagnosis') + ` "${deletePopup.diagnosisName}"? ` + t('This action cannot be undone.')}
          buttons={[
            {
              text: t('Cancel'),
              onClick: handleCloseDeleteConfirm,
              variant: "secondary"
            },
            {
              text: t('Delete'),
              onClick: handleConfirmDelete,
              variant: "danger"
            }
          ]}
          onClose={handleCloseDeleteConfirm}
        />
      )}
    </div>
  );
};

export default DiagnosisMobileViewWithCRUD;