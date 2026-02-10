import { useCallback } from "react";
import {
  useAddInternalPatientMedicalConditionMutation,useDeletePatientMedicalConditionMutation,useUpdatePatientMedicalConditionMutation
} from "../../../../api/PatientProfile/patientMedicalConditionsApi";
import toast from "react-hot-toast";
import { useDiagnosisCRUD } from "../useDiagnosisCRUD";
import { buildMedicalConditionUpdatePayload } from "../handlerUtils";
export const useMedicalCondition = (editingDiagnosis, setEditingDiagnosis) => {
 
  const {diagnosesData}=useDiagnosisCRUD();
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
      isActive: true,
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
      const result = await deletePatientMedicalCondition({conditionId,diagnosisId:editingDiagnosis.id}).unwrap();
      
      if (result?.succeeded) {           
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
          isActive:(conditionData.isActive==='Active')
        }
      };

      console.log('Add Internal Patient Medical Condition Payload:', payload);
      const result = await addInternalPatientMedicalCondition(payload).unwrap();

      if (result?.succeeded) {           
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
       const originalRecord = diagnosesData?.data?.find(
             record => record.id === editingDiagnosis.diagnosisId
             ).patientInternalMedicalConditionLinkOverViews?.find(m => m.id === conditionId);
             const medicalConditionPayload = buildMedicalConditionUpdatePayload(originalRecord, conditionData);
            
               if (!Object.keys(medicalConditionPayload).length) {
                     toast.dismiss(loadingToast);
                     toast("No changes detected");
                     return false;
               }
     const payload = {
        conditionId: conditionId,
        diagnosisId: editingDiagnosis.diagnosisId,
        updates: medicalConditionPayload
      };

      console.log('Update Patient Medical Condition Payload:', payload);
      const result = await updatePatientMedicalCondition(payload).unwrap();

      if (result?.succeeded) {           
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

  return {
    handleAddCondition,
    handleDeleteCondition,
    handleUpdateCondition,
    handleSaveCondition,

  };
};