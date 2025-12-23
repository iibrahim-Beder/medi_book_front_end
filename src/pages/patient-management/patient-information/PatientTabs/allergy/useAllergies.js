import { useState, useMemo } from "react";
import { 
  useGetPatientAllergiesQuery,
  useDeletePatientAllergyMutation,
  useUpdatePatientAllergyMutation,
  useAddPatientAllergyMutation 
} from "../../../../../api/patientAllergiesApi";
import toast from 'react-hot-toast';

const PATIENT_ID = 4;

export const useAllergies = () => {
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const pageSize = 5;

  // Helper functions
  // const formatDateForAPI = (date) => {
  //   if (!date) return undefined;
  //   const d = new Date(date);
  //   return d.toISOString().split('T')[0];
  // };

  // RTK Query
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      dateNoted: appliedFilters.dateNoted,
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
    data: allergiesData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientAllergiesQuery(queryArgs);

  // Mutations
  const [deletePatientAllergy, { isLoading: isDeleting }] = useDeletePatientAllergyMutation();
  const [updatePatientAllergy, { isLoading: isUpdating }] = useUpdatePatientAllergyMutation();
  const [addPatientAllergy, { isLoading: isAdding }] = useAddPatientAllergyMutation();

  // Template for new record
  const emptyRecord = {
    allergenId: null,
    allergenLabel: "",
    severity: "Mild",
    isActive: true,
    dateNoted: "",
    reaction: "",
    notes: ""
  };

  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      const mappedFilters = {
        ...currentFilters,
        ...filters,
        isActive: filters.status ?? currentFilters.isActive,
        status: undefined
      };

      setAppliedFilters(mappedFilters);
      setCurrentFilters(mappedFilters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      isActive: "All",
      severity: "",
      dateNoted: ""
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

  const handleEdit = (entry) => {
    setSelectedRecord({ ...entry });
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

  // API Operations
const handleSave = async () => {
  if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
  
  console.log('Saving record:', selectedRecord);
  
  // Validation
  
  if (!selectedRecord.severity) {
    toast.error('Please select severity.');
    return;
  }
  if(!selectedRecord.dateNoted) {
        toast.error('Please select a date noted.');
        return;
}
  const loadingToast = toast.loading('Saving...');
  
  
  try {
    if (isAddMode) {
      if (!selectedRecord.allergenNameId) {
        toast.error('Please select an allergen.');
        toast.dismiss(loadingToast);
        return;
      }
      // ADD MODE
      const allergyData = {
        allergenId: selectedRecord.allergenNameId,
        severity: selectedRecord.severity,
        isActive: selectedRecord.isActive !== undefined ? selectedRecord.isActive : true,
        dateNoted: selectedRecord.dateNoted,
        reaction: selectedRecord.reaction || '',
        notes: selectedRecord.notes || ''
      };

      console.log('Adding allergy data:', allergyData);

      const res = await addPatientAllergy({ 
        patientId: PATIENT_ID, 
        allergyData: allergyData 
      }).unwrap();
      console.log('Add Patient Allergy Response:', res);
      
      if (res?.succeeded) {
        toast.success(res.message || "Added Successfully");
        toast.dismiss(loadingToast);
        setShowModal(false);
        setSelectedRecord(null);
        refetch();
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to add allergy");
      }
    } else {
      // EDIT MODE
      const updates = {
        allergenId: selectedRecord.allergenNameId,
        severity: selectedRecord.severity,
        isActive: selectedRecord.isActive,
        dateNoted: selectedRecord.dateNoted, 
        reaction: selectedRecord.reaction || '',
        notes: selectedRecord.notes || ''
      };

      console.log('Updating allergy data:', updates);

      const res = await updatePatientAllergy({ 
        allergyId: selectedRecord.id, 
        updates: updates 
      }).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Updated Successfully");
        toast.dismiss(loadingToast);
        setShowModal(false);
        setSelectedRecord(null);
        refetch();
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to update allergy");
      }
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('Save error:', error);
    toast.error(error?.data?.message || `Error ${isAddMode ? 'adding' : 'updating'} allergy record.`);
  }
};
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    console.log("recordToDelete",recordToDelete);
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deletePatientAllergy({ 
        allergyId: recordToDelete.allergenId, 
        patientId: PATIENT_ID 
      }).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Deleted Successfully");
        toast.dismiss(loadingToast);
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
        refetch();
      } else {
        console.error("Failed to delete", res);
        toast.error(res.message || "Failed to delete");
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error("Failed to delete", error);
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this allergy record.");
      setShowPopup(false);
    }
  };

  return {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    selectedRecord,
    isAddMode,
    showPopup,
    recordToDelete,
    allergiesData,
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
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch
  };
};