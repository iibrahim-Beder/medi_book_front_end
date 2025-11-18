import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import ConditionsFilters from "./component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import Pagination from "../../../shared/Pagination";
import { useGetPrescribedMedicationQuery } from "../../../../api/prescribedMedicationApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../shared/HighlightText";
import "../../Patient-management.css";
import { formatDate } from "../../../shared/FormatDate";
import ErrorLoading from "../../../shared/ErrorLoading";

const PrescribedMedicationTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [expandedRow, setExpandedRow] = useState(null);
  
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    medicationId: "",
    medicationCategoryId: "",
    fromDate: null,
    toDate: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      fromDate: formatDateForAPI(currentFilters.fromDate),
      toDate: formatDateForAPI(currentFilters.toDate),
    };

    console.log('API Filters for Medication:', apiFilters);
    
    // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage, currentFilters]); 

  const {
    data: prescribedMedicationData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPrescribedMedicationQuery(queryArgs);

  console.log("Prescribed Medication Data:", prescribedMedicationData);

  const triggerRefetch = () => {
    refetch();
  };

  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      setAppliedFilters(filters);
      setCurrentFilters(filters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      medicationId: "",
      medicationCategoryId: "",
      fromDate: null,
      toDate: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  // Handle expand/collapse for instructions
  const handleInstructionsClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get matched fields for highlighting
  const getMatchedFields = (highlightInfo) => {
    if (!highlightInfo || !highlightInfo.matchedFields) return [];
    return highlightInfo.matchedFields.map(field => field.fieldName);
  };

  // Skeleton loading component for table rows
  const TableSkeleton = () => {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            <td><Skeleton width={120} height={20} /></td>
            <td><Skeleton width={80} height={20} /></td>
            <td><Skeleton width={60} height={20} /></td>
            <td>
              <div className="d-flex align-items-center">
                <Skeleton width={200} height={20} />
                <Skeleton width={20} height={20} className="ms-2" />
              </div>
            </td>
            <td><Skeleton width={150} height={20} /></td>
            <td><Skeleton width={120} height={20} /></td>
            <td><Skeleton width={100} height={20} /></td>
            <td><Skeleton width={100} height={20} /></td>
          </tr>
        ))}
      </>
    );
  };

  const currentData = prescribedMedicationData?.data || [];
  const totalItems = prescribedMedicationData?.totalCount || 0;
  const totalPages = prescribedMedicationData?.totalPages || 1;
  const searchTerm = appliedFilters.searchValue;

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
                  <th>{t("PrescribedMedicationTable.medication")}</th>
                  <th>{t("PrescribedMedicationTable.dosage")}</th>
                  <th>{t("PrescribedMedicationTable.duration")}</th>
                  <th>{t("PrescribedMedicationTable.instructions")}</th>
                  <th>{t("PrescribedMedicationTable.diagnosis_name")}</th>
                  <th>{t("PrescribedMedicationTable.prescribed_name")}</th>
                  <th>{t("PrescribedMedicationTable.category")}</th>
                  <th>{t("created_at")}</th>
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
                            matchedFields={getMatchedFields(medication.highlightInfo)}
                            fieldName="MedicationName"
                          />
                        </td>
                        <td title={medication.dosage}>
                          <HighlightText
                            text={medication.dosage}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(medication.highlightInfo)}
                            fieldName="Dosage"
                          />
                        </td>
                        <td title={`${medication.durationInDays} days`}>
                          {medication.durationInDays} {t('PrescribedMedicationTable.days')}
                        </td>

                        <td title={medication.instructions}>
                          <div className="d-flex align-items-center">
                            <span className="text-truncate" style={{ maxWidth: "250px" }}>
                              <HighlightText
                                text={truncateText(medication.instructions, 80)}
                                searchTerm={searchTerm}
                                matchedFields={getMatchedFields(medication.highlightInfo)}
                                fieldName="Instructions"
                              />
                            </span>
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
                              onClick={() => handleInstructionsClick(medication.id)}
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === medication.id
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                          </div>
                        </td>

                        <td title={medication.diagnosisName}>
                          <HighlightText
                            text={medication.diagnosisName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(medication.highlightInfo)}
                            fieldName="DiagnosisName"
                          />
                        </td>
                        <td title={medication.prescriptionName}>
                          <HighlightText
                            text={medication.prescriptionName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(medication.highlightInfo)}
                            fieldName="PrescriptionName"
                          />
                        </td>
                        <td title={medication.medicationCategoryName}>
                          {medication.medicationCategoryName}
                        </td>
                        <td title={medication.createdAt}>
                          {formatDate(medication.createdAt)}
                        </td>
                      </tr>

                      {/* Expanded row for Instructions */}
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
                                label={t("PrescribedMedicationTable.instructions")}
                                value={medication.instructions}
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
                      {appliedFilters.searchValue ?
                        t('PrescribedMedicationTable.no_results_for_search', { search: appliedFilters.searchValue }) :
                        t('PrescribedMedicationTable.no_records_found')
                      }
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