import { getStatusText } from "../../../api/PatientProfile/patientPrescriptionApi";

export const createIndexBasedHandlers = (items, handlers) => {
  return {
    onDelete: (index) => {
      const item = items?.[index];
      if (item && item.id) {
        handlers.onDelete(item.id);
      }
    },
    onUpdate: (index, field, value) => {
      const item = items?.[index];
      if (item && item.id) {
        handlers.onUpdate(item.id, field, value);
      }
    },
    onSave: (index, itemData) => {
      const item = items?.[index];
      if (item && item.id) {
        handlers.onSave(item.id, itemData);
      }
    },
    onCancel: (index) => {
      const item = items?.[index];
      if (item && item.id) {
        handlers.onCancel(item.id);
      }
    }
  };
};

export const createTwoLevelHandlers = (prescriptions, handlers) => {
  return {
    onDelete: (index) => {
      const prescription = prescriptions?.[index];
      if (prescription && prescription.id) {
        handlers.onDelete(prescription.id);
      }
    },
    onUpdate: (index, field, value) => {
      const prescription = prescriptions?.[index];
      if (prescription && prescription.id) {
        handlers.onUpdate(prescription.id, field, value);
      }
    },
    onSave: (index, prescriptionData) => {
      const prescription = prescriptions?.[index];
      if (prescription && prescription.id) {
        handlers.onSave(prescription.id, prescriptionData);
      }
    },
    onCancel: (index) => {
      const prescription = prescriptions?.[index];
      if (prescription && prescription.id) {
        handlers.onCancel(prescription.id);
      }
    },
    onAddRecipe: (prescriptionIndex) => {
      const prescription = prescriptions?.[prescriptionIndex];
      if (prescription && prescription.id) {
        handlers.onAddRecipe(prescription.id);
      }
    },
    onDeleteRecipe: (prescriptionIndex, recipeIndex) => {
      const prescription = prescriptions?.[prescriptionIndex];
      if (prescription && prescription.id) {
        const recipe = prescription.recipes?.[recipeIndex];
        if (recipe && recipe.id) {
          handlers.onDeleteRecipe(prescription.id, recipe.id);
        }
      }
    },
    onUpdateRecipe: (prescriptionIndex, recipeIndex, field, value) => {
      const prescription = prescriptions?.[prescriptionIndex];
      if (prescription && prescription.id) {
        const recipe = prescription.recipes?.[recipeIndex];
        if (recipe && recipe.id) {
          handlers.onUpdateRecipe(prescription.id, recipe.id, field, value);
        }
      }
    },
    onSaveRecipe: (prescriptionIndex, recipeIndex, recipeData) => {
      const prescription = prescriptions?.[prescriptionIndex];
      if (prescription && prescription.id) {
        const recipe = prescription.recipes?.[recipeIndex];
        if (recipe && recipe.id) {
          handlers.onSaveRecipe(prescription.id, recipe.id, recipeData);
        }
      }
    }
  };
};


export const buildDiagnosisUpdatePayload = (original, updated) => {
  const payload = {};
  console.log("===original", original, "updated", updated);

  if (updated.diagnosisName !== original.diagnosisName) {
    payload.diagnosisName = updated.diagnosisName || null;
  }

  if (updated.symptomsDescription !== original.symptomsDescription) {
    payload.symptomsDescription = updated.symptomsDescription || null;
  }

  if (updated.description !== original.description) {
    payload.description = updated.description || null;
  }

  if (updated.code !== original.code) {
    payload.code = updated.code|| null;
  }
  return payload;
};
export const buildPrescriptionsUpdatePayload = (original, updated) => {
  const payload = {};

  if (updated.title !== original.title) {
    payload.title = updated.title || null;
  }

  if (updated.symptomsDescription !== original.symptomsDescription) {
    payload.symptomsDescription = updated.symptomsDescription || null;
  }

  if (updated.status !== original.status) {
    payload.status =   updated.status  || null;
  }

  if (updated.notes !== original.notes) {
    payload.notes = updated.notes|| null;
  }
  return payload;
};
export const buildprescribedMedicationUpdatePayload = (original, updated) => {
  const payload = {};
  console.log("============original", original, "updated", updated);

  if (updated.dosage !== original.dosage) {
    payload.dosage = updated.dosage || null;
  }
  if (updated.instructions !== original.instructions) {
    payload.instructions = updated.instructions || null;
  }

  if (updated.durationInDays !== original.durationInDays) {
    payload.durationInDays = updated.durationInDays || null;
    payload.endDate=(() => {
          const start = new Date(updated.startDate || new Date());
          start.setDate(start.getDate() + (parseInt(updated.durationInDays, 10) || 0));
          return start.toISOString();
        })()
  }
  
  if (updated.startDate !== original.startDate) {
    payload.startDate =   updated.startDate  || null;
  }

  if (updated.medication.name !== original.medicationName) {
    payload.medicationId = updated.medication.id|| null;
  }
  return payload;
};

export const buildMedicalConditionUpdatePayload = (original, updated) => {
  const payload = {};
  console.log("original", original, "updated", updated);

  if (updated.isActive !== original.isActive && (updated.isActive==="Active") !== original.isActive) {
    payload.isActive = (updated.isActive === "Active") || false;
  }
  if (updated.notes !== original.notes) {
    payload.notes = updated.notes || null;
  }

  if (updated.severity !== getStatusText(original.severity)&& updated.severity !== original.severity) {
    payload.severity =   updated.severity  || null;
  }
  if (updated.medicalCondition.name !== original.medicalConditionName) {
    payload.medicationId = updated.medicalCondition.id|| null;
  }

  return payload;
};