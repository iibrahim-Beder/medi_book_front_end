import {  Card } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../../shared/Pagination";
import PopupMessage from "../../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import HighlightText from "../../../../../shared/HighlightText";
import Skeleton from "react-loading-skeleton";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import ConditionsFilters from "../../component/ConditionsFilters";

import { useOtherMedicalConditions } from "./helper-use/useOtherMedicalConditions";
import { otherMedicalConditionsHelpers } from "./helper-use/otherMedicalConditionsHelpers";

import "../../../../Patient-management.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { isHasMatched } from "../../component/helpers";
import PatientName from "../../component/PatientName";

const OtherMedicalConditionsMobileView = ({patientId}) => {
  const { t } = useTranslation();

  const {
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
    medicalConditionsData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,

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
  } = useOtherMedicalConditions(patientId);

  const {
    fields,
    fieldMapping,
    filterConfigs,
    formatDate,
    translateSeverity,
    translateConditionType,
    translateStatus,
  } = otherMedicalConditionsHelpers(t);
  useEffect(() => {
        if (!medicalConditionsData?.data?.length) return;
      
        medicalConditionsData.data.forEach(item => {
          const fields = item.highlightInfo?.matchedFields || [];
      
          fields.forEach(match => {
            if (match.field === "Notes") {
              setExpandedRow(prev => ({
                ...prev,
                [item.id]: true
              }));
            }
          });
        });
      }, [medicalConditionsData]);

  const conditions = medicalConditionsData?.data || [];
  const totalItems = medicalConditionsData?.totalCount || 0;
  const totalPages = medicalConditionsData?.totalPages || 1;

  const noResults = !isLoading && !isFetching && conditions.length === 0 && appliedFilters.searchValue;

  return (
    <div className="table-container mobile-view-card">
      {/* Header */}
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">
            {t("OtherMedicalConditionsMobileView.table_title")}
          </h3>
          <h6 className="table-subtitle"><PatientName/></h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("OtherMedicalConditions.add_condition")}
          </button>
        </div>
      </div>

      <div className="p-2">
        {/* Filters */}
        <div className="mb-3 p-3 ">
          <ConditionsFilters
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(v) =>
              setCurrentFilters((prev) => ({ ...prev, searchValue: v }))
            }
            filterType={currentFilters.conditionType}
            setFilterType={(v) =>
              setCurrentFilters((prev) => ({ ...prev, conditionType: v }))
            }
            filterStatus={currentFilters.isActive}
            setFilterStatus={(v) =>
              setCurrentFilters((prev) => ({ ...prev, isActive: v }))
            }
            filterSeverity={currentFilters.severity}
            setFilterSeverity={(v) =>
              setCurrentFilters((prev) => ({ ...prev, severity: v }))
            }
            filterDateFrom={currentFilters.diagnosisDateFrom}
            setFilterDateFrom={(d) =>
              setCurrentFilters((prev) => ({ ...prev, diagnosisDateFrom: d }))
            }
            filterDateTo={currentFilters.diagnosisDateTo}
            setFilterDateTo={(d) =>
              setCurrentFilters((prev) => ({ ...prev, diagnosisDateTo: d }))
            }
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={conditions}
            filterConfigs={filterConfigs}
          />
        </div>

        {/* Loading */}
        {(isLoading || isFetching) &&
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="mobile-view-card">
              <Card.Body style={{ padding: "15px" }}>
                <Skeleton height={20} width="60%" className="mb-2" />
                <Skeleton height={15} width="20%"  className="mb-2" />
                <Skeleton height={15}  className="mb-2" />
                <div className="row text-center mb-3">
                  <div className="col-4 p-0">
                    <Skeleton height={30} />
                  </div>
                  <div className="col-4 p-0">
                    <Skeleton height={30} />
                  </div>
                  <div className="col-4 p-0">
                    <Skeleton height={30} />
                  </div>
                </div>
                <Skeleton
                  height={35}
                  width="100px"
                  style={{ float: "right" }}
                />
              </Card.Body>
            </Card>
          ))}

        {/* Error */}
        {error && <ErrorLoading isError={error} refetch={refetch} />}

        {/* Data Cards */}
        {!isLoading && !isFetching && conditions.length > 0 && (
          <div className="space-y-3">
            {conditions.map((condition) => {
              const statusInfo = getStatusInfo(condition.isActive);
              const isExpanded = !!expandedRow[condition.id];

              return (
                <Card key={condition.id} className="mobile-view-card shadow-sm">
                  <Card.Body style={{ padding: "15px" }}>
                    {/* Title + Date */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="mb-0 text-ellipsis flex-fill me-2">
                        <HighlightText
                          text={condition.medicalConditionName}
                          searchTerm={medicalConditionsData.searchTerm}
                          matchedFields={
                            condition.highlightInfo?.matchedFields || []
                          }
                          fieldName={"MedicalConditionName"}
                        />
                      </h5>
                      <small className="text-muted">
                        {formatDate(condition.diagnosedDate)}
                      </small>
                    </div>
                      <div className="mb-3">
              <small className="text-muted d-block mb-1">
                {t("OtherMedicalConditionsMobileView.category")} :
              </small>
              <div className="expandable-content">
                <p className="mb-0">
                  <HighlightText
                    text={condition.categoryName}
                    searchTerm={medicalConditionsData.searchTerm}
                    matchedFields={
                      condition.highlightInfo?.matchedFields || []
                    }
                    fieldName={fieldMapping.categoryName}
                  />
                </p>
              </div>
                 </div>

                    {/* Severity | Status | Type */}
                    <div className="row text-center mb-3 g-2">
                      <div className="col-4 p-0 border-end">
                        <div
                          className="fw-bold"
                          style={{
                            color: getSeverityColor(condition.severity),
                          }}
                        >
                          {translateSeverity(condition.severity)}
                        </div>
                        <small className="text-muted">
                          {t("severity")}
                        </small>
                      </div>
                      <div className="col-4 p-0 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: statusInfo.color }}
                        >
                          {translateStatus(condition.isActive)}
                        </div>
                        <small className="text-muted">
                          {t("OtherMedicalConditionsMobileView.status")}
                        </small>
                      </div>
                      <div className="col-4 p-0">
                        <div className="fw-bold text-secondary">
                          {translateConditionType(condition.conditionType)}
                        </div>
                        <small className="text-muted">
                          {t("OtherMedicalConditionsMobileView.conditionType")}
                        </small>
                      </div>
                    </div>

                    {/* Notes */}
                    {condition.notes && (
                      <div className="mb-3">
                        <div className="text-muted d-flex align-items-center mb-1">
                          <small
                            style={{ cursor: "pointer" }}
                            onClick={() => handleNotesClick(condition.id)}
                            className="text-muted"
                          >
                            {t("OtherMedicalConditionsMobileView.notes")}
                          </small>
                          <MdExpandMore
                            className={` ${isHasMatched(condition, "Notes")? "has-match pulse": ""} md-expandable view-btn ms-2`}
                            onClick={() => handleNotesClick(condition.id)}
                            style={{
                              cursor: "pointer",
                              fontSize: "22px",
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </div>

                        {isExpanded && (
                          <div className="expandable-content ">
                            <p className="mb-0">
                            <HighlightText
                              text={condition.notes}
                              searchTerm={medicalConditionsData.searchTerm}
                              matchedFields={
                                condition.highlightInfo?.matchedFields || []
                              }
                              fieldName={"Notes"}
                            /></p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="">
                      <button
                        style={{ float: "inline-end" }}
                        className="view-btn btn btn-outline-primary btn-sm btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(condition)}
                      >
                        {t("Manage")}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
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

        {/* Empty State */}
        {!isLoading &&
          !isFetching &&
          conditions.length === 0 &&
          !appliedFilters.searchValue &&
          !error && (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">
                  {t("OtherMedicalConditions.no_records_found")}
                </p>
              </Card.Body>
            </Card>
          )}

        {/* Pagination */}
        {conditions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* Modal */}
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
        title={
          isAddMode
            ? t("OtherMedicalConditions.add_condition")
            : t("OtherMedicalConditions.edit_condition")
        }
      />

      {/* Delete Popup */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t("OtherMedicalConditions.confirm_delete_title")}
          message={t("OtherMedicalConditions.confirm_delete_message", {
            condition: recordToDelete.medicalConditionName,
          })}
          buttons={[
            {
              text: t("Cancel"),
              onClick: handleClosePopup,
              variant: "secondary",
            },
            {
              text: t("Delete"),
              onClick: handleConfirmDelete,
              variant: "danger",
              disabled: isDeleting,
            },
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default OtherMedicalConditionsMobileView;