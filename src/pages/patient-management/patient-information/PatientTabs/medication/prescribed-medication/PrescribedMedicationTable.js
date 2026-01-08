import React from "react";
import { Table, Button } from "react-bootstrap";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../../shared/HighlightText";
import "../../../../Patient-management.css";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import { usePrescribedMedication } from "./usePrescribedMedication";
import { prescribedMedicationHelpers, TableSkeleton } from "./prescribedMedicationHelpers";
import { formatDate } from "../../../../../shared/utils";
import { shouldExpand } from "../../component/helpers";

const PrescribedMedicationTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedRow,
    currentFilters,
    appliedFilters,
    currentPage,
    prescribedMedicationData,
    isLoading,
    isFetching,
    error,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    handleExpandClick,
    expandedField,
    
    // Actions
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
  } = usePrescribedMedication();

  const {
    fieldMapping,
    tableHeaders,
    emptyStates,
    formatDuration
  } = prescribedMedicationHelpers(t);

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("PrescribedMedicationTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("PrescribedMedicationTable.table_subtitle")}</h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterDateFrom={currentFilters.fromDate}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
              filterDateTo={currentFilters.toDate}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              showStatusFilter={false}
              showSeverityFilter={false}
              showConditionTypeFilter={false}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{tableHeaders.medication}</th>
                  <th>{tableHeaders.dosage}</th>
                  <th>{tableHeaders.duration}</th>
                  <th>{tableHeaders.instructions}</th>
                  <th>{tableHeaders.diagnosisName}</th>
                  <th>{tableHeaders.prescribedName}</th>
                  <th>{tableHeaders.category}</th>
                  <th>{tableHeaders.createdAt}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  <TableSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((medication) => (
                    <React.Fragment key={medication.id}>
                      <tr>
                        <td title={medication.medicationName}>
                          <HighlightText
                          text={medication.medicationName}
                          searchTerm={searchTerm}
                          matchedFields={medication.highlightInfo?.matchedFields || []}
                          fieldName={"MedicationName"}
                          />
                        </td>
                        <td title={medication.dosage}>
                          <HighlightText
                            text={medication.dosage}
                            searchTerm={searchTerm}
                           matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.dosage}
                          />
                        </td>
                        <td title={formatDuration(medication.durationInDays)}>
                          {formatDuration(medication.durationInDays)}
                        </td>

                        <td title={medication.instructions}>
                          {!medication.instructions ? (
                            "-"
                            
                          ):(

                             <div className="d-flex align-items-center">
                            <span className="text-truncate" style={{ maxWidth: "250px" }}>
                              <HighlightText
                                text={truncateText(medication.instructions, 40)}
                                searchTerm={searchTerm}
                                matchedFields={medication.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.instructions}
                              />
                            </span>
                            {shouldExpand(medication.instructions,40) &&
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
                              onClick={() => handleExpandClick(medication.id,"instructions")}
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === medication.id &&
                                    expandedField === "instructions"

                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>}
                          </div>
                          )
                          }

                         
                        </td>
                        <td title={medication.diagnosisName}>
                          <div className="d-flex align-items-center">
                            <span className="text-truncate">
                              <HighlightText
                                text={truncateText(medication.diagnosisName, 40)}
                                searchTerm={searchTerm}
                                matchedFields={medication.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.diagnosisName}
                              />
                            </span>

                            {shouldExpand(medication.diagnosisName, 40) && (
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
                                onClick={() =>
                                  handleExpandClick(medication.id, "diagnosisName")
                                }
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === medication.id &&
                                      expandedField === "diagnosisName"
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "0.3s",
                                  }}
                                />
                              </Button>
                            )}
                          </div>
                        </td>

                        <td title={medication.prescriptionName}>
                          <div className="d-flex align-items-center">
                            <span className="text-truncate">
                              <HighlightText
                                text={truncateText(medication.prescriptionName, 40)}
                                searchTerm={searchTerm}
                                matchedFields={medication.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.prescriptionName}
                              />
                            </span>

                            {shouldExpand(medication.prescriptionName, 40) && (
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
                                onClick={() =>
                                  handleExpandClick(medication.id, "prescriptionName")
                                }
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === medication.id &&
                                      expandedField === "prescriptionName"
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "0.3s",
                                  }}
                                />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td title={medication.medicationCategoryName}>
                          <HighlightText
                            text={medication.medicationCategoryName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName={"MedicationCategoryName"}
                          />
                        </td>
                        <td title={medication.createdAt}>
                          {formatDate(medication.createdAt)}
                        </td>
                      </tr>

                {/* Expanded row */}
                     {expandedRow === medication.id && (
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
                                label={tableHeaders[expandedField]}
                                value={medication[expandedField]}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      {emptyStates.noResults(appliedFilters.searchValue)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {prescribedMedicationData && prescribedMedicationData.data && prescribedMedicationData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescribedMedicationTable;