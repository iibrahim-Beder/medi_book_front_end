import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import {MdExpandMore} from "react-icons/md";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import Pagination from "../../../../../shared/Pagination";
import ConditionsFilters from "../../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../../../Patient-management.css";
import PopupMessage from "../../../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLazyGetExternalPatientMedicalConditionsQuery } from "../../../../../../api/patientOtherMedicalConditionsApi";
import HighlightText from "../../../../../shared/HighlightText";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import ErrorLoading from "../../../../../shared/ErrorLoading";


const OtherMedicalConditions = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4; 

  const [expandedRow, setExpandedRow] = useState(null);
  
  // Filters states
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
  const [pageSize, setPageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // RTK Query
  const [triggerGetMedicalConditions, { 
    data: medicalConditionsData, 
    isLoading, 
    isFetching, 
    error 
  }] = useLazyGetExternalPatientMedicalConditionsQuery();
  console.log("Medical Conditions Data:", medicalConditionsData);
  useEffect(() => {
     setAppliedFilters(currentFilters);
    fetchMedicalConditions();
  }, [currentPage, appliedFilters,  currentFilters.diagnosisDateFrom,
  currentFilters.diagnosisDateTo,]);

  const fetchMedicalConditions = () => {
    const apiFilters = {
      ...appliedFilters,
   isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true :
                appliedFilters.isActive === "Inactive" ? false : undefined,
                diagnosisDateFrom: formatDateForAPI(appliedFilters.diagnosisDateFrom),
                diagnosisDateTo: formatDateForAPI(appliedFilters.diagnosisDateTo),
                    };

                    
          console.log('API Filters:', apiFilters);
          // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    triggerGetMedicalConditions({
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    });
    console.log('==================== API Filters:', apiFilters);
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
      placeholder: t('OtherMedicalConditions.enter_condition_name') 
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
      placeholder: t('OtherMedicalConditions.select_severity') 
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
    { name: "diagnosedDate", label: t('OtherMedicalConditions.diagnosed_date'), type: "date", placeholder: t('OtherMedicalConditions.select_date') },
    { name: "note", label: t('OtherMedicalConditions.notes'), type: "textarea", placeholder: t('OtherMedicalConditions.enter_notes') },
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

  // Handle Save (Add/Update)
  const handleSave = () => {
    if (!selectedRecord) return;

    console.log('Saving record:', selectedRecord);
    
    setShowModal(false);
    setSelectedRecord(null);
    fetchMedicalConditions();
  };

  // Handle Delete Click
  const handleDeleteClick = (condition) => {
    setRecordToDelete(condition);
    setShowPopup(true);
  };

  // Handle Delete from Modal
  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      console.log('Deleting record:', recordToDelete);
      
      setShowPopup(false);
      setRecordToDelete(null);
      setShowModal(false);
      fetchMedicalConditions();
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              // filterType={currentFilters.conditionType}
              // setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, conditionType: value }))}
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
                data: ["External", " Acute", "Chronic", "Internal" ].map((opt) => ({
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
                      <td><Skeleton width={80} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={fetchMedicalConditions}
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
                              colSpan="8"
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
                    <td colSpan="8" className="text-center text-muted">
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
              variant: "danger" 
            }
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default OtherMedicalConditions;