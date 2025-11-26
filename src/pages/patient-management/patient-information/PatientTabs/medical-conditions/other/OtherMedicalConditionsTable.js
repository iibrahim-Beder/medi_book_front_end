import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import Pagination from "../../../../../shared/Pagination";
import ConditionsFilters from "../../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../../../Patient-management.css";
import PopupMessage from "../../../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { 
  useGetExternalPatientMedicalConditionsQuery,
  useDeletePatientMedicalConditionMutation,
  useUpdatePatientMedicalConditionMutation,
  useAddPatientMedicalConditionMutation
} from "../../../../../../api/patientOtherMedicalConditionsApi";
import HighlightText from "../../../../../shared/HighlightText";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import toast, { Toaster } from 'react-hot-toast';
import { formatDate } from "../../../../../shared/FormatDate";
const OtherMedicalConditions = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [expandedRow, setExpandedRow] = useState(null);
  
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

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
  const [pageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

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

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage, currentFilters]); 

  const {
    data: medicalConditionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetExternalPatientMedicalConditionsQuery(queryArgs);

  // Mutations
  const [deleteMedicalCondition, { isLoading: isDeleting }] = useDeletePatientMedicalConditionMutation();
  const [updateMedicalCondition, { isLoading: isUpdating }] = useUpdatePatientMedicalConditionMutation();
  const [addMedicalCondition, { isLoading: isAdding }] =      useAddPatientMedicalConditionMutation();

  // Trigger refetch after save/delete
  const triggerRefetch = () => {
    refetch();
  };

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
      severity: "",
      conditionType: "",
      diagnosisDateFrom: null,
      diagnosisDateTo: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  // Template for new record
  const emptyRecord = {
    medicalConditionName: "",
    categoryName: "",
    severity: "",
    diagnosedDate: "",
    isActive: true,
    note: "",
    conditionType: "External"
  };

  // Form fields configuration for modal
  const fields = [
    { 
      name: "medicalConditionName", 
      label: t('OtherMedicalConditions.medical_condition_name'), 
      type: "text", 
      placeholder: t('OtherMedicalConditions.enter_condition_name'),
      required: true
    },
    { 
      name: "categoryName", 
      label: t('OtherMedicalConditions.category'), 
      type: "text", 
      placeholder: t('OtherMedicalConditions.enter_category') 
    },
    { 
      name: "severity", 
      label: t('OtherMedicalConditions.severity'), 
      type: "select", 
      options: [
        { value: "Mild", label: t('OtherMedicalConditions.severity_options.Mild') },
        { value: "Moderate", label: t('OtherMedicalConditions.severity_options.Moderate') }, 
        { value: "Severe", label: t('OtherMedicalConditions.severity_options.Severe') },
        { value: "Critical", label: t('OtherMedicalConditions.severity_options.Critical') }
      ], 
      placeholder: t('OtherMedicalConditions.select_severity'),
      required: true
    },
    { 
      name: "conditionType", 
      label: t('OtherMedicalConditions.condition_type'), 
      type: "select", 
      options: [
        { value: "External", label: t('OtherMedicalConditions.condition_type_options.External') },
        { value: "Internal", label: t('OtherMedicalConditions.condition_type_options.Internal') },
        { value: "Chronic", label: t('OtherMedicalConditions.condition_type_options.Chronic') },
        { value: "Acute", label: t('OtherMedicalConditions.condition_type_options.Acute') }
      ], 
      placeholder: t('OtherMedicalConditions.select_condition_type') 
    },
    { 
      name: "isActive", 
      label: t('OtherMedicalConditions.status'), 
      type: "select", 
      options: [
        { value: true, label: t('Common.status_options.active') },
        { value: false, label: t('Common.status_options.inactive') }
      ], 
      placeholder: t('OtherMedicalConditions.select_status') 
    },
    { 
      name: "diagnosedDate", 
      label: t('OtherMedicalConditions.diagnosed_date'), 
      type: "date", 
      placeholder: t('OtherMedicalConditions.select_date') 
    },
    { 
      name: "note", 
      label: t('OtherMedicalConditions.notes'), 
      type: "textarea", 
      placeholder: t('OtherMedicalConditions.enter_notes') 
    },
  ];

  // Field mapping for highlight
  const fieldMapping = {
    medicalConditionName: "MedicalConditionName",
    categoryName: "CategoryName",
    note: "Note"
  };

  // Handle Add New
  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (condition) => {
    setSelectedRecord({ ...condition });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Handle Delete from Modal
  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  // Close Popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleNotesClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  ///// ====== API functions ===== \\\\\\

  // Handle Save (Add/Update)
  const handleSave = async () => {
    if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
    
    if (!selectedRecord.medicalConditionName) {
      toast.error('Please enter medical condition name.');
      return;
    }

    if (!selectedRecord.severity) {
      toast.error('Please select severity.');
      return;
    }

    console.log('Saving record:', selectedRecord);
    const loadingToast = toast.loading('Saving...');

    if (isAddMode) {
      try {
        const addData = {
          ...selectedRecord,
          diagnosedDate: formatDateForAPI(selectedRecord.diagnosedDate)
        };

        console.log('Sending add data:', addData);

        const res = await addMedicalCondition({ 
          patientId: PATIENT_ID, 
          ...addData 
        }).unwrap();
        
        if (res?.succeeded) {
          toast.success(res.message || "Added Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          triggerRefetch();
        } else {
          console.error("Failed to add", res);
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to add");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Add error:', error);
        toast.error(error?.data?.message || "Error adding medical condition.");
      }
    } else {
      try {
        const updateData = {
          ...selectedRecord,
          diagnosedDate: formatDateForAPI(selectedRecord.diagnosedDate)
        };

        console.log('Sending update data:', updateData);

        const res = await updateMedicalCondition({ 
          conditionId: selectedRecord.id, 
          patientId: PATIENT_ID, 
          updates: updateData 
        }).unwrap();
        
        if (res?.succeeded) {
          console.log("Updated Successfully");
          toast.success(res.message || "Updated Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          triggerRefetch();
        } else {
          console.error("Failed to update", res);
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to update");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Update error:', error);
        toast.error(error?.data?.message || "Error updating medical condition.");
      }
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deleteMedicalCondition({ 
        conditionId: recordToDelete.id, 
        patientId: PATIENT_ID 
      }).unwrap();
      
      if (res?.succeeded) {
        console.log("Deleted Successfully");
        toast.success(res.message || "Deleted Successfully");
        toast.dismiss(loadingToast);
        
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
        triggerRefetch();
      } else {
        console.error("Failed to delete", res);
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this medical condition.");
      setShowPopup(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "#4BAE78";
      case "moderate":
        return "#FFA500";
      case "severe":
        return "#D66A6A";
      case "critical":
        return "#DC3545";
      default:
        return "#6C757D";
    }
  };

  // Get status color and text
  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? "#3fabf3" : "#7A8B97",
      text: t(`Common.status_options.${isActive ? "active" : "inactive"}`),
    };
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("OtherMedicalConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('OtherMedicalConditions.add_condition')}
          </button>
        </div>
      </div>

      <div className="">
        <div className="table-card">
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterType={currentFilters.conditionType}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, conditionType: value }))}
              filterStatus={currentFilters.isActive}
              setFilterStatus={(value) => setCurrentFilters(prev => ({ ...prev, isActive: value }))}
              filterSeverity={currentFilters.severity}
              setFilterSeverity={(value) => setCurrentFilters(prev => ({ ...prev, severity: value }))}
              filterDateFrom={currentFilters.diagnosisDateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, diagnosisDateFrom: date }))}
              filterDateTo={currentFilters.diagnosisDateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, diagnosisDateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={medicalConditionsData?.data || []}
              filterConfigs={[
                {
                  name: "isActive",
                  label: "Status",
                  data: ["All", "Active", "Inactive"].map((opt) => ({
                    key: opt,
                    label: opt,
                  })),
                },
                {
                  name: "conditionType",
                  label: "Condition Type",
                  data: ["External", "Acute", "Chronic", "Internal"].map((opt) => ({
                    key: opt,
                    label: opt,
                  })),
                },
                {
                  name: "severity",
                  label: "Severity",
                  data: ["Mild", "Moderate", "Severe"].map((opt) => ({
                    key: opt,
                    label: opt,
                  })),
                },
              ]}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("OtherMedicalConditionsMobileView.medical_condition_name")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.category")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.severity")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.diagnosed_date")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.condition_type")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.status")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.notes")}</th>
                  <th>{t("created_at")}</th>
                  <th>{t("updated_at")}</th>
                  <th>{t("OtherMedicalConditions.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={120} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={90} height={15} /></td>
                      <td><Skeleton width={60} height={15} /></td>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="10" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : medicalConditionsData?.data && medicalConditionsData.data.length > 0 ? (
                  medicalConditionsData.data.map((condition) => {
                    const statusInfo = getStatusInfo(condition.isActive);
                    return (
                      <React.Fragment key={condition.id}>
                        <tr>
                          <td title={condition.medicalConditionName}>
                            <HighlightText
                              text={condition.medicalConditionName}
                              searchTerm={medicalConditionsData.searchTerm}
                              matchedFields={condition.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.medicalConditionName}
                            />
                          </td>
                          <td>
                            <HighlightText
                              text={condition.categoryName}
                              searchTerm={medicalConditionsData.searchTerm}
                              matchedFields={condition.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.categoryName}
                            />
                          </td>
                          <td>
                            <span
                              style={{
                                color: getSeverityColor(condition.severity),
                                fontWeight: "600",
                                fontSize: "14px",
                              }}
                            >
                              {t(`OtherMedicalConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`)}
                            </span>
                          </td>
                          <td>{formatDate(condition.diagnosedDate)}</td>
                          <td>
                            {t(`OtherMedicalConditionsMobileView.condition_type_options.${condition.conditionType}`)}
                          </td>
                          <td>
                            <span
                              style={{
                                color: statusInfo.color,
                                fontWeight: "600",
                                fontSize: "14px",
                              }}
                            >
                              {statusInfo.text}
                            </span>
                          </td>
                          <td title={condition.note}>
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "250px" }}
                              >
                                {condition.note ? (
                                  <HighlightText
                                    text={truncateText(condition.note, 80)}
                                    searchTerm={medicalConditionsData.searchTerm}
                                    matchedFields={condition.highlightInfo?.matchedFields || []}
                                    fieldName={fieldMapping.note}
                                  />
                                ) : "-"}
                              </span>
                              {condition.note && (
                                <Button
                                  className="view-btn ms-2"
                                  size="sm"
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "#278fff",
                                    padding: 0,
                                    fontSize: "19px",
                                    height: "20px",
                                  }}
                                  onClick={() => handleNotesClick(condition.id)}
                                >
                                  <MdExpandMore
                                    style={{
                                      transform:
                                        expandedRow === condition.id
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}
                            </div>
                          </td>
                          <td>{formatDate(condition.createdAt)}</td>
                          <td>{formatDate(condition.updatedAt)}</td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <Button
                                className="view-btn"
                                variant=""
                                size="sm"
                                style={{ color: "#007bff", backgroundColor: "transparent" }}
                                onClick={() => handleEdit(condition)}
                              >
                                {t("Manage")}
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded row for Notes */}
                        {expandedRow === condition.id && condition.note && (
                          <tr
                            className="table-active-content"
                            style={{ backgroundColor: "transparent" }}
                          >
                            <td
                              colSpan="10"
                              className="border-0 background-in-hover-none"
                            >
                              <div className="description-expanded-section">
                                <TextAreaField
                                  label={t("OtherMedicalConditionsMobileView.notes")}
                                  value={condition.note}
                                  disabled={true}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      {appliedFilters.searchValue ? 
                        t('OtherMedicalConditions.no_results_for_search', { search: appliedFilters.searchValue }) :
                        t('OtherMedicalConditions.no_records_found')
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {medicalConditionsData && medicalConditionsData.data && medicalConditionsData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={medicalConditionsData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={medicalConditionsData.totalPages || 1}
            />
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <DynamicEditModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={fields}
        addMode={isAddMode}
        title={isAddMode ? t('OtherMedicalConditions.add_condition') : t('OtherMedicalConditions.edit_condition')}
      />

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('OtherMedicalConditions.confirm_delete_title')}
          message={t('OtherMedicalConditions.confirm_delete_message', { 
            condition: recordToDelete.medicalConditionName 
          })}
          buttons={[
            { 
              text: t('Cancel'), 
              onClick: handleClosePopup, 
              variant: "secondary" 
            },
            { 
              text: t('Delete'), 
              onClick: handleConfirmDelete, 
              variant: "danger",
              disabled: isDeleting
            }
          ]}
          onClose={handleClosePopup}
        />
      )}

      <Toaster
        position="top-right"
        reverseOrder={true}
      />
    </div>
  );
};

export default OtherMedicalConditions;