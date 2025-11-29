import { useState, useMemo } from "react";
import { useGetPrescribedMedicationQuery } from "../../../../../../api/prescribedMedicationApi";

const PATIENT_ID = 4;

export const usePrescribedMedication = (isMobile = false) => {
  // State 
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedInstructions, setExpandedInstructions] = useState({});
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const pageSize = isMobile ? 3 : 5;

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
      fromDate: formatDateForAPI(currentFilters.fromDate),
      toDate: formatDateForAPI(currentFilters.toDate),
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
  }, [appliedFilters, currentPage, currentFilters, pageSize]);

  const {
    data: prescribedMedicationData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPrescribedMedicationQuery(queryArgs);

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
      medicationId: "",
      medicationCategoryId: "",
      fromDate: null,
      toDate: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const handleInstructionsClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const toggleInstructions = (medicationId) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [medicationId]: !prev[medicationId]
    }));
  };

  const handleOpenModal = (medication) => {
    setSelectedMedication(medication);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalExited = () => {
    setSelectedMedication(null);
  };

  // Utility functions
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get matched fields for highlighting
  const getMatchedFields = (highlightInfo) => {
    if (!highlightInfo || !highlightInfo.matchedFields) return [];
    return highlightInfo.matchedFields.map(field => field.fieldName);
  };



  // Data calculations
  const currentData = prescribedMedicationData?.data || [];
  const totalItems = prescribedMedicationData?.totalCount || 0;
  const totalPages = prescribedMedicationData?.totalPages || 1;
  const searchTerm = appliedFilters.searchValue;

  return {
    // State
    expandedRow,
    expandedInstructions,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    selectedMedication,
    prescribedMedicationData,
    isLoading,
    isFetching,
    error,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleInstructionsClick,
    toggleInstructions,
    handleOpenModal,
    handleCloseModal,
    handleModalExited,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
    getMatchedFields,
  };
};