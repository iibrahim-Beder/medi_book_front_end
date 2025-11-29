import React from "react";
import { Table, Button } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import TwoLevelAccordion from "../../../../shared/TwoLevelAccordion";
import { MdExpandMore } from "react-icons/md";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import "../../../Patient-management.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../shared/ErrorLoading";
import HighlightText from "../../../../shared/HighlightText";
import { useDiagnoses } from "./useDiagnoses";
import { diagnosisHelpers } from "./diagnosisHelpers";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";

const DiagnosisTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    appliedFilters,
    expandedRow,
    expandedField,
    currentFilters,
    currentPage,
    diagnosesData,
    isLoading,
    isFetching,
    error,
    pageSize,
    
    // Actions
    handleViewClick,
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    truncateText,
    formatDate,
    transformDiagnosisData,
    transformPrescriptionData,
    getStatusText
  } = useDiagnoses();

  const {
    filterConfigs,
    diagnosedConditionsFields,
    notesFields,
    prescriptionFields,
    prescriptionRecipeFields,
    translateTableHeaders,
    translateEmptyStates
  } = diagnosisHelpers(t);

  const tableHeaders = translateTableHeaders();
  const emptyStates = translateEmptyStates();

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('Diagnosis')}</h3>
          <h6 className="table-subtitle">{t('Manage patient diagnoses and related information')}</h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterType={currentFilters.diagnosisType}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, diagnosisType: value }))}
              filterDateFrom={currentFilters.dateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, dateFrom: date }))}
              filterDateTo={currentFilters.dateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, dateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={diagnosesData?.data || []}
              filterConfigs={filterConfigs}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{tableHeaders.diagnosisName}</th>
                  <th>{tableHeaders.code}</th>
                  <th>{tableHeaders.symptomsDescription}</th>
                  <th>{tableHeaders.diagnosisDescription}</th>
                  <th>{tableHeaders.conditions}</th>
                  <th>{tableHeaders.notes}</th>
                  <th>{tableHeaders.prescriptions}</th>
                  <th>{tableHeaders.createdAt}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={200} height={15} /></td>
                      <td><Skeleton width={200} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : diagnosesData?.data && diagnosesData.data.length > 0 ? (
                  diagnosesData.data.map((diagnosis) => {
                    const transformedDiagnosis = transformDiagnosisData(diagnosis);
                    const transformedPrescriptions = transformPrescriptionData(transformedDiagnosis.prescription);
                    
                    return (
                      <React.Fragment key={transformedDiagnosis.id}>
                        <tr>
                          <td>
                            <strong>
                              <HighlightText
                                text={transformedDiagnosis.diagnosisName}
                                searchTerm={diagnosesData.searchTerm}
                                matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                                fieldName="DiagnosisName"
                              />
                            </strong>
                          </td>
                          
                          <td>
                            {transformedDiagnosis.code}
                          </td>

                          {/* Symptoms Description with expand/collapse */}
                          <td>
                            {diagnosis.symptomsDescription ? (                                     
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                                title={transformedDiagnosis.symptomsDescription}
                              >
                                    <HighlightText
                              text={truncateText(transformedDiagnosis.symptomsDescription, 50)}
                              searchTerm={diagnosesData.searchTerm}
                              matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                              fieldName="SymptomsDescription"
                            />
                                
                              </span>
                              {transformedDiagnosis.symptomsDescription && 
                               transformedDiagnosis.symptomsDescription.length > 50 && (
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
                                    handleViewClick(
                                      transformedDiagnosis.id,
                                      "symptomsDescription"
                                    )
                                  }
                                >
                                  <MdExpandMore
                                    style={{
                                      transform:
                                        expandedRow === transformedDiagnosis.id &&
                                        expandedField === "symptomsDescription"
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}
                            </div>):("-")}
                          </td>
                          {/* Diagnosis Description with expand/collapse */}
                         <td>
                            {diagnosis.description ? (
                              <div className="d-flex align-items-center">
                                <span
                                  className="text-truncate"
                                  style={{ maxWidth: "250px" }}
                                  title={transformedDiagnosis.diagnosisDescription}
                                >
                                  <HighlightText
                                    text={truncateText(transformedDiagnosis.diagnosisDescription, 60)}
                                    searchTerm={diagnosesData.searchTerm}
                                    matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                                    fieldName="DiagnosisDescription"
                                  />
                                </span>
                                {transformedDiagnosis.diagnosisDescription && 
                                 transformedDiagnosis.diagnosisDescription.length > 60 && (
                                  <Button
                                    style={{
                                      backgroundColor: "transparent",
                                      color: "#278fff",
                                      padding: 0,
                                      fontSize: "19px",
                                      height: "20px",
                                    }}
                                    className="view-btn ms-2"
                                    size="sm"
                                    onClick={() =>
                                      handleViewClick(
                                        transformedDiagnosis.id,
                                        "diagnosisDescription"
                                      )
                                    }
                                  >
                                    <MdExpandMore
                                      style={{
                                        transform:
                                          expandedRow === transformedDiagnosis.id &&
                                          expandedField === "diagnosisDescription"
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        transition: "transform 0.3s ease",
                                      }}
                                    />
                                  </Button>
                                )}
                              </div>
                            ) : ("-")}
                          </td>
                          {/* Diagnosed Conditions - Read Only Accordion */}
                          <td>
                            <Button
                              className="view-btn"
                              size="sm"
                              variant={
                                expandedRow === transformedDiagnosis.id &&
                                expandedField === "diagnosedConditions"
                                  ? "primary"
                                  : "outline-primary"
                              }
                              onClick={() =>
                                handleViewClick(transformedDiagnosis.id, "diagnosedConditions")
                              }
                              disabled={transformedDiagnosis.diagnosedConditions.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.diagnosedConditions.length > 0 && (
                                <span
                                  className="num-item"
                                  style={{
                                    backgroundColor:
                                      expandedRow === transformedDiagnosis.id &&
                                      expandedField === "diagnosedConditions"
                                        ? "#f8f9fa"
                                        : "transparent",
                                  }}
                                >
                                  {transformedDiagnosis.diagnosedConditions.length}
                                </span>
                              )}
                            </Button>
                          </td>

                          {/* Notes - Read Only Accordion */}
                          <td>
                            <Button
                              className="view-btn"
                              size="sm"
                              variant={
                                expandedRow === transformedDiagnosis.id &&
                                expandedField === "notes"
                                  ? "primary"
                                  : "outline-primary"
                              }
                              onClick={() => handleViewClick(transformedDiagnosis.id, "notes")}
                              disabled={transformedDiagnosis.notes.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.notes.length > 0 && (
                                <span
                                  className="num-item"
                                  style={{
                                    backgroundColor:
                                      expandedRow === transformedDiagnosis.id &&
                                      expandedField === "notes"
                                        ? "#f8f9fa"
                                        : "transparent",
                                  }}
                                >
                                  {transformedDiagnosis.notes.length}
                                </span>
                              )}
                            </Button>
                          </td>

                          {/* Prescription - TwoLevelAccordion (Read Only) */}
                          <td>
                            <Button
                              className="view-btn"
                              size="sm"
                              variant={
                                expandedRow === transformedDiagnosis.id &&
                                expandedField === "prescription"
                                  ? "primary"
                                  : "outline-primary"
                              }
                              onClick={() =>
                                handleViewClick(transformedDiagnosis.id, "prescription")
                              }
                              disabled={transformedDiagnosis.prescription.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.prescription.length > 0 && (
                                <span
                                  className="num-item"
                                  style={{
                                    backgroundColor:
                                      expandedRow === transformedDiagnosis.id &&
                                      expandedField === "prescription"
                                        ? "#f8f9fa"
                                        : "transparent",
                                  }}
                                >
                                  {transformedDiagnosis.prescription.length}
                                </span>
                              )}
                            </Button>
                          </td>

                          <td>
                            {formatDate(transformedDiagnosis.createdAt)}
                          </td>
                        </tr>

                        {/* Expanded row content */}
                        {expandedRow === transformedDiagnosis.id && (
                          <tr
                            className="table-active-content"
                            style={{ backgroundColor: "transparent" }}
                          >
                            <td
                              colSpan="8"
                              className="border-0 background-in-hover-none"
                            >
                              <div className="accordion-in-table">
                                {expandedField === "symptomsDescription" && (
                                  <div className="description-expanded-section">
                                    <TextAreaField
                                      label={t('Symptoms Description')}
                                      value={transformedDiagnosis.symptomsDescription}
                                      type="textarea"
                                      disabled
                                    />
                                  </div>
                                )}

                                {expandedField === "diagnosisDescription" && (
                                  <div className="description-expanded-section">
                                    <TextAreaField
                                      label={t('Diagnosis Description')}
                                      value={transformedDiagnosis.diagnosisDescription}
                                      type="textarea"
                                      disabled
                                    />
                                  </div>
                                )}

                                {expandedField === "diagnosedConditions" && (
                                  <CustomAccordion
                                    readOnly={true}
                                    backgroundColor="var(--scbccolor)"
                                    data={transformedDiagnosis.diagnosedConditions}
                                    formFields={diagnosedConditionsFields}
                                  />
                                )}

                                {expandedField === "notes" && (
                                  <CustomAccordion
                                    readOnly={true}
                                    backgroundColor="var(--scbccolor)"
                                    data={transformedDiagnosis.notes}
                                    formFields={notesFields}
                                  />
                                )}

                                {expandedField === "prescription" && (
                                  <TwoLevelAccordion
                                    readOnly={true}
                                    backgroundColor="var(--scbccolor)"
                                    titleBackgroundColor="var(--scbccolor)"
                                    data={transformedPrescriptions}
                                    formFields={prescriptionFields}
                                    formFieldsRecipe={prescriptionRecipeFields}
                                  />
                                )}
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
                      {emptyStates.noResults(currentFilters.searchValue)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {diagnosesData && diagnosesData.data && diagnosesData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={diagnosesData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={diagnosesData.totalPages || 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTable;