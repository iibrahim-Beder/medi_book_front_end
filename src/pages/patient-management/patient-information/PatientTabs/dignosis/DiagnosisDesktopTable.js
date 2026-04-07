import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import {DiagnosisModal, hasHiddenMatch} from "./diagnosisHelpers";
import { MdExpandMore } from "react-icons/md";
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
import { formatDate, truncateText } from "../../../../shared/utils";
import { useHiddenRightMatchObserver } from "../../../../../hooks/useRightMatchObserver";
import { useScrollToFirstMatch } from "../../../../../hooks/useScrollToFirstMatch";
import { isHasMatched } from "../component/helpers";
import PatientName from "../component/PatientName";

const DiagnosisTable = ({patientId}) => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedRow,
    expandedField,
    currentFilters,
    currentPage,
    diagnosesData,
    isLoading,
    isFetching,
    error,
    pageSize,
    searchTerm,
    currentData,

    // Modal states
    modalOpen,
    modalData,
    modalType,

    // Actions
    handleViewClick,
    handleCloseModal,
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,

    // Utilities
    transformDiagnosisData,
    transformPrescriptionData,
  } = useDiagnoses(patientId);

  const {
    diagnosedConditionsFields,
    notesFields,
    prescriptionFields,
    prescriptionRecipeFields,
    translateTableHeaders,
    translateEmptyStates,
  } = diagnosisHelpers(t);

  const tableHeaders = translateTableHeaders();
  const emptyStates = translateEmptyStates();
  const tableWrapperRef = React.useRef(null);

useScrollToFirstMatch({
  currentData,
  searchTerm,
  FIELD_KEY_MAP: null,
  hasHiddenMatch,
  handleViewClick,
});

