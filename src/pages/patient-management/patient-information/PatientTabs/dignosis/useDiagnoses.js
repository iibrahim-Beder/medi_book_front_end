import { useState, useMemo } from "react";
import { useGetPatientDiagnosesQuery } from "../../../../../api/patientDiagnosesApi";
import { formatDateForAPI } from "../../../../shared/utils";

const PATIENT_ID = 4;

export const useDiagnoses = () => {
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    diagnosisType: "",
    dateFrom: null,
    dateTo: null,
  });
    const [appliedFilters, setAppliedFilters] = useState({
      searchValue: "",
      dateFrom: null,
      dateTo: null
    });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  // RTK Query
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      dateFrom: formatDateForAPI(currentFilters.dateFrom),
      dateTo: formatDateForAPI(currentFilters.dateTo),
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
  }, [ appliedFilters,currentFilters, currentPage, pageSize]);

  const {
    data: diagnosesData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientDiagnosesQuery(queryArgs);

  // // Actions 
  // const handleViewClick = (id, field) => {
  //   if (expandedRow === id && expandedField === field) {
  //     setExpandedRow(null);
  //     setExpandedField(null);
  //   } else {
  //     setExpandedRow(id);
  //     setExpandedField(field);
  //   }
  // };

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
      diagnosisType: "",
      dateFrom: null,
      dateTo: null
    };
    setCurrentFilters(resetFilters);
    setCurrentPage(1);
  };

  // Utility functions
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Transform API data to match component structure
  const transformDiagnosisData = (diagnosis) => {
    console.log(' Original Diagnosis:', diagnosis);
    return {
      id: diagnosis.diagnosisId,
      diagnosisName: diagnosis.diagnosisName,
      code: diagnosis.code,
      symptomsDescription: diagnosis.symptomsDescription,
      diagnosisDescription: diagnosis.description,
      diagnosedConditions: diagnosis.patientInternalMedicalConditionLinkOverViews || [],
      notes: diagnosis.diagnosisNoteOverviews || [],
      prescription: diagnosis.prescriptionOverviews || [],
      createdAt: diagnosis.createdAt
    };
  };

  // Transform prescription data for TwoLevelAccordion
  const transformPrescriptionData = (prescriptions) => {
    return prescriptions.map(prescription => ({
      id: prescription.id,
      title: prescription.title || "Prescription",
      status: prescription.status,
      note: prescription.notes,
      isExpanded: false,
      recipes: prescription.prescribedMedications?.map(med => ({
        type: "medication",
        medication: med.medicationName,
        dosage: med.dosage,
        durationInDays: med.durationInDays,
        instructions: med.instructions,
        createdAt: med.createdAt
      })) || []
    }));
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    const statusMap = {
      0: "Active",
      1: "Completed", 
      2: "Cancelled",
      3: "Pending"
    };
    return statusMap[status] || "Unknown";
  };




  // === Modal state ===
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  
  const handleOpenModal = (diagnosisId, fieldType, data) => {
    setExpandedRow(diagnosisId);
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
  
  const handleViewClick = (diagnosisId, fieldType) => {
    const diagnosis = diagnosesData?.data?.find(d => d.id === diagnosisId);
    if (!diagnosis) return;
    
    const transformedDiagnosis = transformDiagnosisData(diagnosis);
    const transformedPrescriptions = transformPrescriptionData(transformedDiagnosis.prescription);
    
    let data = null;
    switch(fieldType) {
      case 'diagnosedConditions':
        data = transformedDiagnosis.diagnosedConditions;
        break;
      case 'notes':
        data = transformedDiagnosis.notes;
        break;
      case 'prescription':
        data = transformedPrescriptions;
        break;
      case 'symptomsDescription':
      case 'diagnosisDescription':
        if (expandedRow === diagnosisId && expandedField === fieldType) {
          setExpandedRow(null);
          setExpandedField(null);
        } else {
          setExpandedRow(diagnosisId);
          setExpandedField(fieldType);
        }
        return;
      default:
        return;
    }
    
    handleOpenModal(diagnosisId, fieldType, data);
  };
  


  return {
    // State
    appliedFilters,
    expandedRow,
    expandedField,
    currentFilters,
    currentPage,
    diagnosesData,
    isLoading,
    isFetching,
    error,
    pageSize,

    // Actions
    handleViewClick,
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,

    // Utilities
    truncateText,
    transformDiagnosisData,
    transformPrescriptionData,
    getStatusText,

    //modal
    modalOpen,
    modalData,
    modalType,
    
    handleOpenModal,
    handleCloseModal,
  };
};