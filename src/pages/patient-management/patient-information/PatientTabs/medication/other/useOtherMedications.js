import { useState, useMemo } from "react";
import { 
  useGetExternalPatientMedicationQuery,
  useDeleteExternalPatientMedicationMutation,
  useUpdateExternalPatientMedicationMutation,
  useAddExternalPatientMedicationMutation 
} from "../../../../../../api/ExternalPatientMedicationMutationApi";
import toast from 'react-hot-toast';

const PATIENT_ID = 4;

export const useOtherMedications = () => {
  // State 
  const [expandedRow, setExpandedRow] = useState(null);
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    medicationId: "",
    startDateFrom: null,
    startDateTo: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    medicationId: "",
    startDateFrom: null,
    startDateTo: null
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
      searchValue: appliedFilters.searchValue,
      medicationId: appliedFilters.medicationId,
      startDateFrom: formatDateForAPI(currentFilters.startDateFrom),
      startDateTo: formatDateForAPI(currentFilters.startDateTo),
      isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true : false
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
    data: medicationsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetExternalPatientMedicationQuery(queryArgs);

  // Mutations
  const [deleteMedication, { isLoading: isDeleting }] = useDeleteExternalPatientMedicationMutation();
  const [updateMedication, { isLoading: isUpdating }] = useUpdateExternalPatientMedicationMutation();
  const [addMedication, { isLoading: isAdding }] = useAddExternalPatientMedicationMutation();

  // Template for new record
  const emptyRecord = {
    medicationId: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    route: "",
    instructions: "",
    startDate: "",
    endDate: "",
    isActive: true,
    prescribedByName: ""
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
      medicationId: "",
      startDateFrom: null,
      startDateTo: null
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

  const handleEdit = (medication) => {
    setSelectedRecord({ 
      ...medication,
      medicationId: medication.medicationId || "",
      medicationName: medication.medicationName || ""
    });
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

  const handleInstructionsClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // API Operations
  const handleSave = async () => {
    if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
    
    // if (!selectedRecord.startDate) {
        //   toast.error('Please select start date.');
        //   return;
        // }
        
        const loadingToast = toast.loading('Saving...');
        
        if (isAddMode) {
        console.log('Saving record:', selectedRecord);
        if (!selectedRecord.medicationNameId) {
          toast.error('Please select a medication.');
          return;
        }
      try {
        const addData = {
          ...selectedRecord,
          startDate: formatDateForAPI(selectedRecord.startDate),
          endDate: formatDateForAPI(selectedRecord.endDate)
        };

        const res = await addMedication({ 
          patientId: PATIENT_ID, 
          medicationData: addData 
        }).unwrap();
        
        if (res?.succeeded) {
          toast.success(res.message || "Added Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          refetch();
        } else {
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to add");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error?.data?.message || "Error adding medication.");
      }
    } else {
      try {
        const updateData = {
          ...selectedRecord,
          startDate: formatDateForAPI(selectedRecord.startDate),
          endDate: formatDateForAPI(selectedRecord.endDate)
        };

        const res = await updateMedication({ 
          medicationId: selectedRecord.id, 
          updates: updateData 
        }).unwrap();
        
        if (res?.succeeded) {
          toast.success(res.message || "Updated Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          refetch();
        } else {
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to update");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error?.data?.message || "Error updating medication.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedication(recordToDelete.id).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Deleted Successfully");
        toast.dismiss(loadingToast);
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
        refetch();
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this medication.");
      setShowPopup(false);
    }
  };

  // Utility functions
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? "#3fabf3" : "#7A8B97";
  };

  // Get matched fields for highlighting
  const getMatchedFields = (highlightInfo) => {
    if (!highlightInfo || !highlightInfo.matchedFields) return [];
    return highlightInfo.matchedFields.map(field => field.fieldName);
  };

  // Data calculations
  const currentData = medicationsData?.data || [];
  const totalItems = medicationsData?.totalCount || 0;
  const totalPages = medicationsData?.totalPages || 1;
  const searchTerm = appliedFilters.searchValue;

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
    medicationsData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNew,
    handleEdit,
    handleDeleteInModal,
    handleClosePopup,
    handleInstructionsClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields
  };
};