useHiddenRightMatchObserver({ tableWrapperRef, currentData, searchTerm });
  return (
    <div className="table-container">
          <DiagnosisModal
          searchTerm={searchTerm}
        show={modalOpen}
        onHide={handleCloseModal}
        type={modalType}
        data={modalData}
        formFields={
          modalType === 'diagnosedConditions' ? diagnosedConditionsFields :
          modalType === 'notes' ? notesFields :
          prescriptionFields
        }
        formFieldsRecipe={
          modalType === 'prescription' ? prescriptionRecipeFields : undefined
        }
      />
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('Diagnosis')}</h3>
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
              filterType={currentFilters.diagnosisType}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, diagnosisType: value }))}
              filterDateFrom={currentFilters.fromDate}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
              filterDateTo={currentFilters.toDate}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData || []}
              showFilterDropdown={false}
            />
          </div>

          {/* Data Table */}
          <div ref={tableWrapperRef} style={{ overflow: "auto" }}>
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
                ) : currentData && currentData.length > 0 ? (
                  currentData.map((diagnosis) => {
                    const transformedDiagnosis = transformDiagnosisData(diagnosis);
                    
                    return (
                      <React.Fragment key={transformedDiagnosis.id}>
                        <tr>
                          <td data-has-match={isHasMatched(transformedDiagnosis, "DiagnosisName")? "true": undefined}>
                              <HighlightText
                              text={truncateText(transformedDiagnosis.diagnosisName, 50)}
                                searchTerm={searchTerm}
                                matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                                fieldName="DiagnosisName"
                              />
                             { transformedDiagnosis.diagnosisName && 
                               transformedDiagnosis.diagnosisName.length > 50 && (
                                <Button
                                  className={` ${hasHiddenMatch(transformedDiagnosis, "DiagnosisName", transformedDiagnosis.diagnosisName, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                                  size="sm"
                                  style={{
                                    backgroundColor: "transparent",
                                    padding: 0,
                                    fontSize: "19px",
                                    height: "20px",
                                  }}
                                  onClick={() =>
                                    handleViewClick(
                                      transformedDiagnosis.id,
                                      "diagnosisName"
                                    )
                                  }
                                >
                                  <MdExpandMore
                                    style={{
                                      transform:
                                        expandedRow === transformedDiagnosis.id &&
                                        expandedField === "diagnosisName"
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}
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
                                // style={{ maxWidth: "200px" }}
                                title={transformedDiagnosis.symptomsDescription}
                                data-has-match={isHasMatched(transformedDiagnosis, "SymptomsDescription")? "true": undefined}
                                
                              >
                            <HighlightText
                              text={truncateText(transformedDiagnosis.symptomsDescription, 50)}
                              searchTerm={searchTerm}
                              matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                              fieldName="SymptomsDescription"
                            />
                                
                              </span>
                              {transformedDiagnosis.symptomsDescription && 
                               transformedDiagnosis.symptomsDescription.length > 50 && (
                                <Button
                                  className={` ${hasHiddenMatch(transformedDiagnosis, "SymptomsDescription", transformedDiagnosis.symptomsDescription, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                                  size="sm"
                                  style={{
                                    backgroundColor: "transparent",
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
                                  // style={{ maxWidth: "250px" }}
                                  title={transformedDiagnosis.diagnosisDescription}
                                  data-has-match={isHasMatched(transformedDiagnosis, "Description")? "true": undefined}
                                >
                                  <HighlightText
                                    text={truncateText(transformedDiagnosis.diagnosisDescription, 50)}
                                    searchTerm={searchTerm}
                                    matchedFields={diagnosis.highlightInfo?.matchedFields || []}
                                    fieldName="Description"
                                  />
                                </span>
                                {transformedDiagnosis.diagnosisDescription && 
                                 transformedDiagnosis.diagnosisDescription.length > 50 && (
                                  <Button
                                   data-right-has-match={isHasMatched(transformedDiagnosis, "Description")? "true": undefined}
                                    style={{
                                      backgroundColor: "transparent",
                                      padding: 0,
                                      fontSize: "19px",
                                      height: "20px",
                                    }}
                                  className={` ${hasHiddenMatch(transformedDiagnosis, "Description", transformedDiagnosis.diagnosisDescription, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
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
                                         ( expandedField === "diagnosisDescription" || expandedField === "description")
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
                            data-has-match={transformedDiagnosis.hasConditionMatch? "true": undefined}
                            data-right-has-match={transformedDiagnosis.hasConditionMatch? "true": undefined}
                              className="view-btn"
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                handleViewClick(transformedDiagnosis.id, "diagnosedConditions")
                              }
                              disabled={transformedDiagnosis.diagnosedConditions.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.diagnosedConditions.length > 0 && (
                              <span className={`num-item ${transformedDiagnosis.hasConditionMatch ? "has-match pulse" :""}`}>
                                  {transformedDiagnosis.diagnosedConditions.length}
                                </span>
                              )}
                            </Button>
                          </td>
                            
                          {/* Notes - Button opens modal */}
                          <td>
                            <Button
                            data-has-match={transformedDiagnosis.hasNoteMatch? "true": undefined}
                            data-right-has-match={transformedDiagnosis.hasNoteMatch? "true": undefined}
                              className="view-btn"
                              size="sm"
                              variant="outline-primary"
                              onClick={() => 
                                handleViewClick(transformedDiagnosis.id, "notes")
                              }
                              disabled={transformedDiagnosis.notes.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.notes.length > 0 && (
                              <span className={`num-item ${transformedDiagnosis.hasNoteMatch ? "has-match pulse" :""}`}>
                                  {transformedDiagnosis.notes.length}
                                </span>
                              )}
                            </Button>
                          </td>
                            
                          {/* Prescription - Button opens modal */}
                          <td>
                            <Button
                            data-has-match={transformedDiagnosis.hasPrescriptionMatch || transformedDiagnosis.hasMedicationMatch? "true": undefined}
                            data-right-has-match={transformedDiagnosis.hasPrescriptionMatch || transformedDiagnosis.hasMedicationMatch? "true": undefined}
                              className="view-btn"
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                handleViewClick(transformedDiagnosis.id, "prescription")
                              }
                              disabled={transformedDiagnosis.prescription.length === 0}
                            >
                              {t('View')}
                              {transformedDiagnosis.prescription.length > 0 && (
                              <span className={`num-item ${transformedDiagnosis.hasPrescriptionMatch ||transformedDiagnosis.hasMedicationMatch? "has-match pulse" :""}`}>
                                  {transformedDiagnosis.prescription.length}
                                </span>
                              )}
                            </Button>
                          </td>
                            
                          <td>
                            {formatDate(transformedDiagnosis.createdAt)}
                          </td>
                        </tr>
                            
                        {/* Expanded row content ـ symptomsDescription  ـ diagnosisDescription - diagnosisName */}
                        {expandedRow === transformedDiagnosis.id && 
                         (expandedField === "symptomsDescription" || expandedField === "diagnosisDescription"|| expandedField === "diagnosisName" || expandedField === "description") && (
                          <tr className="table-active-content">
                            <td colSpan="8">
                              <div className="accordion-in-table">
                                {expandedField === "symptomsDescription" && (
                                  <div className="description-expanded-section">
                                    <TextAreaField
                                      label={t('Symptoms Description')}
                                      value={transformedDiagnosis.symptomsDescription}
                                      type="textarea"
                                      disabled
                                       isHasMatched={isHasMatched(transformedDiagnosis, "SymptomsDescription")}
                                       searchTerm={searchTerm}
                                    />
                                  </div>
                                )}
        
                                {(expandedField === "diagnosisDescription" || expandedField === "description") && (
                                  <div className="description-expanded-section">
                                    <TextAreaField
                                      label={t('Diagnosis Description')}
                                      value={transformedDiagnosis.diagnosisDescription}
                                      type="textarea"
                                      disabled
                                       isHasMatched={isHasMatched(transformedDiagnosis, "Description")}
                                       searchTerm={searchTerm}
                                    />
                                  </div>
                                )}
                                {expandedField === "diagnosisName" && (
                                  <div className="description-expanded-section">
                                    <TextAreaField
                                      label={t('Diagnosis Name')}
                                      value={transformedDiagnosis.diagnosisName}
                                      type="textarea"
                                      disabled
                                      isHasMatched={isHasMatched(transformedDiagnosis, "DiagnosisName")}
                                      searchTerm={searchTerm}
                                    />
                                  </div>
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
                      {emptyStates.noResults(searchTerm)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {diagnosesData && currentData && currentData.length > 0 && (
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