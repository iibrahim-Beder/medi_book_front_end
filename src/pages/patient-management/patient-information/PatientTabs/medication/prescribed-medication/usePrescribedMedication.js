import { useState, useMemo, useEffect } from "react";
import { useGetPrescribedMedicationQuery } from "../../../../../../api/prescribedMedicationApi";
import { formatDateForAPI } from "../../../../../shared/utils";
import { hasMatchForField, shouldExpand } from "../../component/helpers";

const PATIENT_ID = 4;

export const usePrescribedMedication = (isMobile = false) => {
  // State 
  const [expandedRow, setExpandedRow] = useState({});
  const [expandedInstructions, setExpandedInstructions] = useState({});
  const [expandedField, setExpandedField] = useState({});
  
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

const handleExpandClick = (id, field) => {
  if (expandedRow === id && expandedField === field) {
    setExpandedRow(null);
    setExpandedField(null);
  } else {
    setExpandedRow(id);
    setExpandedField(field);
  }
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
  
  const mappedPrescribedMedicationData = useMemo(() => {
    
  if (!prescribedMedicationData?.data) return prescribedMedicationData;

  const allMatches =
    prescribedMedicationData.meta?.matches?.flatMap(m => m.matches) || [];

  const mappedData = prescribedMedicationData.data.map(item => ({
    ...item,
    highlightInfo: {
      matchedFields: allMatches.filter(
        match => match.itemId === item.id
      )
    }
  }));  

  return {
    ...prescribedMedicationData,
    data: mappedData,
    searchTerm: prescribedMedicationData.meta?.keyword || ""
  };
}, [prescribedMedicationData]);

const searchTerm = appliedFilters.searchValue;

useEffect(() => {
  if (!mappedPrescribedMedicationData?.data?.length) return;
  if (!searchTerm) return;

  const MAX_LEN = 40;
  const expandableFields = [
    "instructions",
    "diagnosisName",
    "prescriptionName",
  ];

  const firstMatch = mappedPrescribedMedicationData.data.find(item =>
    item.highlightInfo?.matchedFields?.length &&
    expandableFields.some(field =>
      hasMatchForField(item, field) &&
      shouldExpand(item[field], MAX_LEN)
    )
  );

  if (!firstMatch) return;

  const matchedField = expandableFields.find(field =>
    hasMatchForField(firstMatch, field) &&
    shouldExpand(firstMatch[field], MAX_LEN)
  );

  if (!matchedField) return;

  setExpandedRow(firstMatch.id);
  setExpandedField(matchedField);
}, [mappedPrescribedMedicationData, searchTerm]);


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

  // // Get matched fields for highlighting
  // const getMatchedFields = (highlightInfo) => {
  //   if (!highlightInfo || !highlightInfo.matchedFields) return [];
  //   return highlightInfo.matchedFields.map(field => field.fieldName);
  // };



  // Data calculations
  const currentData = mappedPrescribedMedicationData?.data || [];
  const totalItems = prescribedMedicationData?.totalCount || 0;
  const totalPages = prescribedMedicationData?.totalPages || 1;

  return {
    // State
    expandedRow,
    expandedInstructions,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    selectedMedication,
    prescribedMedicationData:mappedPrescribedMedicationData,
    isLoading,
    isFetching,
    error,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    handleExpandClick,
    expandedField,
    
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
    // getMatchedFields,
  };
};