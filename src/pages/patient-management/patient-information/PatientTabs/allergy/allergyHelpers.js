import { formatDate, formatDateForAPI } from "../../../../shared/utils";

export const allergyHelpers = (t) => {

  // Form fields configuration for modal
  const fields = [
    {
      name: "allergenName",
      label: t("AllergyTable.allergy_name"),
      type: "dropdown",
      placeholder: t("AllergyTable.enter_allergy_name"),
      // required: true
    },
    {
      name: "severity",
      label: t("AllergyTable.severity"),
      type: "select",
      options: [
        { value: "Mild", label: t("AllergyTable.severity_options.Mild") },
        {
          value: "Moderate",
          label: t("Moderate"),
        },
        {
          value: "Severe",
          label: t("AllergyTable.severity_options.Severe"),
        },
      ],
      placeholder: t("AllergyTable.select_severity"),
    },
    {
      name: "isActive",
      label: t("AllergyTable.active"),
      type: "select",
      options: [
        { value: true, label: t("AllergyTable.active_options.Active") },
        {
          value: false,
          label: t("AllergyTable.active_options.Inactive"),
        },
      ],
      placeholder: t("AllergyTable.select_active_status"),
    },
    {
      name: "dateNoted",
      label: t("AllergyTable.date_noted"),
      type: "date",
      placeholder: t("AllergyTable.select_date"),
    },
    {
      name: "reaction",
      label: t("AllergyTable.reaction"),
      type: "text",
      placeholder: t("AllergyTable.enter_reaction"),
    },
    {
      name: "notes",
      label: t("AllergyTable.notes"),
      type: "textarea",
      placeholder: t("AllergyTable.enter_notes"),
    },
  ];

  const filterConfigs = [
    {
      name: "status",
      label: "Status",
      data: ["All", "Active", "Inactive"].map((opt) => ({
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

  // Field mapping for highlight
  const fieldMapping = {
    allergenName: "AllergenName",
    reaction: "Reaction", 
    notes: "Notes"
  };

  const translateSeverity = (severity) => {
    return t(`AllergyTable.severity_options.${severity}`);
  };

  const translateStatus = (isActive) => {
    return t(`AllergyTable.active_options.${isActive ? "Active" : "Inactive"}`);
  };

  return {
    fields,
    filterConfigs,
    fieldMapping,
    formatDate,
    translateSeverity,
    translateStatus
  };
};


const transformSeverityToAPI = (severity) => {
  const severityMap = {
    'Mild': 0,
    'Moderate': 1, 
    'Severe': 2
  };
  return severityMap[severity] ?? null;
};
export const validateAllergyForm = (record) => {
  console.log("===record", record);
  if (!record.allergenNameId && !record.allergenName ) return "Please select an allergen.";
  if (!record.severity) return "Please select severity.";
  if (!record.dateNoted) return "Please select date noted.";
  return null;
};

export const buildAllergyUpdatePayload = (original, updated) => {
  const payload = {};
  console.log("===original", original, "updated", updated);

  if (updated.allergenName !== original.allergenName) {
    payload.allergenId = updated.allergenNameId;
  }

  if (updated.severity !== original.severity) {
    payload.severity =transformSeverityToAPI(updated.severity);
  }

  if (updated.isActive !== original.isActive) {
    payload.isActive = updated.isActive;
  }

  if (updated.reaction !== original.reaction) {
    payload.reaction = updated.reaction || "";
  }

  if (updated.notes !== original.notes) {
    payload.notes = updated.notes || "";
  }

  if (updated.dateNoted !== original.dateNoted) {
    payload.dateNoted = formatDateForAPI(updated.dateNoted);
  }

  return payload;
};
