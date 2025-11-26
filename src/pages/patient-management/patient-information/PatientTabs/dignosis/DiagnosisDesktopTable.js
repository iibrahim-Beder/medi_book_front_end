// DiagnosisTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import TwoLevelAccordion from "../../../../shared/TwoLevelAccordion";
import { MdExpandMore } from "react-icons/md";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import "../../../Patient-management.css";
import { useGetPatientDiagnosesQuery } from "../../../../../api/patientDiagnosesApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../shared/ErrorLoading";

const DiagnosisTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    diagnosisType: "",
    dateFrom: null,
    dateTo: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...currentFilters,
      dateFrom: formatDateForAPI(currentFilters.dateFrom),
      dateTo: formatDateForAPI(currentFilters.dateTo),
    };

    // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    console.log('Diagnosis API Filters:', apiFilters);

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [currentFilters, currentPage]); 

  const {
    data: diagnosesData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientDiagnosesQuery(queryArgs);

  // Handle expand/collapse for row fields
  const handleViewClick = (id, field) => {
    if (expandedRow === id && expandedField === field) {
      setExpandedRow(null);
      setExpandedField(null);
    } else {
      setExpandedRow(id);
      setExpandedField(field);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); 
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      diagnosisType: "",
      dateFrom: null,
      dateTo: null
    };
    setCurrentFilters(resetFilters);
    setCurrentPage(1);
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Transform API data to match component structure
  const transformDiagnosisData = (diagnosis) => {
    return {
      id: diagnosis.diagnosisId,
      diagnosisName: diagnosis.diagnosisName,
      code: diagnosis.code,
      symptomsDescription: diagnosis.symptomsDescription,
      diagnosisDescription: diagnosis.description,
      diagnosedConditions: diagnosis.patientInternalMedicalConditionLinkOverViews || [],
      notes: diagnosis.diagnosisNoteOverviews || [],
      prescription: diagnosis.prescriptionOverviews || [],
      createdAt: diagnosis.createdAt
    };
  };

  // Transform prescription data for TwoLevelAccordion
  const transformPrescriptionData = (prescriptions) => {
    return prescriptions.map(prescription => ({
      id: prescription.id,
      title: prescription.title || "Prescription",
      status: prescription.status,
      note: prescription.notes,
      isExpanded: false,
      recipes: prescription.prescribedMedications?.map(med => ({
        type: "medication",
        medication: med.medicationName,
        dosage: med.dosage,
        durationInDays: med.durationInDays,
        instructions: med.instructions,
        createdAt: med.createdAt
      })) || []
    }));
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    const statusMap = {
      0: "Active",
      1: "Completed", 
      2: "Cancelled",
      3: "Pending"
    };
    return statusMap[status] || "Unknown";
  };

  // Diagnosis types for filters
  const diagnosisTypes = [
    { key: "Type 2 Diabetes Mellitus", label: "Type 2 Diabetes Mellitus" },
    { key: "Test", label: "Test" }
  ];

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
              filterConfigs={[
                {
                  name: "diagnosisType",
                  label: "Diagnosis Type",
                  data: diagnosisTypes,
                },
              ]}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t('Diagnosis Name')}</th>
                  <th>{t('Code')}</th>
                  <th>{t('Symptoms Description')}</th>
                  <th>{t('Diagnosis Description')}</th>
                  <th>{t('Conditions')}</th>
                  <th>{t('Notes')}</th>
                  <th>{t('Prescriptions')}</th>
                  <th>{t('Created At')}</th>
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
                            <strong>{transformedDiagnosis.diagnosisName}</strong>
                          </td>
                          
                          <td>
                            {transformedDiagnosis.code}
                          </td>

                          {/* Symptoms Description with expand/collapse */}
                          <td>
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                                title={transformedDiagnosis.symptomsDescription}
                              >
                                {truncateText(transformedDiagnosis.symptomsDescription, 50)}
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
                            </div>
                          </td>

                          {/* Diagnosis Description with expand/collapse */}
                          <td>
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "250px" }}
                                title={transformedDiagnosis.diagnosisDescription}
                              >
                                {truncateText(transformedDiagnosis.diagnosisDescription, 60)}
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
                                    <Field
                                      label={t('Symptoms Description')}
                                      value={transformedDiagnosis.symptomsDescription}
                                      type="textarea"
                                      disabled
                                    />
                                  </div>
                                )}

                                {expandedField === "diagnosisDescription" && (
                                  <div className="description-expanded-section">
                                    <Field
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
                                    formFields={[
                                      {
                                        name: "MedicalCondition",
                                        placeholder: t('Condition Type'),
                                        half: true,
                                        label: t('Medical Condition'),
                                      },
                                      {
                                        name: "Severity",
                                        placeholder: t('Severity'),
                                        half: true,
                                        label: t('Severity'),
                                      },
                                      {
                                        name: "note",
                                        type: "textarea",
                                        placeholder: t('Note Content'),
                                        label: t('Note'),
                                      },
                                    ]}
                                  />
                                )}

                                {expandedField === "notes" && (
                                  <CustomAccordion
                                    readOnly={true}
                                    backgroundColor="var(--scbccolor)"
                                    data={transformedDiagnosis.notes}
                                    formFields={[
                                      {
                                        name: "content",
                                        type: "textarea",
                                        placeholder: t('Note Content'),
                                        label: t('Note Content'),
                                      },
                                    ]}
                                  />
                                )}

                                {expandedField === "prescription" && (
                                  <TwoLevelAccordion
                                    readOnly={true}
                                    backgroundColor="var(--scbccolor)"
                                    titleBackgroundColor="var(--scbccolor)"
                                    data={transformedPrescriptions}
                                    formFields={[
                                      {
                                        name: "title",
                                        type: "text",
                                        placeholder: t('Prescription Title'),
                                        half: true,
                                        label: t('Prescription Title'),
                                      },
                                      {
                                        name: "status",
                                        placeholder: t('Status'),
                                        half: true,
                                        label: t('Status'),
                                      },
                                      {
                                        name: "note",
                                        type: "textarea",
                                        placeholder: t('Prescription Note'),
                                        label: t('Note'),
                                      },
                                    ]}
                                    formFieldsRecipe={[
                                      {
                                        name: "medication",
                                        placeholder: t('Medication'),
                                        label: t('Medication'),
                                      },
                                      {
                                        name: "dosage",
                                        placeholder: t('Dosage'),
                                        half: true,
                                        label: t('Dosage'),
                                      },
                                      {
                                        name: "durationInDays",
                                        type: "number",
                                        placeholder: t('Duration (Days)'),
                                        half: true,
                                        label: t('Duration (Days)'),
                                      },
                                      {
                                        name: "instructions",
                                        placeholder: t('Instructions'),
                                        type: "textarea",
                                        label: t('Instructions'),
                                      },
                                    ]}
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
                      {currentFilters.searchValue ?
                        `No results found for "${currentFilters.searchValue}"` :
                        'No diagnoses found'
                      }
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