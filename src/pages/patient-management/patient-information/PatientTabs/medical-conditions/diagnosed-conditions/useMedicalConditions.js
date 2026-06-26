import { useState, useMemo, useEffect } from "react";
import { useGetPatientMedicalConditionsQuery } from "../../../../../../api/PatientProfile/patientMedicalConditionsApi";
import { formatDateForAPI } from "../../../../../shared/utils";


export const useMedicalConditions = (isMobile = false,patientId) => {
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    conditionType: "",
    fromDate: null,
    toDate: null,
    severity: "",
    isActive: ""
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    conditionType: "",
    fromDate: null,
    toDate: null,
    severity: "",
    isActive: ""
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);

  const pageSize = isMobile ? 5 : 5;

    const [expandedNotes, setExpandedNotes] = useState({});
  

    const toggleNotes = (historyId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [historyId]: !prev[historyId]
    }));
  };


  // RTK Query
  const queryArgs = useMemo(() => {
      const apiFilters = {
        ...appliedFilters,
        fromDate: formatDateForAPI(currentFilters.fromDate),
        toDate: formatDateForAPI(currentFilters.toDate),
      };
  
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] === undefined || apiFilters[key] === "") {
          delete apiFilters[key];
        }
      });
      console.log("apiFilters", apiFilters);
      return {
        patientId: patientId,
        filter: apiFilters,
        pageNumber: currentPage,
        pageSize: pageSize
      };
    }, [appliedFilters, currentPage, currentFilters, pageSize]);

  const {
    data: medicalConditionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientMedicalConditionsQuery(queryArgs);

const mappedMedicalConditionsData = useMemo(() => {
  if (!medicalConditionsData?.data) return medicalConditionsData;

  const allMatches =
    medicalConditionsData.meta?.matches?.flatMap(m => m.matches) || [];

  const mappedData = medicalConditionsData.data.map(item => ({
    ...item,
    highlightInfo: {
      matchedFields: allMatches.filter(
        match => match.itemId === item.id
      )
    }
  }));
  

  return {
    ...medicalConditionsData,
    data: mappedData,
    searchTerm: medicalConditionsData.meta?.keyword || ""
  };
}, [medicalConditionsData]);

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
      conditionType: "",
      fromDate: null,
      toDate: null,
      severity: "",
      isActive: ""
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const handleExpandClick = (id, field) => {
    setExpandedRow(prev => prev === id ? null : id);
    setExpandedField(prev => prev === field ? null : field);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "#4BAE78"; // Green
      case "moderate":
        return "#FFA500"; // Orange
      case "severe":
        return "#D66A6A"; // Red
      default:
        return "#6C757D"; // Gray
    }
  };

  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? "#3fabf3" : "#7A8B97",
      text: isActive ? "active" : "inactive"
    };
  };

  const currentData = mappedMedicalConditionsData?.data || [];
  const searchTerm = mappedMedicalConditionsData?.searchTerm || "";
  return {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    expandedRow,
    expandedField,
    medicalConditionsData: mappedMedicalConditionsData,
    currentData,
    searchTerm,
    isLoading,
    isFetching,
    error,
    pageSize,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleExpandClick,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    setExpandedNotes,
    expandedNotes,
    toggleNotes,
 

    // Utilities
    getSeverityColor,
    getStatusInfo,
  };
};