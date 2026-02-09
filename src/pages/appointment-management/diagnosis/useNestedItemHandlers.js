import { useCallback } from "react";
import { useAddDiagnosisNoteMutation, useUpdateDiagnosisNoteMutation, useDeleteDiagnosisNoteMutation } from "../../../api/PatientProfile/patientDiagnosesApi";
import {
  useAddInternalPatientMedicalConditionMutation,useDeletePatientMedicalConditionMutation,useUpdatePatientMedicalConditionMutation
} from "../../../api/PatientProfile/patientMedicalConditionsApi";
import toast from "react-hot-toast";
export const useNestedItemHandlers = (editingDiagnosis, setEditingDiagnosis ,setIsChange) => {
  const [addDiagnosisNote, { isLoading: isAddingNote }] = useAddDiagnosisNoteMutation();
  const [updateDiagnosisNote, { isLoading: isUpdatingNote }] = useUpdateDiagnosisNoteMutation();
  const [deleteDiagnosisNote, { isLoading: isDeletingNote }] = useDeleteDiagnosisNoteMutation();

   const [addInternalPatientMedicalCondition, { isLoading: isAddingCondition }] = useAddInternalPatientMedicalConditionMutation();
   const [updatePatientMedicalCondition, { isLoading: isUpdatingCondition }] = useUpdatePatientMedicalConditionMutation(); 
 const [deletePatientMedicalCondition, { isLoading: isDeletingCondition }] = useDeletePatientMedicalConditionMutation(); 

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
    handleCancelNestedItem
  };
};