
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