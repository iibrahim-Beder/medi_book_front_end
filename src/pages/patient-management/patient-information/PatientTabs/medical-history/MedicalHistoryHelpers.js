import { formatDate as formatDateMain} from "../../../../shared/FormatDate";
export const medicalHistoryHelpers = (t) => {
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const needsExpand = (text, maxLength = 70) => {
    return text && text.length > maxLength;
  };  const formatDate = (dateString) => {
 formatDateMain(dateString)
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
    formatDate,
    historyTypes,
    hereditaryDiseases,
    fieldMapping,
    getTranslation
  };
};