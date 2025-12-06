import { useTranslation } from "react-i18next";
import Modal from 'react-bootstrap/Modal';
import { MdClose } from 'react-icons/md';
import TwoLevelAccordion from "../../../../shared/TwoLevelAccordion";
import CustomAccordion from "../../../../shared/CustomAccordion";
export const diagnosisHelpers = (t) => {
  // Diagnosis types for filters
  const diagnosisTypes = [
    { key: "Type 2 Diabetes Mellitus", label: "Type 2 Diabetes Mellitus" },
    { key: "Test", label: "Test" }
  ];

  // Filter configurations
  const filterConfigs = [
    {
      name: "diagnosisType",
      label: "Diagnosis Type",
      data: diagnosisTypes,
    },
  ];

  // Form fields for CustomAccordion - Diagnosed Conditions
  const diagnosedConditionsFields = [
    {
      name: "medicalConditionName",
      placeholder: t('Condition Type'),
      // half: true,
      label: t('Medical Condition'),
    },
    {
      name:"categoryName",
      placeholder: t('Category'),
      half: true,
      label: t('Category'),
    },
    {
      name: "conditionType",
      placeholder: t('Severity'),
      half: true,
      label: t('Severity'),
    },
    {
      name: "notes",
      type: "textarea",
      placeholder: t('Note Content'),
      label: t('Note'),
    },
  ];

  // Form fields for CustomAccordion - Notes
  const notesFields = [
    {
      name: "note",
      type: "textarea",
      placeholder: t('Note Content'),
      label: t('Note Content'),
    },
  ];

  // Form fields for TwoLevelAccordion - Prescription
  const prescriptionFields = [
    {
      name: "title",
      type: "text",
      placeholder: t('Prescription Title'),
      half: true,
      label: t('Prescription Title'),
    },
    {
      name: "status",
      placeholder: t('Status'),
      half: true,
      label: t('Status'),
    },
    {
      name: "note",
      type: "textarea",
      placeholder: t('Prescription Note'),
      label: t('Note'),
    },
  ];

  // Form fields for TwoLevelAccordion - Recipe
  const prescriptionRecipeFields = [
    {
      name: "medication",
      placeholder: t('Medication'),
      label: t('Medication'),
    },
    {
      name: "dosage",
      placeholder: t('Dosage'),
      half: true,
      label: t('Dosage'),
    },
    {
      name: "durationInDays",
      type: "number",
      placeholder: t('Duration (Days)'),
      half: true,
      label: t('Duration (Days)'),
    },
    {
      name: "instructions",
      placeholder: t('Instructions'),
      type: "textarea",
      label: t('Instructions'),
    },
  ];

  const translateTableHeaders = () => ({
    diagnosisName: t('Diagnosis Name'),
    code: t('Code'),
    symptomsDescription: t('Symptoms Description'),
    diagnosisDescription: t('Diagnosis Description'),
    conditions: t('Conditions'),
    notes: t('Notes'),
    prescriptions: t('Prescriptions'),
    createdAt: t('Created At')
  });

  const translateEmptyStates = () => ({
    noResults: (searchValue) => 
      searchValue 
        ? `No results found for "${searchValue}"` 
        : 'No diagnoses found'
  });
    const getModalTitle = (type) => {
    switch(type) {
      case 'diagnosedConditions': return t('Diagnosed Conditions');
      case 'notes': return t('Notes');
      case 'prescription': return t('Prescription');
      default: return t('Details');
    }
  };

  return {
    getModalTitle,
    diagnosisTypes,
    filterConfigs,
    diagnosedConditionsFields,
    notesFields,
    prescriptionFields,
    prescriptionRecipeFields,
    translateTableHeaders,
    translateEmptyStates
  };
};
// Diagnosis Modal 
export const DiagnosisModal = ({ 
  show, 
  onHide, 
  type, 
  data,
  formFields,
  formFieldsRecipe,
  title 
}) => {
  const { t } = useTranslation();
  
  const getModalTitle = () => {
    switch(type) {
      case 'diagnosedConditions':
        return t('Diagnosed Conditions');
      case 'notes':
        return t('Notes');
      case 'prescription':
        return t('Prescriptions');
      default:
        return title || t('Details');
    }
  };
  
  const getModalContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted">{t('No data available')}</p>
        </div>
      );
    }
    
    switch(type) {
      case 'diagnosedConditions':
        return (
          <CustomAccordion
           getItemTitle={(condition) => condition.medicalConditionName || "Condition"}
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            data={data}
            formFields={formFields}
          />
        );
        
      case 'notes':
        return (
          <CustomAccordion
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            data={data}
            formFields={formFields}
            getItemTitle={(note) => note.note || "Note"}

          />
        );
        
      case 'prescription':
        return (
          <TwoLevelAccordion
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            titleBackgroundColor="var(--scbccolor)"
            data={data}
            formFields={formFields}
            formFieldsRecipe={formFieldsRecipe}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      centered
      className="diagnosis-modal pr-0"
    >
      <Modal.Header className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          {getModalTitle()}
        </Modal.Title>
        <button
          type="button"
          className="btn-close-custom"
          onClick={onHide}
        >
          <MdClose size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="modal-content-custom">
          {getModalContent()}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <button 
          onClick={onHide}
          className="dc-btn dc-cancel-btn"
        >
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};