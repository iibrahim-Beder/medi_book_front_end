import { useState, useMemo, useEffect } from "react";
import { 
  useGetPatientAllergiesQuery,
  useDeletePatientAllergyMutation,
  useUpdatePatientAllergyMutation,
  useAddPatientAllergyMutation 
} from "../../../../../api/PatientProfile/patientAllergiesApi";
import {
  validateAllergyForm,
  buildAllergyUpdatePayload
} from "./allergyHelpers";

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
  const [expandedRow, setExpandedRow] = useState({});
  

  const pageSize = 5;

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
    dateNoted: new Date().toISOString().split('T')[0],
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
    const handleExpandClick = (id ,open) => {
      console.log("id", id,"open", open);
      if (open) {
        setExpandedRow(id);
      } else {
        setExpandedRow(prev => prev === id ? null : id);
      }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };
  
  const mappedAllergies = useMemo(() => {
  if (!allergiesData?.data) return allergiesData;

  const allMatches =
    allergiesData.meta?.matches?.flatMap(m => m.matches) || [];

  const mappedData = allergiesData.data.map(item => ({
    ...item,
    highlightInfo: {
      matchedFields: allMatches.filter(
        match => match.itemId === item.id
      )
    }
  }));
  

  return {
    ...allergiesData,
    data: mappedData,
    searchTerm: allergiesData.meta?.keyword || ""
  };
}, [allergiesData]);

// Auto expand if there is a match on first row
// useEffect(() => {
//   if (!mappedAllergies?.data?.length) return;
//   const firstMatchRow = mappedAllergies.data.find(
//     item => item.highlightInfo?.matchedFields?.length
//   );
//   if (!firstMatchRow) return;
//   setExpandedRow(firstMatchRow.id);
// }, [mappedAllergies]);
const openNotes = (id) => {
  setExpandedRow(prev => ({
    ...prev,
    [id]: true
  }));
};


  // API Operations
const handleSave = async () => {
  if (!selectedRecord || isDeleting || isUpdating || isAdding) return;

  const errorMessage = validateAllergyForm(selectedRecord);
  if (errorMessage) {
    toast.error(errorMessage);
    return;
  }
  

  const loadingToast = toast.loading("Saving...");

  try {
    if (isAddMode) {
      const allergyData = {
        allergenId: selectedRecord.allergenNameId,
        severity: selectedRecord.severity,
        isActive: selectedRecord.isActive ?? true,
        dateNoted: selectedRecord.dateNoted,
        reaction: selectedRecord.reaction || "",
        notes: selectedRecord.notes || ""
      }; 

      
      const res = await addPatientAllergy({
        patientId: PATIENT_ID,
        allergyData
      }).unwrap();
      console.log("res", res);

      if (res?.succeeded) {
        toast.success("Added Successfully");
        setShowModal(false);
        setSelectedRecord(null);
      } else {
        console.log("error",res);
        toast.error("Failed to add allergy");
      }
    } else {
      const originalRecord = allergiesData?.data?.find(
        r => r.id === selectedRecord.id
      );

      const updates = buildAllergyUpdatePayload(
        originalRecord,
        selectedRecord
      );

      if (!Object.keys(updates).length) {
        toast("No changes detected");
        setShowModal(false);
        return;
      }
      console.log("===updates", updates);

     const res =   await updatePatientAllergy({
        allergyId: selectedRecord.id,
        updates
      }).unwrap();
            console.log("res", res);

      if (res?.succeeded) {
        toast.success("Updated Successfully");
        setShowModal(false);
        setSelectedRecord(null);
      } else {
        console.log("error",error);
        toast.error("Failed to update allergy");
      }

      toast.success("Updated Successfully");
      setShowModal(false);
      setSelectedRecord(null);
    }
  } catch (error) {
    console.error(error);
    toast.error(
      `Error ${isAddMode ? "adding" : "updating"} allergy record.`
    );
  } finally {
    toast.dismiss(loadingToast);
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
  const currentData = mappedAllergies?.data || [];
  const searchTerm = mappedAllergies?.searchTerm || "";


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
    allergiesData:mappedAllergies,
    currentData,
    searchTerm,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    expandedRow,
    
    // Actions   
    setExpandedRow,
    openNotes,
    handleExpandClick,
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