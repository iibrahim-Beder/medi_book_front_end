import React from "react";
import { Table, Button } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../../shared/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import { useMedicalConditions } from "./useMedicalConditions";
import { medicalConditionsHelpers } from "./medicalConditionsHelpers";

const DiagnosedConditionsTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    expandedRow,
    medicalConditionsData,
    isLoading,
    isFetching,
    error,
    pageSize,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleExpandClick,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    getSeverityColor,
    getStatusInfo,
    truncateText,
    formatDate
  } = useMedicalConditions(false); 

  const {
    conditionTypes,
    severityLevels,
    statusOptions,
    searchFields,
    translateSeverity,
    translateStatus
  } = medicalConditionsHelpers(t);

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

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosedConditionsTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
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

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("DiagnosedConditionsTable.medical_condition_name")}</th>
                  <th>{t("DiagnosedConditionsTable.severity")}</th>
                  <th>{t("DiagnosedConditionsTable.diagnosis_name")}</th>
                  <th>{t("DiagnosedConditionsTable.diagnosed_date")}</th>
                  <th>{t("DiagnosedConditionsTable.status")}</th>
                  <th>{t("DiagnosedConditionsTable.notes")}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={200} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center text-danger">
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
                            {condition.medicalConditionName}
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
                          <td title={condition.diagnosisName}>
                            {condition.diagnosisName}
                          </td>
                          <td>{formatDate(condition.diagnosedDate)}</td>
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
                          <td title={condition.notes}>
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "250px" }}
                              >
                                {truncateText(condition.notes, 80)}
                              </span>
                              {condition.notes && condition.notes.length > 80 && (
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
                                  onClick={() => handleExpandClick(condition.id)}
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
                        </tr>

                        {/* Expanded row for Notes */}
                        {expandedRow === condition.id && condition.notes && condition.notes.length > 80 && (
                          <tr
                            className="table-active-content"
                            style={{ backgroundColor: "transparent" }}
                          >
                            <td
                              colSpan="6"
                              className="border-0 background-in-hover-none"
                            >
                              <div className="description-expanded-section">
                                <TextAreaField
                                  label={t("DiagnosedConditionsTable.notes")}
                                  value={condition.notes}
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
                    <td colSpan="6" className="text-center text-muted">
                      {appliedFilters.searchValue ?
                        t('DiagnosedConditionsTable.no_results_for_search', { search: appliedFilters.searchValue }) :
                        t('DiagnosedConditionsTable.no_records_found')
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
    </div>
  );
};

export default DiagnosedConditionsTable;