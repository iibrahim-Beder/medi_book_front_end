import { useState, useMemo } from "react";
import { 
  useGetExternalPatientMedicationQuery,
  useDeleteExternalPatientMedicationMutation,
  useUpdateExternalPatientMedicationMutation,
  useAddExternalPatientMedicationMutation 
} from "../../../../../../api/PatientProfile/ExternalPatientMedicationMutationApi";
import toast from 'react-hot-toast';
import { formatDateForAPI } from "../../../../../shared/utils";
import { buildPatientMedicationUpdatePayload, validatePatientMedicationForm } from "./otherMedicationsHelpers";

const PATIENT_ID = 4;

export const useOtherMedications = () => {
  // State 
  const [expandedRow, setExpandedRow] = useState(null);
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    medicationId: "",
    startDateFrom: null,
    startDateTo: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    medicationId: "",
    startDateFrom: null,
    startDateTo: null
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
      searchValue: appliedFilters.searchValue,
      medicationId: appliedFilters.medicationId,
      startDateFrom: formatDateForAPI(currentFilters.startDateFrom),
      startDateTo: formatDateForAPI(currentFilters.startDateTo),
      isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true : false
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
    data: medicationsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetExternalPatientMedicationQuery(queryArgs);
    const mappedPrescribedMedicationData = useMemo(() => {
    
  if (!medicationsData?.data) return medicationsData;

  const allMatches =
    medicationsData.meta?.matches?.flatMap(m => m.matches) || [];

  const mappedData = medicationsData.data.map(item => ({
    ...item,
    highlightInfo: {
      matchedFields: allMatches.filter(
        match => match.itemId === item.id
      )
    }
  }));  

  return {
    ...medicationsData,
    data: mappedData,
    searchTerm: medicationsData.meta?.keyword || ""
  };
}, [medicationsData]);

  // Mutations
  const [deleteMedication, { isLoading: isDeleting }] = useDeleteExternalPatientMedicationMutation();
  const [updateMedication, { isLoading: isUpdating }] = useUpdateExternalPatientMedicationMutation();
  const [addMedication, { isLoading: isAdding }] = useAddExternalPatientMedicationMutation();

  // Template for new record
  const emptyRecord = {
    medicationId: "",
    medicationName: "",
    medicationCategory: "",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    isActive: true,
  };

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
      isActive: "All",
      medicationId: "",
      startDateFrom: null,
      startDateTo: null
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

  const handleEdit = (medication) => {
    setSelectedRecord({ 
      ...medication,
      medicationId: medication.medicationId || "",
      medicationName: medication.medicationName || ""
    });
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

  const handleInstructionsClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // API Operations
const handleSave = async () => {
  if (!selectedRecord || isDeleting || isUpdating || isAdding) return;

  const error = validatePatientMedicationForm(selectedRecord);
  if (error) {
    toast.error(error);
    return;
  }

  const loadingToast = toast.loading("Saving...");

  try {
    if (isAddMode) {
      const res = await addMedication({
        patientId: PATIENT_ID,
        medicationData: selectedRecord
      }).unwrap();

      if (res?.succeeded) {
        toast.success(res.message || "Added Successfully");
        setShowModal(false);
        setSelectedRecord(null);
      }
    } else {
      const original = medicationsData?.data?.find(
        r => r.id === selectedRecord.id
      );

      const updates = buildPatientMedicationUpdatePayload(
        original,
        selectedRecord
      );

      if (!Object.keys(updates).length) {
        toast("No changes detected");
        setShowModal(false);
        return;
      }

     await updateMedication({
        medicationId: selectedRecord.id,
        updates
      }).unwrap();

      toast.success("Updated Successfully");
      setShowModal(false);
      setSelectedRecord(null);
    }
  } catch (e) {
    toast.error( "Error saving medication.");
  } finally {
    toast.dismiss(loadingToast);
  }
};

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedication(recordToDelete.id).unwrap();
      
      if (res?.succeeded) {
        toast.success(res.message || "Deleted Successfully");
        toast.dismiss(loadingToast);
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this medication.");
      setShowPopup(false);
    }
  };

  // Utility functions
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? "#3fabf3" : "#7A8B97";
  };

  // Get matched fields for highlighting
  const getMatchedFields = (highlightInfo) => {
    if (!highlightInfo || !highlightInfo.matchedFields) return [];
    return highlightInfo.matchedFields.map(field => field.fieldName);
  };

  // Data calculations
  const currentData = mappedPrescribedMedicationData?.data || [];
  const totalItems = medicationsData?.totalCount || 0;
  const totalPages = medicationsData?.totalPages || 1;
  const searchTerm = appliedFilters.searchValue;

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
    medicationsData:mappedPrescribedMedicationData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNew,
    handleEdit,
    handleDeleteInModal,
    handleClosePopup,
    handleInstructionsClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields
  };
};