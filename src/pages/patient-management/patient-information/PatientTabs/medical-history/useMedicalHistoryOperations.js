// hooks/useMedicalHistory.js
import { useState, useMemo } from "react";
import { useGetPatientMedicalHistoryQuery, useDeleteMedicalHistoryMutation, useUpdateMedicalHistoryMutation, useAddMedicalHistoryMutation } from "../../../../../api/medicalHistoryApi";
import toast from 'react-hot-toast';

const PATIENT_ID = 4;

export const useMedicalHistory = (isMobile = false) => {
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    historyType: "",
    dateFrom: null,
    dateTo: null
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    historyType: "",
    dateFrom: null,
    dateTo: null
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const [expandedNotes, setExpandedNotes] = useState({});
  
  const [expandedRow, setExpandedRow] = useState(null);

  const pageSize = isMobile ? 5 : 5;

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
      dateFrom: formatDateForAPI(currentFilters.dateFrom),
      dateTo: formatDateForAPI(currentFilters.dateTo),
    };

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
  }, [appliedFilters, currentPage, currentFilters, pageSize]);

  const {
    data: medicalHistoryData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientMedicalHistoryQuery(queryArgs);

  const [deleteMedicalHistory, { isLoading: isDeleting }] = useDeleteMedicalHistoryMutation();
  const [updateMedicalHistory, { isLoading: isUpdating }] = useUpdateMedicalHistoryMutation();
  const [addMedicalHistory, { isLoading: isAdding }] = useAddMedicalHistoryMutation();

  // Template for new record
  const emptyRecord = {
    historyType: "",
    hereditaryDiseaseName: "",
    description: "",
    dateOfEvent: "",
    relatedPerson: "",
    notes: ""
  };

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
      historyType: "",
      dateFrom: null,
      dateTo: null
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

  const handleEdit = (history) => {
    console.log('Editing record:', history);
    setSelectedRecord({ ...history });
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

      const [expandedDescription, setExpandedDiscription] = useState({});

  const toggleDescription = (historyId) => {
    setExpandedDiscription(prev => ({
      ...prev,
      [historyId]: !prev[historyId]
    }));
  };

  const toggleNotes = (historyId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [historyId]: !prev[historyId]
    }));
  };

  const handleExpandClick = (id, field) => {
    const key = `${id}-${field}`;
    setExpandedRow(prev => prev === key ? null : key);
  };

  const handleSave = async () => {
    if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
    if (selectedRecord.historyType === "") {
      toast.error('Please select a medical history type.');
      return;
    }
    console.log('Saving record:', selectedRecord);
    const loadingToast = toast.loading('Saving...');
    
    if (isAddMode) {
      try {
        const addData = { ...selectedRecord };
        console.log('Saving record:', selectedRecord,"Sending add data:",addData );
        const res = await addMedicalHistory({ 
          patientId: PATIENT_ID, 
          ...addData 
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
        toast.error(error?.data?.message || "Error adding medical history record.");
      }
    } else {
      try {
        const updateData = { ...selectedRecord };
        const res = await updateMedicalHistory({ 
          historyId: selectedRecord.id, 
          patientId: PATIENT_ID, 
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
        toast.error(error?.data?.message || "Error updating medical history record.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedicalHistory({ 
        historyId: recordToDelete.id, 
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
        toast.error(res.message || "Failed to delete");
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this medical history record.");
      setShowPopup(false);
    }
  };

  return {
    // State 
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    showPopup,
    selectedRecord,
    recordToDelete,
    isAddMode,
    medicalHistoryData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    
    // State expanded  
    expandedNotes,
    expandedDescription,
    expandedRow,
    
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
    refetch,
    
    toggleNotes,
    toggleDescription,
    handleExpandClick
  };
};