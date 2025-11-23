import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  useAddPatientDiagnosisMutation,
  useUpdatePatientDiagnosisMutation,
  useDeletePatientDiagnosisMutation
} from "../../../api/patientDiagnosesApi";
import { transformDiagnosisData } from "./diagnosisUtils";

const PATIENT_ID = 4;

export const useDiagnosisCRUD = (refetch,setCurrentItems) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    diagnosisId: null,
    diagnosisName: ""
  });

  // API Mutations
  const [addDiagnosis, { isLoading: isAdding }] = useAddPatientDiagnosisMutation();
  const [updateDiagnosis, { isLoading: isUpdating }] = useUpdatePatientDiagnosisMutation();
  const [deleteDiagnosis, { isLoading: isDeleting }] = useDeletePatientDiagnosisMutation();

 const handleSaveDiagnosis = useCallback(async (diagnosisData) => {
    try {
      const diagnosisPayload = {
        patientId: PATIENT_ID,
        diagnosisName: diagnosisData.diagnosisName,
        symptomsDescription: diagnosisData.symptomsDescription,
        description: diagnosisData.description,
        code: diagnosisData.code || "0000",
      };

      console.log('Saving diagnosis payload:', diagnosisPayload);
      let result;

      if (diagnosisData.isNew) {
        result = await addDiagnosis(diagnosisPayload).unwrap();
        
        if (result?.succeeded) {
          toast.success(result.message || "Diagnosis saved successfully");
          
          if (setCurrentItems) {
            const newDiagnosis = transformDiagnosisData(result.data);
            setCurrentItems(prev => [newDiagnosis, ...prev]);
          }
          
          return true;
        } else {
          toast.error(result.message || "Failed to save diagnosis");
          return false;
        }
      } else {
        result = await updateDiagnosis({
          diagnosisId: diagnosisData.diagnosisId,
          patientId: PATIENT_ID,
          updates: diagnosisPayload
        }).unwrap();

        if (result?.succeeded) {
          toast.success(result.message || "Diagnosis updated successfully");
          
          if (setCurrentItems) {
            setCurrentItems(prev => prev.map(item => 
              item.diagnosisId === diagnosisData.diagnosisId 
                ? { ...item, ...diagnosisData }
                : item
            ));
          }
          
          return true;
        } else {
          toast.error(result.message || "Failed to update diagnosis");
          return false;
        }
      }
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error(error?.data?.message || "Error saving diagnosis");
      return false;
    }
  }, [addDiagnosis, updateDiagnosis, setCurrentItems]);

  const handleAddDiagnosis = useCallback(() => {
    const newDiagnosis = {
      id: `temp-${Date.now()}`,
      diagnosisId: null,
      diagnosisName: "",
      symptomsDescription: "",
      description: "",
      code: "",
      notes: [],
      conditions: [],
      prescriptions: [],
      isNew: true,
      isExpanded: true,
    };
   
    setEditingDiagnosis(newDiagnosis);
    setSelectedDiagnosis(newDiagnosis);
  }, []);

  const handleUpdateDiagnosis = useCallback((field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      [field]: value
    }));
  }, [editingDiagnosis]);

  const handleEditDiagnosis = useCallback((diagnosis) => {
    // console.log('Opening modal with already transformed diagnosis:', diagnosis);
    setSelectedDiagnosis(diagnosis);
    setEditingDiagnosis({ ...diagnosis });
  }, []);

  const handleShowDeleteConfirm = useCallback((diagnosisId, diagnosisName) => {
    setDeletePopup({
      show: true,
      diagnosisId,
      diagnosisName
    });
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeletePopup({
      show: false,
      diagnosisId: null,
      diagnosisName: ""
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deletePopup.diagnosisId) {
      try {
        if (deletePopup.diagnosisId.toString().startsWith('temp-')) {
          setEditingDiagnosis(null);
          setSelectedDiagnosis(null);
        } else {
          const result = await deleteDiagnosis(deletePopup.diagnosisId).unwrap();
          if (result?.succeeded) {
            toast.success(result.message || "Diagnosis deleted successfully");
            refetch();
          } else {
            toast.error(result.message || "Failed to delete diagnosis");
          }
        }
        handleCloseDeleteConfirm();
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
        toast.error(error?.data?.message || "Error deleting diagnosis");
      }
    }
  }, [deletePopup, deleteDiagnosis, refetch, handleCloseDeleteConfirm]);

  const handleDeleteDiagnosis = useCallback((id) => {
    handleShowDeleteConfirm(id, 'Unnamed Diagnosis');
  }, [handleShowDeleteConfirm]);

  const handleSaveAndClose = useCallback(async () => {
    if (!editingDiagnosis) return;
    
    const isEmptyNewDiagnosis =
      editingDiagnosis.isNew &&
      !editingDiagnosis.diagnosisName?.trim() &&
      !editingDiagnosis.symptomsDescription?.trim() &&
      !editingDiagnosis.description?.trim();

    if (isEmptyNewDiagnosis) {
      setEditingDiagnosis(null);
      setSelectedDiagnosis(null);
      return;
    }

    const success = await handleSaveDiagnosis(editingDiagnosis);
   
    if (success) {
      setSelectedDiagnosis(null);
      setEditingDiagnosis(null);
    }
  }, [editingDiagnosis, handleSaveDiagnosis]);

  const handleCancelEdit = useCallback(() => {
     console.log("handleCancelEdit","Selected Diagnosis:", selectedDiagnosis, "editingDiagnosis:", editingDiagnosis);

    console.log('Cancel edit', "editingDiagnosis : " ,editingDiagnosis);
    if (editingDiagnosis?.isNew) {
      const hasContent =
        editingDiagnosis.diagnosisName?.trim() ||
        editingDiagnosis.symptomsDescription?.trim() ||
        editingDiagnosis.description?.trim();

      if (!hasContent) {
        setEditingDiagnosis(null);
        setSelectedDiagnosis(null);
      } else {
        handleShowDeleteConfirm(
          editingDiagnosis.id,
          editingDiagnosis.diagnosisName || 'New Diagnosis'
        );
        return;
      }
    } else {

      setSelectedDiagnosis(null);
      setEditingDiagnosis(null);
    }
  }, [editingDiagnosis, handleShowDeleteConfirm]);

  return {
    selectedDiagnosis,
    editingDiagnosis,
    setEditingDiagnosis,
    deletePopup,
    isAdding,
    isUpdating,
    isDeleting,
    handleAddDiagnosis,
    handleEditDiagnosis,
    handleSaveDiagnosis,
    handleCancelEdit,
    handleSaveAndClose,
    handleShowDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
    handleDeleteDiagnosis,
    handleUpdateDiagnosis
  };
  
};