export const shouldExpand = (text, maxLength = 80) => {
  return text && text.length > maxLength;
};

const FIELD_MAP = {
  instructions: "Instructions",
  diagnosisName: "DiagnosisName",
  prescriptionName: "PrescribedName",
};

export const hasMatchForField = (item, field) => {
  const apiField = FIELD_MAP[field];
  if (!apiField) return false;

  return item.highlightInfo?.matchedFields?.some(
    match => match.field === apiField
  );
};
