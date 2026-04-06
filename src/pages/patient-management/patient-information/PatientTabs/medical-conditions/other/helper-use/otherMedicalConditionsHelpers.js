import { formatDate, formatDateForAPI } from "../../../../../../shared/utils";

export const otherMedicalConditionsHelpers = (t) => {
  // Form fields configuration for modal
  const fields = [
    { 
      name: "medicalConditionName", 
      label: t('OtherMedicalConditions.medical_condition_name'), 
      type: "dropdown", 
      placeholder: t('OtherMedicalConditions.enter_condition_name'),
      // required: true
    },
    { 
      name: "severity", 
      label: t('OtherMedicalConditions.severity'), 
      type: "select", 
      options: [
        { value: "Mild", label: t('OtherMedicalConditions.severity_options.Mild') },
        { value: "Moderate", label: t('Moderate') }, 
        { value: "Severe", label: t('OtherMedicalConditions.severity_options.Severe') },
        { value: "Critical", label: t('OtherMedicalConditions.severity_options.Critical') }
      ], 
      placeholder: t('OtherMedicalConditions.select_severity'),
      required: true
    },
    { 
      name: "conditionType", 
      label: t('OtherMedicalConditions.condition_type'), 
      type: "select", 
      options: [
        { value: "Genetic", label: t('Genetic') },
        { value: "Chronic", label: t('Chronic') },
        { value: "Acute", label: t('Acute') },
        { value: "Other", label: t('Other') },
      ], 
      placeholder: t('OtherMedicalConditions.select_condition_type') 
    },
    { 
      name: "isActive", 
      label: t('OtherMedicalConditions.status'), 
      type: "select", 
      options: [
        { value: true, label: t('Common.status_options.active') },
        { value: false, label: t('Common.status_options.inactive') }
      ], 
      placeholder: t('OtherMedicalConditions.select_status') 
    },
    { 
      name: "diagnosedDate", 
      label: t('OtherMedicalConditions.diagnosed_date'), 
      type: "date", 
      placeholder: t('OtherMedicalConditions.select_date') 
    },
    { 
      name: "notes", 
      label: t('OtherMedicalConditions.notes'), 
      type: "textarea", 
      placeholder: t('OtherMedicalConditions.enter_notes') 
    },
  ];

  const fieldMapping = {
    medicalConditionName: "MedicalConditionName",
    categoryName: "CategoryName",
    note: "Note"
  };

  const filterConfigs = [
    {
      name: "conditionType",
      label: "Condition Type",
      data: [ "Acute", "Chronic","Genetic", "Other"].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
    {
      name: "severity",
      label: "Severity",
      data: [ t("mild"), t("Moderate"), t("Severe")].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
    {
      name: "isActive",
      label: "Status",
      data: [t("All"), t("Active"), t("Inactive")].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
  ];

  const translateSeverity = (severity) => {
    return t(`${severity}`);
  };

  const translateConditionType = (conditionType) => {
    return t(`${conditionType}`);
  };

  const translateStatus = (isActive) => {
    return t(`Common.status_options.${isActive ? "active" : "inactive"}`);
  };

  return {
    fields,
    fieldMapping,
    filterConfigs,
    formatDate,
    translateSeverity,
    translateConditionType,
    translateStatus
  };
};

// OtherMedicalConditionsHelpers.js

export const validateOtherMedicalConditionForm = (condition) => {
  // console.log('condition', condition);
  if (!condition.medicalConditionName || condition.medicalConditionName === 0) {
    return "Please select a medical condition.";
  }

  if (!condition.diagnosedDate) {
    return "Please select diagnosed date.";
  }

  return null;
};
const getSeverityValue = (severityText) => {
  const severityMap = {
    "Mild": 0,
    "Moderate": 1,
    "Severe": 2
  };
  return severityMap[severityText] || 1;
};
export const buildOtherMedicalConditionUpdatePayload = (original, updated) => {
  // console.log('===original', original, 'updated', updated);
  const payload = {};

  if (updated.medicalConditionName !== original.medicalConditionName) {
    payload.medicalConditionId = updated.medicalConditionNameId;
  }

  if (updated.severity !== original.severity) {
    payload.severity = getSeverityValue(updated.severity);
  }

  if (updated.isActive !== original.isActive) {
    payload.isActive = updated.isActive;
  }

  if (updated.conditionType !== original.conditionType) {
    payload.conditionType = updated.conditionType;
  }

  if (updated.notes !== original.notes) {
    payload.notes = updated.notes || null;
  }

  if (formatDateForAPI(updated.diagnosedDate) !== formatDateForAPI(original.diagnosedDate)) {
    payload.diagnosisDate = formatDateForAPI(updated.diagnosedDate) || null;
  }

  return payload;
};
