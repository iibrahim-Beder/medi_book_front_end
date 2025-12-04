import { useCallback } from "react";
import { useAddPrescribedMedicationMutation, useUpdatePrescribedMedicationMutation , useDeletePrescribedMedicationMutation
} from "../../../api/prescribedMedicationApi"; 
import { useAddDiagnosisNoteMutation, useUpdateDiagnosisNoteMutation, useDeleteDiagnosisNoteMutation } from "../../../api/patientDiagnosesApi";
import {
  useAddPatientPrescriptionMutation, useUpdatePatientPrescriptionMutation, useDeletePatientPrescriptionMutation
} from "../../../api/patientPrescriptionApi";

import {
  useAddInternalPatientMedicalConditionMutation,useDeletePatientMedicalConditionMutation,useUpdatePatientMedicalConditionMutation
} from "../../../api/patientMedicalConditionsApi";

import toast from "react-hot-toast";
import { t } from "i18next";
export const useNestedItemHandlers = (editingDiagnosis, setEditingDiagnosis ,setIsChange) => {
  const [addPrescribedMedication, { isLoading: isAddingPrescriptionMedication }] = useAddPrescribedMedicationMutation();
  const [updatePrescribedMedication, { isLoading: isUpdatingPrescriptionMedication }] = useUpdatePrescribedMedicationMutation();
  const [deletePrescribedMedication, { isLoading: isDeletingPrescriptionMedication }] = useDeletePrescribedMedicationMutation();

  const [addPatientPrescription, { isLoading: isAddingPrescription }] = useAddPatientPrescriptionMutation();
  const [updatePatientPrescription, { isLoading: isUpdatingPrescription  }] =  useUpdatePatientPrescriptionMutation();
  const [deletePatientPrescription, { isLoading: isDeletingPrescription }] = useDeletePatientPrescriptionMutation(); 

  const [addDiagnosisNote, { isLoading: isAddingNote }] = useAddDiagnosisNoteMutation();
  const [updateDiagnosisNote, { isLoading: isUpdatingNote }] = useUpdateDiagnosisNoteMutation();
  const [deleteDiagnosisNote, { isLoading: isDeletingNote }] = useDeleteDiagnosisNoteMutation();

   const [addInternalPatientMedicalCondition, { isLoading: isAddingCondition }] = useAddInternalPatientMedicalConditionMutation();
   const [updatePatientMedicalCondition, { isLoading: isUpdatingCondition }] = useUpdatePatientMedicalConditionMutation(); 
 const [deletePatientMedicalCondition, { isLoading: isDeletingCondition }] = useDeletePatientMedicalConditionMutation(); 

//  console.log('Editing Diagnosis:', editingDiagnosis);
  // === Recipes Management ===
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
      const result = await deletePrescribedMedication(recipeId).unwrap();
      const loadingToast = toast.loading('deleting...');
      if (result?.succeeded) {
        setIsChange(true);
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
        toast.error('Prescription or recipe not found');
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
          ...basePayload,
          prescriptionId: prescriptionId,
          medicationId: recipeData.medication.id
        };

        const result = await addPrescribedMedication(payload).unwrap();

        if (result?.succeeded) {
           setIsChange(true);
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
        const payload = {
          ...basePayload,
          prescribedMedicationId: recipeId,
           updates: {
    medicationId: recipeData.medication.id,
    dosage: recipeData.dosage,
    durationInDays: parseInt(recipeData.durationInDays, 10) || 0,
    instructions: recipeData.instructions,
    startDate: recipeData.startDate || new Date().toISOString(),
    endDate: recipeData.endDate || new Date().toISOString(),
    isActive: true
  }
        };
        console.log('Update Prescribed Medication Payload:', payload);

        const result = await updatePrescribedMedication(payload).unwrap();

        if (result?.succeeded) {            setIsChange(true);
          setIsChange(true);
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
  },
  [
    editingDiagnosis,
    isAddingPrescriptionMedication,
    isUpdatingPrescriptionMedication,
    setEditingDiagnosis,
    addPrescribedMedication,
    updatePrescribedMedication, 
  ]
);
    //  === Conditions Management ===
  const handleAddCondition = useCallback(() => {
    if (!editingDiagnosis) return;
       if (editingDiagnosis.conditions?.[0]?.isNew) {toast.error('Please save the previous condition first'); return;}
    const newCondition = {
      id: `condition-${Date.now()}`,
      medicalCondition: "",
      severity: "",
      notes: "",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: [newCondition, ...(prev.conditions || [])]
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleDeleteCondition = useCallback(async (conditionId) => {
  if (!editingDiagnosis) return;  
  const loadingToast = toast.loading('Deleting...');
  try {
    const condition = editingDiagnosis.conditions?.find(c => c.id === conditionId);
    if (editingDiagnosis.isNew) {
      setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).filter(condition => condition.id !== conditionId)
    }));
    }
    
    if (!condition) {
      toast.error('Condition not found');
      toast.dismiss(loadingToast);
      return;
    }

    if (!condition.isNew) {
      console.log('Deleting condition from API:', conditionId);
      const result = await deletePatientMedicalCondition(conditionId).unwrap();
      
      if (result?.succeeded) {            setIsChange(true);
        toast.success(result?.message || 'Deleted Successfully');
        toast.dismiss(loadingToast);
      } else {
        toast.error(result?.message || 'Failed to delete medical condition');
        toast.dismiss(loadingToast);
        return; 
      }
    }
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).filter(condition => condition.id !== conditionId)
    }));
  } catch (error) {
    console.error('Error deleting condition:', error, "conditionId",conditionId);
    toast.error(error?.data?.message || 'Error deleting medical condition');
    toast.dismiss(loadingToast);
  }
  toast.dismiss(loadingToast);
}, [editingDiagnosis, setEditingDiagnosis, deletePatientMedicalCondition]);

  const handleUpdateCondition = useCallback((conditionId, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      conditions: (prev.conditions || []).map(condition =>
        condition.id === conditionId ? { ...condition, [field]: value } : condition
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleSaveCondition = useCallback(async (conditionId, conditionData) => {
  if (!editingDiagnosis||isAddingCondition||isUpdatingCondition) return false;
  if (!conditionData.medicalCondition){toast.error('Please select a medical condition'); return;} 

  if(editingDiagnosis.isNew){ 
     setEditingDiagnosis(prev => ({
       ...prev,
       conditions: (prev.conditions || []).map(condition =>
         condition.id === conditionId ? { ...conditionData, isNew: false, isExpanded: false } : condition
       )
     }));
    return;}

  const loadingToast = toast.loading('Saving...');
  try {
    const condition = editingDiagnosis.conditions?.find(c => c.id === conditionId);
    
    if (!condition) {
      toast.error('Condition not found');
      return false;
    }

    let success = false;

    if (condition.isNew) {
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        conditionData: {
          
          medicalConditionId: conditionData.medicalCondition.id,  
          severity: conditionData.severity,
          notes: conditionData.notes || '',
          isActive: true
        }
      };

      console.log('Add Internal Patient Medical Condition Payload:', payload);
      const result = await addInternalPatientMedicalCondition(payload).unwrap();

      if (result?.succeeded) {            setIsChange(true);
        toast.success(result?.message || 'Added Successfully');
        toast.dismiss(loadingToast);
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          conditions: (prev.conditions || []).map(condition =>
            condition.id === conditionId 
              ? { 
                  ...conditionData, 
                  category: result.data?.categoryName,
                  id: result.data?.id || conditionId,
                  isNew: false, 
                  isExpanded: false 
                }
              : condition
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to add condition');
        toast.dismiss(loadingToast);
      }
    } else {
     const payload = {
        conditionId: conditionId,
        updates: {
          medicalConditionId: conditionData.medicalCondition.id,
          severity: conditionData.severity,
          notes: conditionData.notes || '',
          isActive: true
        }
      };

      console.log('Update Patient Medical Condition Payload:', payload);
      const result = await updatePatientMedicalCondition(payload).unwrap();

      if (result?.succeeded) {            setIsChange(true);
        toast.success(result?.message || 'Updated Successfully');
        toast.dismiss(loadingToast);
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          conditions: (prev.conditions || []).map(condition =>
            condition.id === conditionId 
              ? { ...conditionData, isExpanded: false }
              : condition
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to update condition');
        toast.dismiss(loadingToast);
      }
    }

    return success;
  } catch (error) {
    console.error('Error saving condition:', error);
    toast.error(error?.data?.title || 'Error saving condition');
    toast.dismiss(loadingToast);
    return false;
  }
}, [editingDiagnosis, setEditingDiagnosis, addInternalPatientMedicalCondition, isAddingCondition, isUpdatingCondition]);


  // === Notes Management ===
  const handleAddNote = useCallback(() => {
    if (!editingDiagnosis) return;
      if (editingDiagnosis.notes?.[0]?.isNew) {toast.error('Please save the previous note first'); return;}
    const newNote = {
      id: `note-${Date.now()}`,
      note: "",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])]
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleDeleteNote = useCallback(async (noteId) => {
  if (!editingDiagnosis|| isDeletingNote) return;
  const loadingToast = toast.loading('Deleting...');
  try {
    const note = editingDiagnosis.notes?.find(n => n.id === noteId);    
    if (note && !note.isNew) {
      const result = await deleteDiagnosisNote(noteId).unwrap();
      
      if (result?.succeeded) {            setIsChange(true);
        toast.success('Deleted Successfully');
        toast.dismiss(loadingToast);
      } else {
        toast.error(result?.message || 'Failed to delete');
        toast.dismiss(loadingToast);
        return; 
      }
    }

    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).filter(note => note.id !== noteId)
    }));

  } catch (error) {
    // console.error('Error deleting note:', error);
    toast.error(error?.data?.message || error?.message || 'Error deleting note');
  }
  toast.dismiss(loadingToast);
}, [editingDiagnosis, setEditingDiagnosis, deleteDiagnosisNote]);

  const handleUpdateNote = useCallback((noteId, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).map(note =>
        note.id === noteId ? { ...note, [field]: value } : note
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleSaveNote = useCallback(async (noteId, noteData) => {
  if (!editingDiagnosis || isUpdatingNote || isAddingNote ) return;
  if (!noteData.note){ toast.error('Note cannot be empty'); return;}
  console.log('Editing Diagnosis:', editingDiagnosis, "noteId:", noteId, "noteData:", noteData);
        if(editingDiagnosis.isNew){
          setEditingDiagnosis(prev => ({...prev,notes: (prev.notes || []).map(note =>note.id === noteId ? { ...noteData, isNew: false, isExpanded: false } : note)}));
          return;
        }
      const loadingToast = toast.loading('Saving...');
  try {
    const note = editingDiagnosis.notes?.find(n => n.id === noteId);
    
    if (!note) {
      toast.error('Note not found');
      toast.dismiss(loadingToast);
      return;
    }

    let success = false;

    if (note.isNew) {
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        content: noteData.note
      };

      console.log('Add Diagnosis Note Payload:', payload);
      const result = await addDiagnosisNote(payload).unwrap();

      if (result?.succeeded) {            setIsChange(true);
        toast.success( result?.message || 'Saved Successfully');
        toast.dismiss(loadingToast);
        
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          notes: (prev.notes || []).map(note =>
            note.id === noteId 
              ? { 
                  ...noteData, 
                  id: result.data?.id || noteId,
                  isNew: false, 
                  isExpanded: false 
                }
              : note
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
        toast.dismiss(loadingToast);
      }
    } else {
      const payload = {
        diagnosisNoteId: noteId,
        noteContent: noteData.note
      };

      console.log('Update Diagnosis Note Payload:', payload);
      const result = await updateDiagnosisNote(payload).unwrap();

      if (result?.succeeded) {            setIsChange(true);
        toast.success(result?.message || 'Saved Successfully');
        toast.dismiss(loadingToast);
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          notes: (prev.notes || []).map(note =>
            note.id === noteId 
              ? { ...noteData, isExpanded: false }
              : note
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
        toast.dismiss(loadingToast);
      }
    }

    return success;
  } catch (error) {
    console.error('Error saving note:', error);
    toast.error(error?.data?.title || 'Error saving note');
    toast.dismiss(loadingToast);
    return false;
  }
}, [editingDiagnosis, setEditingDiagnosis, addDiagnosisNote, updateDiagnosisNote]);

  // === Prescriptions Management ===
  const handleAddPrescription = useCallback(() => {
    if (!editingDiagnosis) return;
   if (editingDiagnosis.prescriptions?.[0]?.isNew) {toast.error('Please save the previous prescription first'); return;}
    const newPrescription = {
      id: `prescription-${Date.now()}`,
      title: "",
      status: "Active",
      notes: "",
      type: "Medical",
      date: new Date().toISOString().split("T")[0],
      recipes: [],
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
    prescriptions: [
      newPrescription,
      ...(prev.prescriptions?.map(p => ({ ...p, isExpanded: false })) || [])
    ]
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

   const handleDeletePrescription = useCallback(async (prescriptionId) => {
  if (!editingDiagnosis||isDeletingPrescription) return;

  if (editingDiagnosis.isNew) {
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(prescription => prescription.id !== prescriptionId)
    }))
  };

  const loadingToast = toast.loading('Deleting...');
  try {
    const prescription = editingDiagnosis.prescriptions?.find(p => p.id === prescriptionId);
    
    if (!prescription) {
      toast.error('Prescription not found');
      return;
    }

    if (!prescription.isNew) {
      const result = await deletePatientPrescription(prescriptionId).unwrap();
      
      if (result?.succeeded) {
        setIsChange(true);
        toast.success(result?.message || 'Deleted Successfully');
      } else {
        toast.error(result?.message || 'Failed to delete');
        return; 
      }
    }

    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(prescription => prescription.id !== prescriptionId)
    }));

  } catch (error) {
    console.error('Error deleting prescription:', error);
    toast.error(error?.data?.message || 'Error deleting prescription');
  }finally {
    toast.dismiss(loadingToast);
  }
   }, [editingDiagnosis, setEditingDiagnosis, deletePatientPrescription]);

  const handleUpdatePrescription = useCallback((prescriptionId, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId ? { ...prescription, [field]: value } : prescription
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

  const handleSavePrescription = useCallback(async (prescriptionId, prescriptionData) => {
    console.log('Saving prescription:', prescriptionData);
    if (!editingDiagnosis|| isAddingPrescription|| isUpdatingPrescription) return;
    if (!prescriptionData.title){ toast.error('Prescription title is required'); return false;};
    if (!prescriptionData.status){ toast.error('Prescription title is required'); return false;};
    if (editingDiagnosis.isNew) {
      setEditingDiagnosis(prev => ({
        ...prev,
        prescriptions: (prev.prescriptions || []).map(prescription =>
          prescription.id === prescriptionId ? { ...prescriptionData, isNew: false, isExpanded: false } : prescription
        )
      }));
      return;
    }
    const loadingToast = toast.loading('Saving...');
      try {
    const prescription = editingDiagnosis.prescriptions?.find(p => p.id === prescriptionId);
    
    if (!prescription) {
      toast.error('Prescription not found');
      return false;
    }

    let success = false;

    if (prescription.isNew) {
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        prescriptionData: {
          title: prescriptionData.title,
          notes: prescriptionData.notes,
          status: prescriptionData.status,
          prescribedMedications: (prescriptionData.recipes || []).map(med => ({
            medicationName: med.medication, 
            startDate: med.startDate || new Date().toISOString(),
            endDate: med.endDate || new Date().toISOString(),
            dosage: med.dosage,
            durationInDays: parseInt(med.durationInDays) || 0,
            instructions: med.instructions
          }))
        }
      };

      console.log('Add Patient Prescription Payload:', payload);
      const result = await addPatientPrescription(payload).unwrap();
         console.log('Add Patient Prescription Result:', result);
      if (result?.succeeded) { 
        setIsChange(true);
        toast.success( result?.message || 'Saved Successfully');
        success = true;
        console.log('Add Patient Prescription Result:', result);

        setEditingDiagnosis(prev => ({
        ...prev,
        prescriptions: (prev.prescriptions || []).map(prescription =>
          prescription.id === prescriptionId ? { ...prescriptionData, id: result.data.id, isNew: false, isExpanded: false } : prescription
        )
      }));
      } else {
        toast.error(result?.message || 'Failed to save');
      }
    } else {
       const payload = {
        prescriptionId: prescriptionId, 
        updates: {
          title: prescriptionData.title,
          notes: prescriptionData.notes,
          status: prescriptionData.status
        }
      };

      console.log('Update Patient Prescription Payload:', payload);
      const result = await updatePatientPrescription(payload).unwrap();

      if (result?.succeeded) {            setIsChange(true);
        toast.success(result?.message || 'Saved Successfully');
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          prescriptions: (prev.prescriptions || []).map(p =>
            p.id === prescriptionId 
              ? { ...prescriptionData, isExpanded: false }
              : p
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
      }
    }

    return success;
  } catch (error) {
    console.error('Error saving prescription:', error);
    toast.error(error?.data?.message || 'Failed to save');
    return false;
  }finally{
    toast.dismiss(loadingToast);
  }
}, [
  editingDiagnosis, 
  setEditingDiagnosis, 
  addPatientPrescription, 
  updatePatientPrescription,
  isAddingPrescription,
  isUpdatingPrescription
]);
  // Handle cancel for nested items
  const handleCancelNestedItem = useCallback((itemType, itemId) => {
    if (!editingDiagnosis) return;
   
    const item = editingDiagnosis[itemType]?.find(item => item.id === itemId);
   
    if (item?.isNew) {
      // Remove new item
      const updatedItems = editingDiagnosis[itemType].filter(item => item.id !== itemId);
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    } else {
      // Collapse existing item
      const updatedItems = editingDiagnosis[itemType].map(item =>
        item.id === itemId ? { ...item, isExpanded: false } : item
      );
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    }
  }, [editingDiagnosis, setEditingDiagnosis]);

  return {
    handleAddCondition,
    handleDeleteCondition,
    handleUpdateCondition,
    handleSaveCondition,
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    handleSaveNote,
    handleAddPrescription,
    handleDeletePrescription,
    handleUpdatePrescription,
    handleSavePrescription,
    handleAddRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe,
    handleSaveRecipe,
    handleCancelNestedItem
  };
};