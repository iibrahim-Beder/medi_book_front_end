import { useState, useMemo } from "react";
import { 
  useGetExternalPatientMedicalConditionsQuery,
  useDeleteExternalPatientMedicalConditionMutation, // Fixed import
  useUpdateExternalPatientMedicalConditionMutation, // Fixed import
  useAddExternalPatientMedicalConditionMutation // Fixed import
} from "../../../../../../../api/patientOtherMedicalConditionsApi";
import toast from 'react-hot-toast';

const PATIENT_ID = 4;

export const useOtherMedicalConditions = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    conditionType: "",
    diagnosisDateFrom: null,
    diagnosisDateTo: null
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    conditionType: "",
    diagnosisDateFrom: null,
    diagnosisDateTo: null
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const pageSize = 5;

  // Helper functions
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // RTK Query
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      diagnosisDateFrom: formatDateForAPI(appliedFilters.diagnosisDateFrom), // Use appliedFilters
      diagnosisDateTo: formatDateForAPI(appliedFilters.diagnosisDateTo), // Use appliedFilters
      isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true :
                appliedFilters.isActive === "Inactive" ? false : undefined
    };

    // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage, pageSize]);

  const {
    data: medicalConditionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetExternalPatientMedicalConditionsQuery(queryArgs);
  // Mutations - Fixed hook names
  const [deleteMedicalCondition, { isLoading: isDeleting }] = useDeleteExternalPatientMedicalConditionMutation();
  const [updateMedicalCondition, { isLoading: isUpdating }] = useUpdateExternalPatientMedicalConditionMutation();
  const [addMedicalCondition, { isLoading: isAdding }] = useAddExternalPatientMedicalConditionMutation();

  // Template for new record
  const emptyRecord = {
    medicalConditionName: "",
    categoryName: "",
    severity: "",
    diagnosedDate: "",
    isActive: true,
    note: "",
    conditionType: "External"
  };

  // Actions
  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      setAppliedFilters(filters);
      setCurrentFilters(filters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      isActive: "All",
      severity: "",
      conditionType: "",
      diagnosisDateFrom: null,
      diagnosisDateTo: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  const handleEdit = (condition) => {
    setSelectedRecord({ ...condition });
    setIsAddMode(false);
    setShowModal(true);
  };

  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleNotesClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // API Operations - Fixed parameter structure
  const handleSave = async () => {
    if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
    
    // if (!selectedRecord.medicalConditionName) {
    //   toast.error('Please enter medical condition name.');
    //   return;
    // }

    // if (!selectedRecord.severity) {
    //   toast.error('Please select severity.');
    //   return;
    // }
    
    console.log('Selected Record:', selectedRecord);

    const loadingToast = toast.loading('Saving...');

    try {
      if (isAddMode) {
        const addData = {
          patientId: PATIENT_ID,
          conditionData: {
            ...selectedRecord,
            diagnosisDate: formatDateForAPI(selectedRecord.diagnosedDate), // Match API expected field name
            medicalConditionId: selectedRecord.medicalConditionId || 0, // Ensure this is set
            notes: selectedRecord.note || '' // Match API expected field name
          }
        };

        const res = await addMedicalCondition(addData).unwrap();
        console.log('API Response:', res);
        
        if (res.succeeded) {
          toast.success(res.message || "Added Successfully");
          setShowModal(false);
          setSelectedRecord(null);
          refetch();
        } else {
          toast.error(res.message || "Failed to add");
        }
      } else {
        const updateData = {
          conditionId: selectedRecord.id,
          updates: {
            ...selectedRecord,
            diagnosisDate: formatDateForAPI(selectedRecord.diagnosedDate), // Match API expected field name
            medicalConditionId: selectedRecord.medicalConditionId,
            notes: selectedRecord.note || '' // Match API expected field name
          }
        };

        const res = await updateMedicalCondition(updateData).unwrap();
        console.log('API Response: res', res);
        if (res?.succeeded) {
          toast.success(res.message || "Updated Successfully");
          setShowModal(false);
          setSelectedRecord(null);
          refetch();
        } else {
          toast.error(res.error || "Failed to update");
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.error || `Error ${isAddMode ? 'adding' : 'updating'} medical condition.`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedicalCondition({ 
        conditionId: recordToDelete.id
      }).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Deleted Successfully");
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
        refetch();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.data?.message || "Error deleting this medical condition.");
    } finally {
      toast.dismiss(loadingToast);
      setShowPopup(false);
    }
  };

  // Utility functions
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "#4BAE78";
      case "moderate":
        return "#FFA500";
      case "severe":
        return "#D66A6A";
      case "critical":
        return "#DC3545";
      default:
        return "#6C757D";
    }
  };

  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? "#3fabf3" : "#7A8B97",
      text: isActive ? "active" : "inactive"
    };
  };

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return {
    // State
    expandedRow,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    showPopup,
    selectedRecord,
    recordToDelete,
    isAddMode,
    medicalConditionsData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNew,
    handleEdit,
    handleDeleteInModal,
    handleClosePopup,
    handleNotesClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    
    // Utilities
    getSeverityColor,
    getStatusInfo,
    truncateText
  };
};