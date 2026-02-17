import { useCallback } from "react";
import { useAddPrescribedMedicationMutation, useUpdatePrescribedMedicationMutation , useDeletePrescribedMedicationMutation
} from "../../../../api/PatientProfile/prescribedMedicationApi"; 
import toast from "react-hot-toast";
import { buildprescribedMedicationUpdatePayload } from "../handlerUtils";
export const usePrescribedMedication = (editingDiagnosis, setEditingDiagnosis,diagnosesData) => {
  const [addPrescribedMedication, { isLoading: isAddingPrescriptionMedication }] = useAddPrescribedMedicationMutation();
  const [updatePrescribedMedication, { isLoading: isUpdatingPrescriptionMedication }] = useUpdatePrescribedMedicationMutation();
  const [deletePrescribedMedication, { isLoading: isDeletingPrescriptionMedication }] = useDeletePrescribedMedicationMutation();
  // === Prescribed Medication Management ===
 const handleAddRecipe = useCallback((prescriptionId) => {
  console.log('Adding recipe for prescription ID:', prescriptionId);
  if (!editingDiagnosis) return;
if (editingDiagnosis?.prescriptions?.find(p => p.id === prescriptionId)?.recipes?.some(r => r.isNew)){
   toast.error('Please save the previous medication first');return;} 
 const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const endDate = oneWeekLater.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const newRecipe = {
    id: `recipe-${Date.now()}`,
    medication: "",
    dosage: "",
    startDate: today, 
    endDate: endDate, 
    durationInDays: "",
    instructions: "",
    type: "medication",
    isNew: true,
    isExpanded: true,
  };
  
  setEditingDiagnosis(prev => ({
    ...prev,
    prescriptions: (prev.prescriptions || []).map(prescription =>
      prescription.id === prescriptionId
        ? {
            ...prescription,
            recipes: [newRecipe, ...(prescription.recipes || [])]
          }
        : prescription
    )
  }));
}, [editingDiagnosis, setEditingDiagnosis]);

  const handleDeleteRecipe = useCallback(async (prescriptionId, recipeId) => {
    console.log('isDeletingPrescriptionMedication:', isDeletingPrescriptionMedication);
    if (!editingDiagnosis||isDeletingPrescriptionMedication) return;

  try {
    const recipe = editingDiagnosis.prescriptions
      ?.find(p => p.id === prescriptionId)
      ?.recipes?.find(r => r.id === recipeId);

    if (recipe && !recipe.isNew) {
        console.log('recipeId:', recipeId, 'prescriptionId:', prescriptionId, 'diagnosisId:', editingDiagnosis.diagnosisId);
        const loadingToast = toast.loading('deleting...');
      const result = await deletePrescribedMedication({prescribedMedicationId: recipeId, prescriptionId,diagnosisId: editingDiagnosis.diagnosisId}).unwrap();
      if (result?.succeeded) {
        toast.success(result?.message || 'Deleted Successfully');
        toast.dismiss(loadingToast);
      } else {
        toast.error(result?.message || 'Failed to delete');
        toast.dismiss(loadingToast);
        return; 
      }
    }

    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).filter(recipe => recipe.id !== recipeId)
            }
          : prescription
      )
    }));

  } catch (error) {
    console.error('Error deleting medication:', error);
    toast.error(error?.data?.message || 'Error deleting medication');
  }
}, [editingDiagnosis, setEditingDiagnosis, deletePrescribedMedication]);

  const handleUpdateRecipe = useCallback((prescriptionId, recipeId, field, value) => {
    // console.log('Updating recipe:', { prescriptionId, recipeId, field, value });
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).map(recipe =>
                recipe.id === recipeId ? { ...recipe, [field]: value } : recipe
              )
            }
          : prescription
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleSaveRecipe = useCallback(
  async (prescriptionId, recipeId, recipeData) => {
    if (!editingDiagnosis) return;
    if( !recipeData.dosage  ) {toast.error('Please enter dosage'); return;};
    if( !recipeData.durationInDays ) {toast.error('Please enter duration in days'); return;};
   console.log('Saving recipe:', { prescriptionId, recipeId, recipeData });
   if (editingDiagnosis.isNew) {
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).map(recipe =>
                recipe.id === recipeId
                  ? { ...recipeData, isNew: false, isExpanded: false }
                  : recipe
              )
            }
          : prescription
      )
    }));
    return; 
  }

  const targetPrescription = editingDiagnosis.prescriptions?.find(
    p => p.id === prescriptionId
  );

  if (targetPrescription?.isNew) {
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              recipes: (prescription.recipes || []).map(recipe =>
                recipe.id === recipeId
                  ? { ...recipeData, isNew: false, isExpanded: false }
                  : recipe
              )
            }
          : prescription
      )
    }));

    console.log("==Editing Diagnosis", editingDiagnosis);
    return; 
  }
   
    if (!editingDiagnosis || isAddingPrescriptionMedication || isUpdatingPrescriptionMedication) return false;

    console.log('Saving recipe:', { prescriptionId, recipeId, recipeData });

    const loadingToast = toast.loading('Saving...');

    try {
      const prescription = editingDiagnosis.prescriptions?.find((p) => p.id === prescriptionId);
      const recipe = prescription?.recipes?.find((r) => r.id === recipeId);

      if (!prescription || !recipe) {
        toast.error('Prescription or medication not found');
        toast.dismiss(loadingToast);
        return false;
      }

      const basePayload = {
        medicationName: recipeData.medication,
        dosage: recipeData.dosage,
        durationInDays: parseInt(recipeData.durationInDays, 10) || 0,
        instructions: recipeData.instructions,
        startDate: recipeData.startDate || new Date().toISOString(),
        endDate: recipeData.endDate || new Date().toISOString(),
        isActive: true
      };

      let success = false;

      if (recipe.isNew) {
        const payload = {
            medicationData:{
                ...basePayload,
                prescriptionId: prescriptionId,
                medicationId: recipeData.medication.id,
            },
            prescriptionId: prescriptionId,
            diagnosisId: editingDiagnosis.id
        };

        const result = await addPrescribedMedication(payload).unwrap();

        if (result?.succeeded) {
          toast.success(  result?.message || 'Added Successfully');
          success = true;

          setEditingDiagnosis((prev) => ({
            ...prev,
            prescriptions: (prev.prescriptions || []).map((p) =>
              p.id === prescriptionId
                ? {
                    ...p,
                    recipes: (p.recipes || []).map((r) =>
                      r.id === recipeId
                        ? {
                            ...recipeData,
                            id: result.data?.id || recipeId,
                            isNew: false,
                            isExpanded: false,
                          }
                        : r
                    ),
                  }
                : p
            ),
          }));
        } else {
          toast.error(result?.message || 'Failed to add medication');
        }
      } else {
           const originalRecord = diagnosesData?.data?.find(
       record => record.id === editingDiagnosis.diagnosisId
       ).prescriptionOverviews?.find(p => p.id === prescriptionId).prescribedMedications?.find(m => m.id === recipeId);
       const prescriptionPayload = buildprescribedMedicationUpdatePayload(originalRecord, recipeData);
       console.log("diagnosesData",diagnosesData,'===originalRecord:', originalRecord, '&&&&prescriptionPayload:', prescriptionPayload);
      
         if (!Object.keys(prescriptionPayload).length) {
               toast.dismiss(loadingToast);
               toast("No changes detected");
               return false;
         }
          const payload = {
          diagnosisId: editingDiagnosis.id,
          prescriptionId,
          medicationId: recipeId,
          prescribedMedicationId: recipeId,
          updates: prescriptionPayload
        };


        const result = await updatePrescribedMedication(payload).unwrap();

        if (result?.succeeded) {     
          toast.success(result?.message || 'Updated Successfully');
          success = true;

          setEditingDiagnosis((prev) => ({
            ...prev,
            prescriptions: (prev.prescriptions || []).map((p) =>
              p.id === prescriptionId
                ? {
                    ...p,
                    recipes: (p.recipes || []).map((r) =>
                      r.id === recipeId
                        ? { ...recipeData, isExpanded: false }
                        : r
                    ),
                  }
                : p
            ),
          }));
        } else {
          toast.error(result?.message || 'Failed to update medication');
        }
      }

      return success;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error(error?.data?.message || error?.message || 'Error saving medication');
      return false;
    } finally {
      toast.dismiss(loadingToast);
    }
  },[editingDiagnosis,isAddingPrescriptionMedication,isUpdatingPrescriptionMedication,setEditingDiagnosis,addPrescribedMedication,updatePrescribedMedication,diagnosesData]
);
  return {
    handleAddRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe,
    handleSaveRecipe,
  };
};