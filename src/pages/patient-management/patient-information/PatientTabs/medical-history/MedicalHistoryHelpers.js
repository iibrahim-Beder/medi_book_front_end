import { transformHistoryTypeToAPI } from "../../../../../api/PatientProfile/medicalHistoryApi";

export const medicalHistoryHelpers = (t) => {
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const needsExpand = (text, maxLength = 70) => {
    return text && text.length > maxLength;
  };  
  


  const historyTypes = [
    { key: "Surgery", label: t("Surgery") },
    { key: "FamilyHistory", label: t("FamilyHistory") },
    { key: "Hospitalization", label: t("Hospitalization") },
    { key: "Vaccination", label: t("Vaccination") },
    { key: "Accident", label: t("Accident") },
    { key: "Others", label: t("Others") }
  ];

  const hereditaryDiseases = [
    t("Diabetes"),
    t("Heart Disease"),
    t("Cancer"),
    t("Hypertension"),
    t("Asthma"),
    t("Mental Health Disorders"),
    t("Other")
  ];

  const fieldMapping = {
    description: "Description",
    hereditaryDiseaseName: "HereditaryDiseaseName",
    relatedPerson: "RelatedPerson",
    notes: "Notes"
  };

  const getTranslation = (key) => t(`MedicalHistory.${key}`);

  return {
    truncateText,
    needsExpand,
    historyTypes,
    hereditaryDiseases,
    fieldMapping,
    getTranslation
  };
};
export const validateForm = ( medicalHistory ) => {
  console.log('Validating form:', medicalHistory);
 if (!medicalHistory.historyType) {
    return "Please select a history type.";
  }
  if (!medicalHistory.dateOfEvent) {
    return "Please enter a date.";
  }
  if  ( medicalHistory.historyType === "Family History" && (!medicalHistory.hereditaryDisease?.id || !medicalHistory.hereditaryDisease?.name)) {
    return "Please select a hereditary disease.";
  }
};

// MedicalHistoryHelpers.js
export const buildUpdatePayload = (original, updated) => {
  const payload = {};

  if (updated.historyType !== original.historyType) {
    payload.historyType = transformHistoryTypeToAPI(updated.historyType);
  }

  if (updated.hereditaryDisease?.name !== original.hereditaryDisease?.name) {
    payload.hereditaryDiseaseId = updated.hereditaryDisease?.id ?? null;
  }

  if (updated.description !== original.description) {
    payload.description = updated.description || null;
  }

  if (updated.dateOfEvent !== original.dateOfEvent) {
    payload.dateOfEvent = updated.dateOfEvent || null;
  }

  if (updated.relatedPerson !== original.relatedPerson) {
    payload.relatedPerson = updated.relatedPerson || null;
  }

  if (updated.notes !== original.notes) {
    payload.notes = updated.notes || null;
  }

  return payload;
};
