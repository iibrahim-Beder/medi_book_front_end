import React from "react";
import { Card, Button, Modal } from "react-bootstrap";
import ConditionsFilters from "../../component/ConditionsFilters";
import Pagination from "../../../../../shared/Pagination";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Field from "../../../../../ui/form-fields/Field";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import HighlightText from "../../../../../shared/HighlightText";
import { useMedicalConditions } from "./useMedicalConditions"; 
import { medicalConditionsHelpers } from "./medicalConditionsHelpers";

const DiagnosedConditionsMobileView = () => {
  const { t } = useTranslation();
  const {
    currentFilters,
    appliedFilters,
    currentPage,
    medicalConditionsData,
    isLoading,
    isFetching,
    error,
    pageSize,
    setCurrentPage,
    setCurrentFilters,
    handleSearch,
    handleResetFilters,
    refetch,

    expandedNotes,
    toggleNotes,

    getSeverityColor,
    getStatusInfo,
    formatDate
  } = useMedicalConditions(true); // true = mobile view
   const {
      conditionTypes,
      severityLevels,
      statusOptions,
      searchFields,
      translateSeverity,
      translateStatus
    } = medicalConditionsHelpers(t);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedCondition, setSelectedCondition] = React.useState(null);

  const hasData = medicalConditionsData?.data && medicalConditionsData.data.length > 0;
  const filterConfigs = [
    {
      name: "conditionType",
      label: "Condition Type",
      data: conditionTypes,
    },
    {
      name: "severity",
      label: "Severity",
      data: severityLevels,
    },
    {
      name: "isActive",
      label: "Status",
      data: statusOptions,
    }
  ];
  const handleOpenModal = (condition) => {
    setSelectedCondition(condition);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCondition(null);
  };

  // Field mapping for HighlightText
  const fieldMapping = {
    medicalConditionName: "medicalConditionName",
    diagnosisName: "diagnosisName",
    severity: "severity",
    notes: "notes"
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <ErrorLoading isError={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="table-container mobile-view-card">
      {/* Header */}
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("DiagnosedConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3 p-3">
       <ConditionsFilters
         searchTerm={currentFilters.searchValue}
         setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
         filterType={currentFilters.conditionType}
         setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, conditionType: value }))}
         filterDateFrom={currentFilters.fromDate}
         setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
         filterDateTo={currentFilters.toDate}
         setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
         onReset={handleResetFilters}
         onSearch={handleSearch}
         conditions={medicalConditionsData?.data || []}
         filterConfigs={filterConfigs}
       />
      </div>

      {/* Loading State */}
      {(isLoading || isFetching) ? (
        <div className="p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="mb-3">
              <Card.Body>
                <Skeleton height={24} width="70%" />
                <Skeleton height={16} count={3} className="mt-3" />
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-2">
          {/* Cards List */}
          <div className="space-y-3">
            {hasData ? (
              medicalConditionsData.data.map((condition) => {
                const statusInfo = getStatusInfo(condition.isActive);
                const isNotesExpanded = expandedNotes[condition.id];

                return (
                  <Card key={condition.id} className="mobile-view-card">
                    <Card.Body style={{ padding: "15px" }}>
                      {/* Condition Name */}
                      <h5>
                        <HighlightText
                          text={condition.medicalConditionName}
                          searchTerm={appliedFilters.searchValue}
                          matchedFields={condition.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.medicalConditionName}
                        />
                      </h5>

                      {/* Diagnosis Name */}
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("DiagnosedConditionsMobileView.diagnosis_name")}:
                        </small>
                        <p className="mb-1">
                          <HighlightText
                            text={condition.diagnosisName}
                            searchTerm={appliedFilters.searchValue}
                            matchedFields={condition.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.diagnosisName}
                          />
                        </p>
                      </div>

                      {/* Severity + Status + Date */}
                      <div className="row text-center mb-3">
                        <div className="col-4 border-end">
                          <div className="fw-bold" style={{ color: getSeverityColor(condition.severity) }}>
                            {t(`DiagnosedConditionsMobileView.severity_options.${condition.severity?.toLowerCase()}`)}
                          </div>
                          <small className="text-muted">{t("DiagnosedConditionsMobileView.severity")}</small>
                        </div>
                        <div className="col-4 border-end">
                          <div className="fw-bold" style={{ color: statusInfo.color }}>
                            {statusInfo.text}
                          </div>
                          <small className="text-muted">{t("DiagnosedConditionsMobileView.status")}</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-secondary">
                            {formatDate(condition.diagnosedDate)}
                          </div>
                          <small className="text-muted">{t("DiagnosedConditionsMobileView.diagnosed_date")}</small>
                        </div>
                      </div>

                      {/* Notes - Expandable */}
                      {condition.notes && (
                        <div className="mb-3">
                          <small
                            className="text-muted d-flex align-items-center mb-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleNotes(condition.id)}
                          >
                            {t("DiagnosedConditionsMobileView.notes")}:
                            <MdExpandMore
                              style={{
                                fontSize: "20px",
                                color: "#278fff",
                                marginLeft: "4px",
                                transform: isNotesExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease"
                              }}
                            />
                          </small>
                          {isNotesExpanded && (
                            <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                              <HighlightText
                                text={condition.notes}
                                searchTerm={appliedFilters.searchValue}
                                matchedFields={condition.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.notes}
                              />
                            </p>
                          )}
                        </div>
                      )}

                      {/* View Details Button */}
                    <div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        style={{ float: "inline-end" }}
                        onClick={() => handleOpenModal(condition)}
                      >
                        {t("DiagnosedConditionsMobileView.view_all_details")}
                      </Button>
                    </div>
                   </Card.Body>
                  </Card>
                );
              })
            ) : (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">
                    {appliedFilters.searchValue
                      ? t("Common.no_results_for_search", { search: appliedFilters.searchValue })
                      : t("DiagnosedConditionsMobileView.no_conditions_found")}
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {hasData && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={medicalConditionsData.totalCount || 0}
                rowsPerPage={pageSize}
                onPageChange={setCurrentPage}
                totalPages={medicalConditionsData.totalPages || 1}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered scrollable>
        <Modal.Header className="border-bottom-0">
          <Modal.Title>{selectedCondition?.medicalConditionName}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>
        <Modal.Body className="space-y-4 pt-0">
          <Field label={t("DiagnosedConditionsMobileView.diagnosis_name")} value={selectedCondition?.diagnosisName} disabled />
          <Field
            label={t("DiagnosedConditionsMobileView.severity")}
            value={selectedCondition?.severity ? t(`DiagnosedConditionsMobileView.severity_options.${selectedCondition.severity.toLowerCase()}`) : ""}
            disabled
            style={{ color: getSeverityColor(selectedCondition?.severity) }}
          />
          <Field
            label={t("DiagnosedConditionsMobileView.status")}
            value={selectedCondition?.isActive != null ? t(`Common.status_options.${selectedCondition.isActive ? "active" : "inactive"}`) : ""}
            disabled
            style={{ color: getStatusInfo(selectedCondition?.isActive).color }}
          />
          <Field label={t("DiagnosedConditionsMobileView.diagnosed_date")} value={formatDate(selectedCondition?.diagnosedDate)} disabled />
          <TextAreaField label={t("DiagnosedConditionsMobileView.notes")} value={selectedCondition?.notes || ""} disabled />
        </Modal.Body>
     <Modal.Footer className="border-top-0">
               <button
                 className="dc-btn dc-cancel-btn"
                 onClick={handleCloseModal}
               >
                 {t("DiagnosedConditionsMobileView.close")}
               </button>
             </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiagnosedConditionsMobileView;