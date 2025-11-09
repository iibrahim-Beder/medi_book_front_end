// OtherMedicalConditionsMobileView.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../../shared/Pagination";
import PopupMessage from "../../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import {
  useLazyGetExternalPatientMedicalConditionsQuery,
} from "../../../../../../api/patientOtherMedicalConditionsApi";
import HighlightText from "../../../../../shared/HighlightText";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Skeleton from "react-loading-skeleton";

const PATIENT_ID = 4;          
const PAGE_SIZE = 5;        

const OtherMedicalConditionsMobileView = () => {
  const { t } = useTranslation();


  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    conditionType: "",
    diagnosisDateFrom: null,
    diagnosisDateTo: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...currentFilters });
  const [currentPage, setCurrentPage] = useState(1);

 
  const [triggerGet, { data: apiData, isLoading, isFetching, error }] =
    useLazyGetExternalPatientMedicalConditionsQuery();

  const fetchData = useCallback(() => {
    const apiFilters = {
      ...appliedFilters,
      isActive:
        appliedFilters.isActive === "All"
          ? undefined
          : appliedFilters.isActive === "Active"
          ? true
          : appliedFilters.isActive === "Inactive"
          ? false
          : undefined,
      diagnosisDateFrom: formatDateForAPI(appliedFilters.diagnosisDateFrom),
      diagnosisDateTo: formatDateForAPI(appliedFilters.diagnosisDateTo),
    };

    Object.keys(apiFilters).forEach((key) => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    triggerGet({
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    });
  }, [triggerGet, appliedFilters, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  
  const handleSearch = (filters) => {
    setCurrentPage(1);
    const newFilters = filters && typeof filters === "object" ? filters : currentFilters;
    setAppliedFilters(newFilters);
    setCurrentFilters(newFilters);
  };

  const handleResetFilters = () => {
    const reset = {
      searchValue: "",
      isActive: "All",
      severity: "",
      conditionType: "",
      diagnosisDateFrom: null,
      diagnosisDateTo: null,
    };
    setCurrentFilters(reset);
    setAppliedFilters(reset);
    setCurrentPage(1);
  };

  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});

  const emptyRecord = {
    medicalConditionName: "",
    categoryName: "",
    severity: "",
    diagnosedDate: "",
    isActive: true,
    note: "",
    conditionType: "External",
  };

  const fields = [
    {
      name: "medicalConditionName",
      label: t("OtherMedicalConditions.medical_condition_name"),
      type: "text",
      placeholder: t("OtherMedicalConditions.enter_condition_name"),
    },
    {
      name: "categoryName",
      label: t("OtherMedicalConditions.category"),
      type: "text",
      placeholder: t("OtherMedicalConditions.enter_category"),
    },
    {
      name: "severity",
      label: t("OtherMedicalConditions.severity"),
      type: "select",
      options: [
        { value: "Mild", label: t("OtherMedicalConditions.severity_options.Mild") },
        { value: "Moderate", label: t("OtherMedicalConditions.severity_options.Moderate") },
        { value: "Severe", label: t("OtherMedicalConditions.severity_options.Severe") },
        { value: "Critical", label: t("OtherMedicalConditions.severity_options.Critical") },
      ],
      placeholder: t("OtherMedicalConditions.select_severity"),
    },
    {
      name: "conditionType",
      label: t("OtherMedicalConditions.condition_type"),
      type: "select",
      options: [
        { value: "External", label: t("OtherMedicalConditions.condition_type_options.External") },
        { value: "Internal", label: t("OtherMedicalConditions.condition_type_options.Internal") },
        { value: "Chronic", label: t("OtherMedicalConditions.condition_type_options.Chronic") },
        { value: "Acute", label: t("OtherMedicalConditions.condition_type_options.Acute") },
      ],
      placeholder: t("OtherMedicalConditions.select_condition_type"),
    },
    {
      name: "isActive",
      label: t("OtherMedicalConditions.status"),
      type: "select",
      options: [
        { value: true, label: t("Common.status_options.active") },
        { value: false, label: t("Common.status_options.inactive") },
      ],
      placeholder: t("OtherMedicalConditions.select_status"),
    },
    {
      name: "diagnosedDate",
      label: t("OtherMedicalConditions.diagnosed_date"),
      type: "date",
      placeholder: t("OtherMedicalConditions.select_date"),
    },
    {
      name: "note",
      label: t("OtherMedicalConditions.notes"),
      type: "textarea",
      placeholder: t("OtherMedicalConditions.enter_notes"),
    },
  ];


  const handleAddNew = () => {
    setSelectedCondition({ ...emptyRecord });
    setIsAddMode(true);
    setShowEditModal(true);
  };

  const handleEdit = (condition) => {
    setSelectedCondition({ ...condition });
    setIsAddMode(false);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!selectedCondition) return;
    console.log("Saving record (mobile):", selectedCondition);
    setShowEditModal(false);
    setSelectedCondition(null);
    fetchData(); 
  };

  const handleDeleteInModal = () => {
    if (selectedCondition) {
      setRecordToDelete(selectedCondition);
      setShowPopup(true);
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      console.log("Deleting record (mobile):", recordToDelete);
      setShowPopup(false);
      setRecordToDelete(null);
      setShowEditModal(false);
      fetchData();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const toggleNotes = (conditionId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [conditionId]: !prev[conditionId],
    }));
  };


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

  const getStatusInfo = (isActive) => ({
    color: isActive ? "#3fabf3" : "#7A8B97",
    text: t(`Common.status_options.${isActive ? "active" : "inactive"}`),
  });

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


