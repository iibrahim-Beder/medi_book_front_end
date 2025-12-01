import { useTranslation } from "react-i18next";

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
      name: "MedicalCondition",
      placeholder: t('Condition Type'),
      half: true,
      label: t('Medical Condition'),
    },
    {
      name: "Severity",
      placeholder: t('Severity'),
      half: true,
      label: t('Severity'),
    },
    {
      name: "note",
      type: "textarea",
      placeholder: t('Note Content'),
      label: t('Note'),
    },
  ];

  // Form fields for CustomAccordion - Notes
  const notesFields = [
    {
      name: "content",
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

  // ترجمة النصوص
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

  return {
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