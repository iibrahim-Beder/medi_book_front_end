import React from "react";
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
import HighlightText from "../../../../../shared/HighlightText";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import { useOtherMedicalConditions } from "./helper-use/useOtherMedicalConditions";
import { otherMedicalConditionsHelpers } from "./helper-use/otherMedicalConditionsHelpers";
import { useScrollToFirstMatch } from "../../../../../../hooks/useScrollToFirstMatch";
import { useHiddenRightMatchObserver } from "../../../../../../hooks/useRightMatchObserver";
import {hasHiddenMatch, isHasMatched} from "../../component/helpers";
import PatientName from "../../component/PatientName";
const OtherMedicalConditions = () => {
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
    currentData,
    searchTerm,
    
    // Utilities
    getSeverityColor,
    getStatusInfo,
    truncateText
  } = useOtherMedicalConditions();

  const {
    fields,
    fieldMapping,
    filterConfigs,
    formatDate,
    translateSeverity,
    translateConditionType,
    translateStatus
  } = otherMedicalConditionsHelpers(t);
  useScrollToFirstMatch({
      currentData,
      searchTerm,
      FIELD_KEY_MAP:null,
      hasHiddenMatch,
      handleViewClick:handleNotesClick,
    });
    const tableWrapperRef = React.useRef(null);
    useHiddenRightMatchObserver({ tableWrapperRef, currentData, searchTerm });

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("OtherMedicalConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
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
              filterConfigs={filterConfigs}
            />
          </div>

          {/* Data Table */}
          <div ref={tableWrapperRef} style={{ overflow: "auto" }}>
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
                          <td title={condition.medicalConditionName} data-has-match={isHasMatched(condition, fieldMapping.medicalConditionName)? "true": undefined}>
                            <HighlightText
                              text={condition.medicalConditionName}
                              searchTerm={medicalConditionsData.searchTerm}
                              matchedFields={condition.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.medicalConditionName}
                            />
                          </td>
                          <td data-has-match={isHasMatched(condition, fieldMapping.categoryName)? "true": undefined}>
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
                              {translateSeverity(condition.severity)}
                            </span>
                          </td>
                          <td>{formatDate(condition.diagnosedDate)}</td>
                          <td>
                            {translateConditionType(condition.conditionType)}
                          </td>
                          <td>
                            <span
                              style={{
                                color: statusInfo.color,
                                fontWeight: "600",
                                fontSize: "14px",
                              }}
                            >
                              {translateStatus(condition.isActive)}
                            </span>
                          </td>
                          <td title={condition.notes}
                           data-has-match={isHasMatched(condition, "Notes")? "true": undefined}
                           data-right-has-match={isHasMatched(condition, "Notes")? "true": undefined}>
                          
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                // style={{ maxWidth: "250px" }}
                              >
                                {condition.notes ? (
                                  <HighlightText
                                    text={truncateText(condition.notes, 50)}
                                    searchTerm={medicalConditionsData.searchTerm}
                                    matchedFields={condition.highlightInfo?.matchedFields || []}
                                    fieldName={"Notes"}
                                  />
                                ) : "-"}
                              </span>
                              {condition.notes.length > 50 && (
                                <Button
                                  className={` ${hasHiddenMatch(condition, "Notes", condition.notes, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                                  size="sm"
                                  style={{
                                    backgroundColor: "transparent",
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
                        {expandedRow === condition.id && condition.notes && (
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
                                  value={condition.notes}
                                  disabled={true}
                                  isHasMatched={isHasMatched(condition, "Notes")}
                                  searchTerm={searchTerm}
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
    </div>
  );
};

export default OtherMedicalConditions;