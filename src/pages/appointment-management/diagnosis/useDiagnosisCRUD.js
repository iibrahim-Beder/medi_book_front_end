import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  useAddPatientDiagnosisMutation,
  useUpdatePatientDiagnosisMutation,
  useDeletePatientDiagnosisMutation,
  useGetPatientDiagnosesQuery
} from "../../../api/PatientProfile/patientDiagnosesApi";
import { removeNewChildren, transformDiagnosisData } from "./diagnosisUtils";
import { buildDiagnosisUpdatePayload } from "./handlerUtils";
import { BsFillInfoCircleFill } from "react-icons/bs";

const PATIENT_ID = 4;

export const useDiagnosisCRUD = (setCurrentItems) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(3);
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    diagnosisId: null,
    diagnosisName: ""
  });
    const {
      data: diagnosesData,
      isLoading,
      error,
      isFetching,
      refetch
    } = useGetPatientDiagnosesQuery({
      patientId: PATIENT_ID,
      pageNumber: currentPage,
      pageSize: rowsPerPage
    });
  
  // API Mutations
  const [addDiagnosis, { isLoading: isAdding }] = useAddPatientDiagnosisMutation(); 
  const [updateDiagnosis, { isLoading: isUpdating }] = useUpdatePatientDiagnosisMutation();
  const [deleteDiagnosis, { isLoading: isDeleting }] = useDeletePatientDiagnosisMutation();


 const handleSaveDiagnosis = useCallback(async (diagnosisData) => {
  console.log('Saving diagnosis data:', diagnosisData);
  if (isAdding || isUpdating ) return;
  if (!diagnosisData) {
    console.error('No diagnosis data provided');
    toast.error("No diagnosis data to save");
    return false;
  }else{
    // if(!diagnosisData.diagnosisName) {toast.error('Diagnosis name is required.') ;return false ;};
  }
  const loadingToast = toast.loading('Saving...');
  if (diagnosisData.isNew) {
    console.log('Sending add data:', diagnosisData);
     try {
    const result = await addDiagnosis({
      patientId: PATIENT_ID, 
      diagnosisData: diagnosisData 
    }).unwrap();

            console.log("Add Diagnosis Result:",result);
    
    if (result?.succeeded) {
      toast.success("Diagnosis saved successfully");
      toast.dismiss(loadingToast);
      if(result?.meta?.hasRejections){
        
        if (result?.meta?.hasRejections) {
          const rejectedC = result?.meta?.results?.PatientMedicalConditionLinks.rejected || [];
        rejectedC.forEach(item => {
          const rejectedMed = (diagnosisData.conditions || []).find(
            med => med.medicalCondition.id === item.itemId
          );
      
          const medName = rejectedMed ? rejectedMed.medicalCondition.name : "therapy medical condition";
      
          toast(
            `${medName}, failed: ${item.reason}`,
            {
              icon: <BsFillInfoCircleFill style={{ fontSize: "large" }} />,
              duration: 15000,
            }
          );
        });

           const prescriptions = diagnosisData?.prescriptions||[];
          //  const prescriptions = prescriptionData || [];
                const rejectedM = result?.meta?.results?.PrescribedMedications.rejected || [];
              
                if (result?.meta?.hasRejections) {
                    const allRecipes = prescriptions.flatMap(p => p.recipes || []);
                    console.log(  "diagnosisData",diagnosisData, "allRecipes", allRecipes, "prescriptions", prescriptions,);
                                  
                    rejectedM.forEach(item => {
                      const rejectedMed = allRecipes.find(
                        med => med.medication.id === item.itemId
                      );
                                
                  const medName = rejectedMed ? rejectedMed.medication.name : "therapy medication";
              
                  toast(
                    `${medName}, failed: ${item.reason}`,
                    {
                      icon: <BsFillInfoCircleFill style={{ fontSize: "large" }} />,
                      duration: 15000,
                    }
                  );
                });
              
              }
      
      }
      }      
      return true;
    } else {
      console.log("Failed to save diagnosis:", result);
      toast.error(result.message || "Failed to save diagnosis");
      toast.dismiss(loadingToast);
      return false;
    }
  } catch (error) {
    console.log("Error saving diagnosis:", error);
    toast.error(error?.data?.message || "Error saving diagnosis");
    toast.dismiss(loadingToast);
    return false;
  }
    
  }else
    {
      const originalRecord = diagnosesData?.data?.find(
        r => r.diagnosisId === diagnosisData.diagnosisId
      );
      console.log("diagnosesData",diagnosesData,'===originalRecord:', originalRecord);
      if (!originalRecord) {
        console.error('Original record not found');
        toast.error('error saving diagnosis');
        toast.dismiss(loadingToast);
        return false;
      }
        const diagnosisPayload = buildDiagnosisUpdatePayload(originalRecord, diagnosisData);
        // console.log('===diagnosisPayload:', diagnosisPayload);
     if (!Object.keys(diagnosisPayload).length) {
            toast.dismiss(loadingToast);
            toast("No changes detected");
            return true;
          }
      try {
        let result;
          result = await updateDiagnosis({
          diagnosisId: diagnosisData.diagnosisId,
          patientId: PATIENT_ID,
          updates: diagnosisPayload
        }).unwrap();

        if (result?.succeeded) {
          toast.success("Diagnosis updated successfully");
          toast.dismiss(loadingToast);
                   
          return true;
        } else {
          toast.error(result.message || "Failed to update diagnosis");
          toast.dismiss(loadingToast);
          return false;
        }
      }   
     catch (error) {
      console.log('Error saving diagnosis:', error);
      toast.error(error?.message || "Error saving diagnosis");
      toast.dismiss(loadingToast);
      return false;
    }
    }
  }, [addDiagnosis, updateDiagnosis,isAdding,isUpdating,diagnosesData]);

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
    console.log('isDeleting:', isDeleting);
    if(isDeleting) return;
    if (deletePopup.diagnosisId) {
      const loadingToast = toast.loading('Deleting...');
      try {
        if (deletePopup.diagnosisId.toString().startsWith('temp-')) {
          setEditingDiagnosis(null);
          setSelectedDiagnosis(null);
        } else {
          const result = await deleteDiagnosis({ diagnosisId:deletePopup.diagnosisId, patientId:  PATIENT_ID}).unwrap();
          if (result?.succeeded) {
            toast.success("Diagnosis deleted successfully");
            setEditingDiagnosis(null);
            setSelectedDiagnosis(null);            
            toast.dismiss(loadingToast);
          } else {
            toast.error(result.message || "Failed to delete diagnosis");
          }
        }
        handleCloseDeleteConfirm();
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
        toast.error(error?.data?.message || "Error deleting diagnosis");
        toast.dismiss(loadingToast);
      }finally {
        toast.dismiss(loadingToast);
      }
    }
  }, [deletePopup, deleteDiagnosis, refetch, handleCloseDeleteConfirm, isDeleting]);

  const handleDeleteDiagnosis = useCallback((id,diagnosisName) => {
    console.log('Deleting diagnosis with ID:', id, 'Name:', editingDiagnosis);
    handleShowDeleteConfirm(id, diagnosisName);
  }, [handleShowDeleteConfirm]);

  const handleSaveAndClose = useCallback(async () => {
    if(!editingDiagnosis.diagnosisName){toast.error('Diagnosis name is required.');return false;};
    if (!editingDiagnosis) return;
    if (isAdding || isUpdating) return;
    console.log('===Saving and closing:', isAdding, isUpdating);
    
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

    const success = await handleSaveDiagnosis(removeNewChildren(editingDiagnosis));
   
    if (success) {
      setSelectedDiagnosis(null);
      setEditingDiagnosis(null);
    }
  }, [editingDiagnosis, handleSaveDiagnosis , isAdding, isUpdating]);

  const handleCancelEdit = useCallback(() => {
     const cleanedDiagnosis = removeNewChildren(editingDiagnosis);
     console.log(  "normal", editingDiagnosis ,  'Cleaned Diagnosis:', cleanedDiagnosis);
     setCurrentItems(prev =>
       prev.map(item =>
         item.diagnosisId === editingDiagnosis.diagnosisId
           ? {
               ...item,
               ...cleanedDiagnosis,
               diagnosisName: selectedDiagnosis.diagnosisName,
               symptomsDescription: selectedDiagnosis.symptomsDescription,
               description: selectedDiagnosis.description,
               code: selectedDiagnosis.code
             }
           : item
       )
      );
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
    handleUpdateDiagnosis,
    diagnosesData,
    isLoading,
    error,
    isFetching,
    refetch, 
    setCurrentPage,
    currentPage,
    setRowsPerPage
  };
  
};