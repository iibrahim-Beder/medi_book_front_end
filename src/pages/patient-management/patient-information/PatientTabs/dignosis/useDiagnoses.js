import { useState, useMemo } from "react";
import { useGetPatientDiagnosesQuery } from "../../../../../api/PatientProfile/patientDiagnosesApi";
import { formatDateForAPI } from "../../../../shared/utils";


export const useDiagnoses = (patientId) => {
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    fromDate: null,
    toDate: null,
  });
    const [appliedFilters, setAppliedFilters] = useState({
      searchValue: "",
      fromDate: null,
      toDate: null
    });
      console.log("currentFilters", currentFilters, "appliedFilters", appliedFilters);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
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
      patientId: patientId,
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
      fromDate: null,
      toDate: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId],
    }));
  };
  const openDescription = (diagnosisId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [diagnosisId]: true,
    }));
  };

  // Transform API data to match component structure
  const transformDiagnosisData = (diagnosis) => {
    return {
      ...diagnosis,
      id: diagnosis.diagnosisId,
      diagnosisName: diagnosis.diagnosisName,
      code: diagnosis.code,
      symptomsDescription: diagnosis.symptomsDescription,
      diagnosisDescription: diagnosis.description,
      diagnosedConditions: diagnosis.patientInternalMedicalConditionLinkOverViews || [],
      notes: diagnosis.diagnosisNoteOverviews || [],
      prescription: diagnosis.prescriptionOverviews || [],
      createdAt: diagnosis.createdAt,
      hasDiagnosisMatch:diagnosis.hasDiagnosisMatch,
      hasNoteMatch:diagnosis.hasNoteMatch,
      hasPrescriptionMatch:diagnosis.hasPrescriptionMatch,
      hasMedicationMatch:diagnosis.hasMedicationMatch,
      hasConditionMatch:diagnosis.hasConditionMatch
    };
  };

  // Transform prescription data for TwoLevelAccordion
  const transformPrescriptionData = (prescriptions) => {
    return prescriptions.map(prescription => ({
      ...prescription,
      id: prescription.id,
      title: prescription.title || "Prescription",
      status: prescription.status,
      note: prescription.notes,
      isExpanded: false,
      recipes: prescription.prescribedMedicationOverviews?.map(med => ({  
        title: med.medicationName,
        highlightInfo: med.highlightInfo,
        medicationCategoryName: med.medicationCategoryName,
        id:med.id,
        type: "medication",
        medicationName: med.medicationName,
        dosage: med.dosage,
        durationInDays: med.durationInDays,
        instructions: med.instructions,
        createdAt: med.createdAt
      })) || []
    }));
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
  
  const handleViewClick = (diagnosisId, fieldType,mustExpand=false) => {
         if(diagnosisId===null){
          setExpandedRow(null);
          setExpandedField(null);
      }
    // console.log('=====diagnosisId, fieldType', diagnosisId, fieldType);
    const diagnosis = mappedDiagnosisData?.data?.find(d => d.id === diagnosisId);
    if (!diagnosis) return;
    
    const transformedDiagnosis = transformDiagnosisData(diagnosis);
    const transformedPrescriptions = transformPrescriptionData(transformedDiagnosis.prescription);
    // console.log('===diagnosis:', diagnosis);
    let data = null;
    switch(fieldType) {
      case 'diagnosedConditions':
        data = transformedDiagnosis.patientInternalMedicalConditionLinkOverViews;
        break;
      case 'notes':
        data = transformedDiagnosis.notes;
        break;
      case 'prescription':
        data = transformedPrescriptions;
        break;
      case 'symptomsDescription':
      case 'diagnosisDescription':
      case 'description':
      case 'diagnosisName':
        if (expandedRow === diagnosisId && expandedField === fieldType && !mustExpand) {
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

const mappedDiagnosisData = useMemo(() => {
  if (!diagnosesData?.data) return diagnosesData;

  const allMatches = diagnosesData.meta?.matches?.flatMap(m => m.matches) || [];

// === Maps for all matching by ItemId for each Entity ===

  const diagnosisMatchesMap = new Map();
  const diagnosisNoteMatchesMap = new Map();
  const prescriptionMatchesMap = new Map();
  const medicationMatchesMap = new Map();
  const conditionMatchesMap = new Map();

  for (const match of allMatches) {
    switch (match.entity) {
      case "Diagnosis":
        diagnosisMatchesMap.set(
          match.itemId,
          [...(diagnosisMatchesMap.get(match.itemId) || []), match]
        );
        break;

      case "DiagnosisNote":
        diagnosisNoteMatchesMap.set(
          match.itemId,
          [...(diagnosisNoteMatchesMap.get(match.itemId) || []), match]
        );
        break;

      case "Prescription":
        prescriptionMatchesMap.set(
          match.itemId,
          [...(prescriptionMatchesMap.get(match.itemId) || []), match]
        );
        break;

      case "PrescribedMedication":
      case "MedicationCategory": 
        medicationMatchesMap.set(
          match.itemId,
          [...(medicationMatchesMap.get(match.itemId) || []), match]
        );
        break;

      case "PatientInternalMedicalCondition":
        conditionMatchesMap.set(
          match.itemId,
          [...(conditionMatchesMap.get(match.itemId) || []), match]
        );
        break;

      default:
        break;
    }
  }

  // === Mapping Diagnosis ===
  const mappedData = diagnosesData.data.map(diagnosis => {
    // 1)Diagnosis Notes
    const diagnosisNotes =
      diagnosis.diagnosisNoteOverviews?.map(note => {
        const matchedFields = diagnosisNoteMatchesMap.get(note.id) || [];
        return {
          ...note,
          highlightInfo: { matchedFields },
          hasMatch: matchedFields.length > 0,
        };
      }) || [];

    // 2)Patient Internal Conditions
    const conditions =
      diagnosis.patientInternalMedicalConditionLinkOverViews?.map(cond => {
        const matchedFields = conditionMatchesMap.get(cond.id) || [];
        return {
          ...cond,
          highlightInfo: { matchedFields },
          hasMatch: matchedFields.length > 0,
        };
      }) || [];

    // 3)Prescriptions → + medications
    const prescriptionOverviews =
      diagnosis.prescriptionOverviews?.map(prescription => {
        const prescriptionMatchedFields =
          prescriptionMatchesMap.get(prescription.id) || [];

        // Prescribed Medications to be mapped in each Prescription
       const prescribedMedications =
       (prescription.prescribedMedicationOverviews || prescription.prescribedMedications || []).map(med => {
         const matchedFields = medicationMatchesMap.get(med.id) || [];
         return {
           ...med,
           highlightInfo: { matchedFields },
           hasMatch: matchedFields.length > 0,
         };
       });


        const hasMedicationMatch = prescribedMedications.some(m => m.hasMatch);

        return {
          ...prescription,
          prescribedMedicationOverviews: prescribedMedications,
          hasMedicationMatch,
          highlightInfo: { matchedFields: prescriptionMatchedFields },
          hasPrescriptionMatch: prescriptionMatchedFields.length > 0,
        };
      }) || [];

    // === Boolean Flags to check if any match ===
    const hasDiagnosisMatch = (diagnosisMatchesMap.get(diagnosis.diagnosisId) || []).length > 0;
    const hasNoteMatch = diagnosisNotes.some(n => n.hasMatch);
    const hasPrescriptionMatch = prescriptionOverviews.some(p => p.hasPrescriptionMatch);
    const hasMedicationMatch = prescriptionOverviews.some(p => p.hasMedicationMatch);
    const hasConditionMatch = conditions.some(c => c.hasMatch);

    return {
      ...diagnosis,
      diagnosisNoteOverviews: diagnosisNotes,
      prescriptionOverviews,
      patientInternalMedicalConditionLinkOverViews: conditions,
      highlightInfo: {
        matchedFields: diagnosisMatchesMap.get(diagnosis.diagnosisId) || [],
      },
      hasDiagnosisMatch,
      hasNoteMatch,
      hasPrescriptionMatch,
      hasMedicationMatch,
      hasConditionMatch,
    };
  });

  return {
    ...diagnosesData,
    data: mappedData,
    searchTerm: diagnosesData.meta?.keyword || "",
  };
}, [diagnosesData]);
  const currentData = mappedDiagnosisData?.data || [];
console.log("mappedDiagnosisData", mappedDiagnosisData);
  const searchTerm = mappedDiagnosisData?.searchTerm || "";

  


  return {
    // State
    appliedFilters,
    expandedRow,
    expandedField,
    currentFilters,
    currentPage,
    diagnosesData : mappedDiagnosisData,
    currentData,
    isLoading,
    isFetching,
    error,
    pageSize,
    searchTerm,

    // Actions
    handleViewClick,
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,

    // Utilities
    expandedDescriptions,
    toggleDescription,
    openDescription,
    transformDiagnosisData,
    transformPrescriptionData,

    //modal
    modalOpen,
    modalData,
    modalType,
    
    handleOpenModal,
    handleCloseModal,
  };
};