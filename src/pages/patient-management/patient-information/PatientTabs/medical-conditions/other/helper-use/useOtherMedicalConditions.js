import { useState, useMemo } from "react";
import { 
  useGetExternalPatientMedicalConditionsQuery,
  useDeleteExternalPatientMedicalConditionMutation, 
  useUpdateExternalPatientMedicalConditionMutation, 
  useAddExternalPatientMedicalConditionMutation 
} from "../../../../../../../api/PatientProfile/patientOtherMedicalConditionsApi";
import {
  validateOtherMedicalConditionForm,
  buildOtherMedicalConditionUpdatePayload
} from "./otherMedicalConditionsHelpers";

import toast from 'react-hot-toast';
import { formatDateForAPI } from "../../../../../../shared/utils";
import { getErrorMessage } from "../../../../../../utils/api-errors";


export const useOtherMedicalConditions = (patientId) => {
  const [expandedRow, setExpandedRow] = useState({});
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    conditionType: "",
    diagnosisDateFrom: null,
    diagnosisDateTo: null
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    conditionType: "",
    diagnosisDateFrom: null,
    diagnosisDateTo: null
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const pageSize = 5;

  // RTK Query
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      diagnosisDateFrom: formatDateForAPI(currentFilters.diagnosisDateFrom), 
      diagnosisDateTo: formatDateForAPI(currentFilters.diagnosisDateTo), 
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
    console.log("apiFilters", apiFilters);

    return {
      patientId: patientId,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage, pageSize,currentFilters]);

  const {
    data: medicalConditionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetExternalPatientMedicalConditionsQuery(queryArgs);
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


  // Mutations - Fixed hook names
  const [deleteMedicalCondition, { isLoading: isDeleting }] = useDeleteExternalPatientMedicalConditionMutation();
  const [updateMedicalCondition, { isLoading: isUpdating }] = useUpdateExternalPatientMedicalConditionMutation();
  const [addMedicalCondition, { isLoading: isAdding }] = useAddExternalPatientMedicalConditionMutation();

  // Template for new record
  const emptyRecord = {
    medicalConditionName: "",
    categoryName: "",
    severity: "Mild",
    diagnosedDate: new Date().toISOString(),
    isActive: true,
    notes: "",
    conditionType: "External"
  };

  // Actions
  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
  const mappedFilters = {
        ...currentFilters,
        ...filters,
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
      conditionType: "",
      diagnosisDateFrom: null,
      diagnosisDateTo: null
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

  const handleEdit = (condition) => {
    setSelectedRecord({ ...condition });
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

  const handleNotesClick = (id,open) => {
    if(open) setExpandedRow(id);
    else setExpandedRow(prev => prev === id ? null : id);
  };

const handleSave = async () => {
  if (!selectedRecord || isDeleting || isUpdating || isAdding) return;

  const errorMessage = validateOtherMedicalConditionForm(selectedRecord);
  if (errorMessage) {
    toast.error(errorMessage);
    return;
  }

  const loadingToast = toast.loading("Saving...");

  try {
    if (isAddMode) {
      const addData = {
        patientId: patientId,
        conditionData: {
          ...selectedRecord,
          diagnosisDate: formatDateForAPI(selectedRecord.diagnosedDate),
          medicalConditionId: selectedRecord.medicalConditionNameId,
          notes: selectedRecord.notes || ""
        }
      };

      const res = await addMedicalCondition(addData).unwrap();

      if (res?.succeeded) {
        console.log(" res ",res);
        toast.success( "Added Successfully");
        setShowModal(false);
        setSelectedRecord(null);
      } else {
        console.log(" res ",res);
        toast.error(getErrorMessage(res));
      }
    } else {
      const originalRecord = medicalConditionsData?.data?.find(
        r => r.id === selectedRecord.id
      );

      const updates = buildOtherMedicalConditionUpdatePayload(
        originalRecord,
        {
          ...selectedRecord,
        }
      );
          
      if (!Object.keys(updates).length) {
        toast("No changes detected");
        setShowModal(false);
        return;
      } 

      console.log("===Updates:", updates);

      await updateMedicalCondition({
        conditionId: selectedRecord.id,
        updates
      }).unwrap();

      toast.success("Updated Successfully");
      setShowModal(false);
      setSelectedRecord(null);
    }
  } catch (error) {
    console.error("Save error:", error);
    toast.error(
      `Error ${isAddMode ? "adding" : "updating"} medical condition.`
    );
  } finally {
    toast.dismiss(loadingToast);
  }
};


  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedicalCondition({ 
        conditionId: recordToDelete.id
      }).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Deleted Successfully");
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.data?.message || "Error deleting this medical condition.");
    } finally {
      toast.dismiss(loadingToast);
      setShowPopup(false);
    }
  };

  // Utility functions
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Mild":
        return "#4BAE78";
      case "Moderate":
        return "#FFA500";
      case "Severe":
        return "#D66A6A";
      case "Critical":
        return "#DC3545";
      default:
        return "#6C757D";
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
  const currentData = mappedMedicalConditionsData?.data || [];
  const searchTerm = mappedMedicalConditionsData?.searchTerm || "";

  return {
    // State
    expandedRow,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    showPopup,
    selectedRecord,
    recordToDelete,
    isAddMode,
    medicalConditionsData:mappedMedicalConditionsData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    currentData,
    searchTerm,
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNew,
    handleEdit,
    handleDeleteInModal,
    handleClosePopup,
    handleNotesClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    setExpandedRow,
    // Utilities
    getSeverityColor,
    getStatusInfo,
    truncateText
  };
};