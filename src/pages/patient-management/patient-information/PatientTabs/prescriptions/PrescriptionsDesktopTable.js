import React from "react";
import { Table, Button } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import { MdExpandMore } from "react-icons/md";
import ConditionsFilters from "../component/ConditionsFilters";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../shared/HighlightText";
import ErrorLoading from "../../../../shared/ErrorLoading";
import "../../../Patient-management.css";
import { usePrescriptions } from "./usePrescriptions";
import { prescriptionsHelpers, TableSkeleton } from "./prescriptionsHelpers";
import { formatDate } from "../../../../shared/utils";

const PrescriptionsTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedRow,
    expandedField,
    currentFilters,
    appliedFilters,
    currentPage,
    prescriptionsData,
    isLoading,
    isFetching,
    error,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleViewClick,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields,
    transformMedicationData
  } = usePrescriptions(false);

  const {
    fieldMapping,
    tableHeaders,
    statusOptions,
    filterConfigs,
    medicationFields,
    emptyStates
  } = prescriptionsHelpers(t);

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("PrescriptionsTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("PrescriptionsTable.table_subtitle")}</h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterType={currentFilters.status}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, status: value }))}
              filterDateFrom={currentFilters.fromDate}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
              filterDateTo={currentFilters.toDate}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              filterConfigs={filterConfigs}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{tableHeaders.prescription_title}</th>
                  <th>{tableHeaders.note}</th>
                  <th>{tableHeaders.status}</th>
                  <th>{tableHeaders.diagnosis_name}</th>
                  <th>{tableHeaders.medication}</th>
                  <th>{tableHeaders.created_at}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  <TableSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((prescription) => (
                    <React.Fragment key={prescription.id}>
                      <tr>
                        <td title={prescription.title}>
                          <HighlightText
                            text={prescription.title}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(prescription.highlightInfo)}
                            fieldName={fieldMapping.title}
                          />
                        </td>

                        <td>
                          {prescription.notes ? (
                            
                          <div className="">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                              title={prescription.notes}
                            >
                              <HighlightText
                                text={truncateText(prescription.notes, 50)}
                                searchTerm={searchTerm}
                                matchedFields={getMatchedFields(prescription.highlightInfo)}
                                fieldName={fieldMapping.note}
                              />
                            </span>
                            {prescription.notes.length > 70 && (
                              
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
                                handleViewClick(prescription.id, "note")
                              }
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === prescription.id &&
                                    expandedField === "note"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                            )}
                          </div>
                          ):"-"}
                        </td>

                        <td>
                          <span
                            style={{
                              color: getStatusColor(prescription.status),
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {statusOptions[prescription.status] || prescription.status}
                          </span>
                        </td>

                        <td title={prescription.diagnosisName}>
                          <HighlightText
                            text={prescription.diagnosisName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(prescription.highlightInfo)}
                            fieldName={fieldMapping.diagnosisName}
                          />
                        </td>

                        <td>
                          <Button
                            className="view-btn"
                            size="sm"
                            variant={
                              expandedRow === prescription.id &&
                              expandedField === "prescribedMedication"
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() =>
                              handleViewClick(prescription.id, "prescribedMedication")
                            }
                            disabled={!prescription.prescribedMedications || prescription.prescribedMedications.length === 0}
                          >
                            {tableHeaders.view}
                            {prescription.prescribedMedications && prescription.prescribedMedications.length > 0 && (
                              <span
                                className="num-item"
                                style={{
                                  backgroundColor:
                                    expandedRow === prescription.id &&
                                    expandedField === "prescribedMedication"
                                      ? "#f8f9fa"
                                      : "transparent",
                                }}
                              >
                                {prescription.prescribedMedications.length}
                              </span>
                            )}
                          </Button>
                        </td>
                        <td>{formatDate(prescription.createdAt)}</td>
                      </tr>

                      {expandedRow === prescription.id && (
                        <tr
                          className="table-active-content"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <td
                            colSpan="5"
                            className="border-0 background-in-hover-none"
                          >
                            <div>
                              {expandedField === "note" && (
                                <div className="description-expanded-section">
                                  <TextAreaField
                                    label={t("PrescriptionsTable.prescription_note")}
                                    value={prescription.notes}
                                    disabled
                                  />
                                </div>
                              )}

                              {expandedField === "prescribedMedication" && prescription.prescribedMedications && (
                                <CustomAccordion
                                  readOnly={true}
                                  backgroundColor="var(--scbccolor)"
                                  data={transformMedicationData(prescription.prescribedMedications)}
                                  formFields={medicationFields}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      {emptyStates.noResults(appliedFilters.searchValue)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {prescriptionsData && prescriptionsData.data && prescriptionsData.data.length > 0 && (
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

export default PrescriptionsTable;