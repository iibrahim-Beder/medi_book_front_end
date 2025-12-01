export const medicalConditionsHelpers = (t) => {
  const conditionTypes = [
    { key: "Chronic", label: t("Conditions.types.chronic") },
    { key: "Acute", label: t("Conditions.types.acute") },
    { key: "Genetic", label: t("Conditions.types.genetic") },
    { key: "Infectious", label: t("Conditions.types.infectious") },
    { key: "Autoimmune", label: t("Conditions.types.autoimmune") }
  ];

  const severityLevels = [
    { key: "Mild", label: t("Conditions.severity.mild") },
    { key: "Moderate", label: t("Conditions.severity.moderate") },
    { key: "Severe", label: t("Conditions.severity.severe") }
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
    return t(`Conditions.severity.${severity?.toLowerCase()}`);
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