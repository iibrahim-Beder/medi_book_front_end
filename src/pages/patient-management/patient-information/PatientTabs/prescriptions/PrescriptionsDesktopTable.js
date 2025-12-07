import React from "react";
import { Table, Button } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import ConditionsFilters from "../component/ConditionsFilters";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../shared/HighlightText";
import ErrorLoading from "../../../../shared/ErrorLoading";
import { usePrescriptions } from "./usePrescriptions";
import { prescriptionsHelpers, PrescriptionsModal, TableSkeleton } from "./prescriptionsHelpers";
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
    
    // Modal states
    modalOpen,
    modalData,
    modalType,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleViewClick,
    handleCloseModal,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields,
  } = usePrescriptions(false);

  const {
    fieldMapping,
    tableHeaders,
    statusOptions,
    filterConfigs,
    medicationFields,
    emptyStates,
  } = prescriptionsHelpers(t);
  console.log("PrescriptionsTable", prescriptionsData);

  return (
    <div className="table-container">
      {/* Modal Component */}
      <PrescriptionsModal
        show={modalOpen}
        onHide={handleCloseModal}
        type={modalType}
        data={modalData}
        formFields={medicationFields}
      />

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
                    <td colSpan="6" className="text-center text-danger">
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
                        {/* Prescription Title */}
                        <td title={prescription.title}>
                          <HighlightText
                            text={truncateText(prescription.title, 50)}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(prescription.highlightInfo)}
                            fieldName={fieldMapping.title}
                          />
                           {prescription.title.length > 50 && (
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
                                    handleViewClick(prescription.id, "title")
                                  }
                                >
                                  <MdExpandMore
                                    style={{
                                      transform:
                                        expandedRow === prescription.id &&
                                        expandedField === "title"
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}
                        </td>

                        {/* Notes - Expandable in table */}
                        <td>
                          {prescription.notes ? (
                            <div className="d-flex align-items-center">
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
                              {prescription.notes.length > 50 && (
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
                          ) : "-"}
                        </td>

                        {/* Status */}
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

                        {/* Diagnosis Name - Expandable in table */}
                        <td>
                          {prescription.diagnosisName ? (
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                                title={prescription.diagnosisName}
                              >
                                <HighlightText
                                  text={truncateText(prescription.diagnosisName, 50)}
                                  searchTerm={searchTerm}
                                  matchedFields={getMatchedFields(prescription.highlightInfo)}
                                  fieldName={fieldMapping.diagnosisName}
                                />
                              </span>
                              {prescription.diagnosisName.length > 50 && (
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
                                    handleViewClick(prescription.id, "diagnosisName")
                                  }
                                >
                                  <MdExpandMore
                                    style={{
                                      transform:
                                        expandedRow === prescription.id &&
                                        expandedField === "diagnosisName"
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}
                            </div>
                          ) : "-"}
                        </td>

                        {/* Medications - Opens Modal */}
                        <td>
                          <Button
                            className="view-btn"
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              handleViewClick(prescription.id, "prescribedMedication")
                            }
                            disabled={!prescription.prescribedMedications || prescription.prescribedMedications.length === 0}
                          >
                            {tableHeaders.view}
                            {prescription.prescribedMedications && prescription.prescribedMedications.length > 0 && (
                              <span className="num-item">
                                {prescription.prescribedMedications.length}
                              </span>
                            )}
                          </Button>
                        </td>
                        
                        <td>{formatDate(prescription.createdAt)}</td>
                      </tr>

                      {/* Expanded row content for Note and Diagnosis Name */}
                      {expandedRow === prescription.id && 
                       (expandedField === "note" || expandedField === "diagnosisName" || expandedField === "title" ) && (
                        <tr className="table-active-content">
                          <td colSpan="6">
                            <div className="accordion-in-table">
                              {expandedField === "note" && (
                                <div className="description-expanded-section">
                                  <TextAreaField
                                    label={t("PrescriptionsTable.prescription_note")}
                                    value={prescription.notes}
                                    disabled
                                  />
                                </div>
                              )}

                              {expandedField === "diagnosisName" && (
                                <div className="description-expanded-section">
                                  <TextAreaField
                                    label={t("PrescriptionsTable.diagnosis_name")}
                                    value={prescription.diagnosisName}
                                    disabled
                                  />
                                </div>
                              )}
                              {expandedField === "title" && (
                                <div className="description-expanded-section">
                                  <TextAreaField
                                    label={t("PrescriptionsTable.prescription_title")}
                                    value={prescription.title}
                                    disabled
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
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