import { useState, useMemo, useEffect } from "react";
import { useGetPatientMedicalConditionsQuery } from "../../../../../../api/PatientProfile/patientMedicalConditionsApi";

const PATIENT_ID = 4;

export const useMedicalConditions = (isMobile = false) => {
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

  const pageSize = isMobile ? 5 : 5;

  // Helper functions
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

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
        patientId: PATIENT_ID,
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

useEffect(() => {
  if (!mappedMedicalConditionsData?.data?.length) return;

  mappedMedicalConditionsData.data.forEach(item => {
    const fields = item.highlightInfo?.matchedFields || [];

    fields.forEach(match => {
      if (match.field === "Notes") {
        setExpandedNotes(prev => ({
          ...prev,
          [item.id]: true
        }));
      }
    });
  });
}, [mappedMedicalConditionsData]);
useEffect(() => {
  if (!mappedMedicalConditionsData?.data?.length) return;

  const firstMatchRow = mappedMedicalConditionsData.data.find(
    item => item.highlightInfo?.matchedFields?.length
  );

  if (!firstMatchRow) return;

  setExpandedRow(firstMatchRow.id);

  firstMatchRow.highlightInfo.matchedFields.forEach(match => {
    if (match.field === "Notes") {
      setExpandedNotes(prev => ({
        ...prev,
        [firstMatchRow.id]: true
      }));
    }
  });
}, [mappedMedicalConditionsData]);


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

  const handleExpandClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
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

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  return {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    expandedRow,
    medicalConditionsData: mappedMedicalConditionsData,
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
    
    expandedNotes,
    toggleNotes,
 

    // Utilities
    getSeverityColor,
    getStatusInfo,
    truncateText,
  };
};