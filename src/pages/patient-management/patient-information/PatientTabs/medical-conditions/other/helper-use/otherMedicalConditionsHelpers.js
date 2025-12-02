import { formatDate } from "../../../../../../shared/utils";

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
        { value: "Moderate", label: t('OtherMedicalConditions.severity_options.Moderate') }, 
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
        { value: "External", label: t('OtherMedicalConditions.condition_type_options.External') },
        { value: "Internal", label: t('OtherMedicalConditions.condition_type_options.Internal') },
        { value: "Chronic", label: t('OtherMedicalConditions.condition_type_options.Chronic') },
        { value: "Acute", label: t('OtherMedicalConditions.condition_type_options.Acute') }
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
      name: "note", 
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
      name: "isActive",
      label: "Status",
      data: ["All", "Active", "Inactive"].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
    {
      name: "conditionType",
      label: "Condition Type",
      data: ["External", "Acute", "Chronic", "Internal"].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
    {
      name: "severity",
      label: "Severity",
      data: ["Mild", "Moderate", "Severe"].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
  ];

  const translateSeverity = (severity) => {
    return t(`OtherMedicalConditionsMobileView.severity_options.${severity?.toLowerCase()}`);
  };

  const translateConditionType = (conditionType) => {
    return t(`OtherMedicalConditionsMobileView.condition_type_options.${conditionType}`);
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