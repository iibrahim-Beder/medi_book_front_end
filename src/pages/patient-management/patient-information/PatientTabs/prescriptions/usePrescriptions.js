import { useState, useMemo } from "react";
import { 
  useGetPatientPrescriptionsQuery 
} from "../../../../../api/patientPrescriptionApi";

const PATIENT_ID = 4;

export const usePrescriptions = (isMobile = false) => {
  // State 
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    status: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    status: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

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
      searchValue: appliedFilters.searchValue,
      status: appliedFilters.status,
      medicationId: appliedFilters.medicationId,
      medicationCategoryId: appliedFilters.medicationCategoryId,
      fromDate: formatDateForAPI(currentFilters.fromDate),
      toDate: formatDateForAPI(currentFilters.toDate)
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
    data: prescriptionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientPrescriptionsQuery(queryArgs);

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
      status: "",
      medicationId: "",
      medicationCategoryId: "",
      fromDate: null,
      toDate: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const handleViewClick = (id, field) => {
    if (expandedRow === id && expandedField === field) {
      setExpandedRow(null);
      setExpandedField(null);
    } else {
      setExpandedRow(id);
      setExpandedField(field);
    }
  };

  const toggleNotes = (prescriptionId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId]
    }));
  };

  const handleOpenModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalExited = () => {
    setSelectedPrescription(null);
  };

  // Utility functions
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#3fabf3";
      case "completed":
        return "#4BAE78";
      case "cancelled":
        return "#D66A6A";
      case "expired":
        return "#7A8B97";
      default:
        return "#6C757D";
    }
  };

  // Get matched fields for highlighting
  const getMatchedFields = (highlightInfo) => {
    if (!highlightInfo || !highlightInfo.matchedFields) return [];
    return highlightInfo.matchedFields.map(field => field.fieldName);
  };

  // Transform prescription data  for CustomAccordion
  const transformMedicationData = (prescribedMedications) => {
    if (!prescribedMedications) return [];
    
    return prescribedMedications.map(med => ({
      id: med.id,
      medicationName: med.medicationName,
      dosage: med.dosage,
      duration: med.duration,
      instructions: med.instructions,
      // Additional fields if needed
      startDate: med.startDate,
      endDate: med.endDate
    }));
  };

  // Data calculations
  const currentData = prescriptionsData?.data || [];
  const totalItems = prescriptionsData?.totalCount || 0;
  const totalPages = prescriptionsData?.totalPages || 1;
  const searchTerm = appliedFilters.searchValue;

  return {
    // State
    expandedRow,
    expandedField,
    expandedNotes,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    selectedPrescription,
    prescriptionsData,
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
    handleViewClick,
    toggleNotes,
    handleOpenModal,
    handleCloseModal,
    handleModalExited,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields,
    transformMedicationData
  };
};