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

  const handleViewClickMobile = (id, field) => {
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

  const handleOpenModalMobile = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleCloseModalMobile = () => {
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
    console.log(" original prescribedMedications  ",prescribedMedications);
    
    return prescribedMedications.map(med => ({
      id: med.id,
      medicationName: med.medicationName,
      categoryName: med.medicationCategoryName,
      dosage: med.dosage,
      durationInDays: med.durationInDays,
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



  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  
  const handleOpenModal = (prescriptionId, fieldType, data) => {
    setExpandedRow(prescriptionId);
    setExpandedField(fieldType);
    setModalData(data);
    setModalType(fieldType);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalType(null);
    setExpandedRow(null);
    setExpandedField(null);
  };
    const handleViewClick = (prescriptionId, fieldType) => {
    const prescription = currentData.find(p => p.id === prescriptionId);
    if (!prescription) return;
    
    switch(fieldType) {
      case 'prescribedMedication':
        const medicationData = transformMedicationData(prescription.prescribedMedications);
        handleOpenModal(prescriptionId, fieldType, medicationData);
        break;
        
      case 'note':
      case 'diagnosisName':
        if (expandedRow === prescriptionId && expandedField === fieldType) {
          setExpandedRow(null);
          setExpandedField(null);
        } else {
          setExpandedRow(prescriptionId);
          setExpandedField(fieldType);
        }
        break;
        
      default:
        if (expandedRow === prescriptionId && expandedField === fieldType) {
          setExpandedRow(null);
          setExpandedField(null);
        } else {
          setExpandedRow(prescriptionId);
          setExpandedField(fieldType);
        }
    }
  };
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
    
     modalOpen,
    modalData,
    modalType,
    
    // Actions
    handleOpenModalMobile,
    
    handleSearch,
    handleResetFilters,
    handleViewClick,
    handleCloseModalMobile,
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