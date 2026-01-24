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
export const isHasMatched = (item , fieldName ) => {
  const matchedFields = item?.highlightInfo?.matchedFields || [];

  if (!matchedFields.length) return false;

  if (fieldName === "main") {
    return true;
  }

  return matchedFields.some(
    m => m.field?.toLowerCase() === fieldName.toLowerCase()
  );
};


export const hasHiddenMatch = (diagnoses, field, value, searchTerm) => {
  // console.log("diagnoses", diagnoses,"field", field,"value", value,"searchTerm", searchTerm);
  if (!diagnoses) return false; 
  if (!value || value.length <= 45 || !searchTerm) return false;

const hasFieldMatch = diagnoses.highlightInfo?.matchedFields?.some(
  m => m.field.toLowerCase() === field.toLowerCase()
);


  if (!hasFieldMatch) return false;

  const lowerValue = value.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  const matchIndex = lowerValue.indexOf(lowerSearch);
  console.log("matchIndex", matchIndex);

  return matchIndex >= 45;
};
