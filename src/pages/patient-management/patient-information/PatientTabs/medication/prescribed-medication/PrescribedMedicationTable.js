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
import { hasHiddenMatch, isHasMatched, shouldExpand } from "../../component/helpers";
import { useScrollToFirstMatch } from "../../../../../../hooks/useScrollToFirstMatch";
import { useHiddenRightMatchObserver } from "../../../../../../hooks/useRightMatchObserver";
import PatientName from "../../component/PatientName";

const PrescribedMedicationTable = ({patientId}) => {
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
  } = usePrescribedMedication({patientId});

  const {
    fieldMapping,
    tableHeaders,
    emptyStates,
    formatDuration
  } = prescribedMedicationHelpers(t);
  useScrollToFirstMatch({
      currentData,
      searchTerm,
      FIELD_KEY_MAP: null,
      hasHiddenMatch,
      handleViewClick:handleExpandClick,
    });
    const tableWrapperRef = React.useRef(null);
    useHiddenRightMatchObserver({ tableWrapperRef, currentData, searchTerm });

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("PrescribedMedicationTable.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
        </div>
      </div>

      <div className="">
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
              showFilterDropdown={false}
            />
          </div>

          {/* Data Table */}
          <div ref={tableWrapperRef} style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{tableHeaders.medication}</th>
                  <th>{tableHeaders.category}</th>
                  <th>{tableHeaders.dosage}</th>
                  <th>{tableHeaders.duration}</th>
                  <th>{tableHeaders.instructions}</th>
                  <th>{tableHeaders.diagnosisName}</th>
                  <th>{tableHeaders.prescribedName}</th>
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
                        <td  
                          data-has-match={isHasMatched(medication, fieldMapping.medicationName)? "true": undefined}
                          title={medication.medicationName}>
                          <HighlightText
                          text={medication.medicationName}
                          searchTerm={searchTerm}
                          matchedFields={medication.highlightInfo?.matchedFields || []}
                          fieldName={"MedicationName"}
                          />
                        </td>
                        <td data-has-match={isHasMatched(medication, "MedicationCategoryName")? "true": undefined} title={medication.medicationCategoryName}>
                          <HighlightText
                            text={medication.medicationCategoryName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName={"MedicationCategoryName"}
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

                        <td
                         data-has-match={isHasMatched(medication, fieldMapping.instructions)? "true": undefined}
                         data-right-has-match={isHasMatched(medication, fieldMapping.instructions)? "true": undefined} title={medication.instructions}>
                          {!medication.instructions ? (
                            "-"
                            
                          ):(

                             <div className="d-flex align-items-center">
                            <span className="text-truncate">
                              <HighlightText
                                text={truncateText(medication.instructions, 50)}
                                searchTerm={searchTerm}
                                matchedFields={medication.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.instructions}
                              />
                            </span>
                            {shouldExpand(medication.instructions,50) &&
                            <Button
                              className={` ${hasHiddenMatch(medication, fieldMapping.instructions, medication.instructions, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                              size="sm"
                              style={{
                                backgroundColor: "transparent",
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
                        <td
                         data-has-match={isHasMatched(medication, fieldMapping.diagnosisName)? "true": undefined}
                         data-right-has-match={isHasMatched(medication, fieldMapping.diagnosisName)? "true": undefined}
                         title={medication.diagnosisName}>
                          <div className="d-flex align-items-center">
                            <span className="text-truncate">
                              <HighlightText
                                text={truncateText(medication.diagnosisName, 50)}
                                searchTerm={searchTerm}
                                matchedFields={medication.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.diagnosisName}
                              />
                            </span>

                            {shouldExpand(medication.diagnosisName, 50) && (
                              <Button
                                className={` ${hasHiddenMatch(medication, fieldMapping.diagnosisName, medication.notes, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
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

                        <td
                          data-has-match={isHasMatched(medication, fieldMapping.prescriptionName)? "true": undefined}
                          data-right-has-match={isHasMatched(medication, fieldMapping.prescriptionName)? "true": undefined} title={medication.prescriptionName}>
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
                                className={` ${hasHiddenMatch(medication, fieldMapping.prescriptionName, medication.prescriptionName, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                                size="sm"
                                style={{
                                backgroundColor: "transparent",
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
                                 isHasMatched={isHasMatched(medication, expandedField)}
                                searchTerm={searchTerm}
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