const conditions = apiData?.data || [];
  const totalItems = apiData?.totalCount || 0;
  const totalPages = apiData?.totalPages || 1;

  const noResults =
    !isLoading &&
    !isFetching &&
    conditions.length === 0 &&
    appliedFilters.searchValue;

  return (
    <div className="table-container mobile-view-card">
      {/* Header */}
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("OtherMedicalConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("OtherMedicalConditions.add_condition")}
          </button>
        </div>
      </div>

      <div className="p-2">
        {/* Filters */}
        <div className="mb-3 p-3">
          <ConditionsFilters
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(v) => setCurrentFilters((p) => ({ ...p, searchValue: v }))}
            filterStatus={currentFilters.isActive}
            setFilterStatus={(v) => setCurrentFilters((p) => ({ ...p, isActive: v }))}
            filterSeverity={currentFilters.severity}
            setFilterSeverity={(v) => setCurrentFilters((p) => ({ ...p, severity: v }))}
            filterDateFrom={currentFilters.diagnosisDateFrom}
            setFilterDateFrom={(d) => setCurrentFilters((p) => ({ ...p, diagnosisDateFrom: d }))}
            filterDateTo={currentFilters.diagnosisDateTo}
            setFilterDateTo={(d) => setCurrentFilters((p) => ({ ...p, diagnosisDateTo: d }))}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={conditions}
            filterConfigs={[
              {
                name: "isActive",
                label: "Status",
                data: ["All", "Active", "Inactive"].map((opt) => ({ key: opt, label: opt })),
              },
              {
                name: "conditionType",
                label: "Condition Type",
                data: ["External", "Internal", "Chronic", "Acute"].map((opt) => ({
                  key: opt,
                  label: opt,
                })),
              },
              {
                name: "severity",
                label: "Severity",
                data: ["Mild", "Moderate", "Severe", "Critical"].map((opt) => ({
                  key: opt,
                  label: opt,
                })),
              },
            ]}
          />
        </div>

        {/* Loading / Error */}
        {(isLoading || isFetching) ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                           <div className="d-flex justify-content-between align-items-start mb-2">
                             <Skeleton width={150} height={20} />
                           </div>
                           <div className="row text-center mb-3">
                             <div className="col-4">
                               <Skeleton width={60} height={20} />
                               <Skeleton width={50} height={15} />
                             </div>
                             <div className="col-4">
                               <Skeleton width={80} height={20} />
                               <Skeleton width={70} height={15} />
                             </div>
                             <div className="col-4">
                               <Skeleton width={50} height={20} />
                               <Skeleton width={40} height={15} />
                             </div>
                           </div>
                               <Skeleton width={40} height={15} />
                           <div style={{textAlign:"end"}}>
                           <Skeleton width={80} height={30} />
                           </div>
                         </Card.Body>
                </Card>
              ))}
            </div>
        ) : (<>   
         {/* Cards */}
        <div className="space-y-3">
          {conditions.map((condition) => {
            const statusInfo = getStatusInfo(condition.isActive);
            const isNotesExpanded = expandedNotes[condition.id];

            return (
              <Card key={condition.id} className="mobile-view-card">
                <Card.Body style={{ padding: "15px" }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-ellipsis" style={{ margin: 0 }}>
                      <HighlightText
                        text={condition.medicalConditionName}
                        searchTerm={apiData?.searchTerm}
                        matchedFields={
                          condition.highlightInfo?.matchedFields || []
                        }
                        fieldName="MedicalConditionName"
                      />
                    </h5>
                    <small style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      {formatDate(condition.diagnosedDate)}{" "}
                    </small>
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col-4 border-end">
                      <div
                        className="fw-bold"
                        style={{ color: getSeverityColor(condition.severity) }}
                      >
                        {t(
                          `OtherMedicalConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`
                        )}
                      </div>
                      <small className="text-muted">
                        {t("OtherMedicalConditionsMobileView.severity")}
                      </small>
                    </div>
                    <div className="col-4 border-end">
                      <div
                        className="fw-bold"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </div>
                      <small className="text-muted">
                        {t("OtherMedicalConditionsMobileView.status")}
                      </small>
                    </div>
                    <div className="col-4 pl-0 pr-1">
                      <div className="fw-bold text-secondary">
                        {condition.conditionType}
                      </div>
                      <small className="text-muted">
                        {t("OtherMedicalConditionsMobileView.conditionType")}
                      </small>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-2">
                    <small
                      className="text-muted d-flex mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleNotes(condition.id)}
                    >
                      {t("OtherMedicalConditionsMobileView.notes")} :
                      {condition.note && (
                        <button
                          className=""
                          onClick={() => toggleNotes(condition.id)}
                          style={{
                            fontSize: "20px",
                            color: "#278fff",
                            padding: "3px 0 0",
                          }}
                        >
                          <MdExpandMore
                            onClick={() => toggleNotes(condition.id)}
                            style={{
                              transform: isNotesExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </button>
                      )}
                    </small>

                    <div
                      className={`expandable-content ${
                        isNotesExpanded ? "" : "p-0"
                      }`}
                    >
                      <p
                        onClick={() => toggleNotes(condition.id)}
                        className="mt-1"
                        style={{
                          margin: "0",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {isNotesExpanded ? (
                          <HighlightText
                            text={condition.note}
                            searchTerm={apiData.searchTerm}
                            matchedFields={
                              condition.highlightInfo?.matchedFields || []
                            }
                            fieldName={"notes"}
                          />
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="view-btn btn btn-outline-primary btn-sm"
                      variant="outline-primary"
                      size="sm"
                      style={{ float: "inline-end" }}
                      onClick={() => handleEdit(condition)}
                    >
                      {t("Manage")}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })} </div> </>)}

     

          {/* No results */}
          {noResults && (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">
                  {t("OtherMedicalConditions.no_results_for_search", {
                    search: appliedFilters.searchValue,
                  })}
                </p>
              </Card.Body>
            </Card>
          )}

          {/* Empty state (no filters) */}
          {!isLoading &&
            !isFetching &&
            conditions.length === 0 &&
            !appliedFilters.searchValue && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t("OtherMedicalConditions.no_records_found")}</p>
                </Card.Body>
              </Card>
            )}
       
      </div>

      {/* Pagination */}
      {conditions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={PAGE_SIZE}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {/* Edit / Add Modal */}
      <DynamicEditModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCondition(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedCondition}
        setRecord={setSelectedCondition}
        fields={fields}
        addMode={isAddMode}
        title={
          isAddMode
            ? t("OtherMedicalConditions.add_condition")
            : t("OtherMedicalConditions.edit_condition")
        }
      />

      {/* Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t("OtherMedicalConditions.confirm_delete_title")}
          message={t("OtherMedicalConditions.confirm_delete_message", {
            condition: recordToDelete.medicalConditionName,
          })}
          buttons={[
            { text: t("Cancel"), onClick: handleClosePopup, variant: "secondary" },
            { text: t("Delete"), onClick: handleConfirmDelete, variant: "danger" },
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default OtherMedicalConditionsMobileView;