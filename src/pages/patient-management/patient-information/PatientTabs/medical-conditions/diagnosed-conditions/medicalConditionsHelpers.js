export const medicalConditionsHelpers = (t) => {
  const conditionTypes = [
    { key: "Acute", label: t("acute") },
    { key: "Chronic", label: t("chronic") },
    { key: "Genetic", label: t("genetic") },
    { key: "Other", label: t("Other") },
  ];

  const severityLevels = [
    { key: "Mild", label: t("mild") },
    { key: "Moderate", label: t("moderate") },
    { key: "Severe", label: t("severe") }
  ];

  const statusOptions = [
    { key: "true", label: t("Common.status_options.active") },
    { key: "false", label: t("Common.status_options.inactive") }
  ];

  const searchFields = [
    { key: "all", label: t("Common.search_fields.all") },
    { key: "medicalConditionName", label: t("DiagnosedConditionsTable.medical_condition_name") },
    { key: "diagnosisName", label: t("DiagnosedConditionsTable.diagnosis_name") },
    { key: "notes", label: t("DiagnosedConditionsTable.notes") }
  ];

  const translateSeverity = (severity) => {
    return t(`${severity?.toLowerCase()}`);
  };

  const translateStatus = (isActive) => {
    return t(`Common.status_options.${isActive ? "active" : "inactive"}`);
  };

  return {
    conditionTypes,
    severityLevels,
    statusOptions,
    searchFields,
    translateSeverity,
    translateStatus
  };
};