// PatientMedicalConditionsTable.jsx
import React, { useState, useMemo } from "react";
import { Table, Button, Card, Badge } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../shared/Pagination";
import "../../Patient-management.css";
import { 
  useGetPatientMedicalConditionsQuery, 
  useDeletePatientMedicalConditionMutation,
  useGetAvailableMedicalConditionsQuery 
} from "../../../../api/patientMedicalConditionsApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../shared/ErrorLoading";
import MedicalConditionModal from "../../../shared/DynamicEditModal";
import PopupMessage from "../../../shared/PopupMessage";
import toast from "react-hot-toast";

const PatientMedicalConditionsTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [expandedRow, setExpandedRow] = useState(null);
  
  // Filters states
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    severity: "",
    conditionType: "",
    isActive: "",
    dateFrom: null,
    dateTo: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [conditionToDelete, setConditionToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // RTK Query
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

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [currentFilters, currentPage]);

  const {
    data: conditionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientMedicalConditionsQuery(queryArgs);

  const { data: availableConditions } = useGetAvailableMedicalConditionsQuery();

  const [deleteCondition, { isLoading: isDeleting }] = useDeletePatientMedicalConditionMutation();

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      severity: "",
      conditionType: "",
      isActive: "",
      dateFrom: null,
      dateTo: null
    };
    setCurrentFilters(resetFilters);
    setCurrentPage(1);
  };

  // Handle Add New
  const handleAddNew = () => {
    setSelectedCondition({
      medicalConditionId: "",
      severity: "Mild",
      isActive: true,
      notes: ""
    });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (condition) => {
    setSelectedCondition({ ...condition });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (condition) => {
    setConditionToDelete(condition);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!conditionToDelete) return;
    
    try {
      const res = await deleteCondition(conditionToDelete.id).unwrap();
      if (res?.succeeded) {
        toast.success(res.message || "Medical condition deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Failed to delete medical condition");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Error deleting medical condition");
    }
    
    setConditionToDelete(null);
  };

  // Close Popup
  const handleClosePopup = () => {
    setConditionToDelete(null);
  };

  const handleExpandClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
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

  // Get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Mild": return "success";
      case "Moderate": return "warning";
      case "Severe": return "danger";
      default: return "secondary";
    }
  };

  // Get status badge color
  const getStatusColor = (isActive) => {
    return isActive ? "success" : "secondary";
  };

  // Severity options for filters
  const severityOptions = [
    { key: "Mild", label: t("Mild") },
    { key: "Moderate", label: t("Moderate") },
    { key: "Severe", label: t("Severe") }
  ];

  // Condition type options for filters
  const conditionTypeOptions = [
    { key: "Internal", label: t("Internal") },
    { key: "External", label: t("External") }
  ];

  // Status options for filters
  const statusOptions = [
    { key: "true", label: t("Active") },
    { key: "false", label: t("Inactive") }
  ];

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Medical Conditions")}</h3>
          <h6 className="table-subtitle">{t("Manage patient medical conditions and history")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("Add New Condition")}
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
              filterType={currentFilters.severity}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, severity: value }))}
              filterDateFrom={currentFilters.dateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, dateFrom: date }))}
              filterDateTo={currentFilters.dateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, dateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={conditionsData?.data || []}
              filterConfigs={[
                {
                  name: "severity",
                  label: "Severity",
                  data: severityOptions,
                },
                {
                  name: "conditionType",
                  label: "Condition Type",
                  data: conditionTypeOptions,
                },
                {
                  name: "isActive",
                  label: "Status",
                  data: statusOptions,
                },
              ]}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("Condition Name")}</th>
                  <th>{t("Category")}</th>
                  <th>{t("Severity")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Notes")}</th>
                  <th>{t("Created At")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={120} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={60} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={200} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">
                      <ErrorLoading isError={error} refetch={refetch} />
                    </td>
                  </tr>
                ) : conditionsData?.data && conditionsData.data.length > 0 ? (
                  conditionsData.data.map((condition) => (
                    <React.Fragment key={condition.id}>
                      <tr>
                        <td>
                          <strong>{condition.medicalConditionName}</strong>
                        </td>
                        
                        <td>
                          {condition.categoryName || "-"}
                        </td>

                        <td>
                          <Badge bg={getSeverityColor(condition.severity)}>
                            {condition.severity}
                          </Badge>
                        </td>

                        <td>
                          <Badge bg={getStatusColor(condition.isActive)}>
                            {condition.isActive ? t("Active") : t("Inactive")}
                          </Badge>
                        </td>

                        <td>
                          <Badge bg="info">
                            {condition.conditionType}
                          </Badge>
                        </td>

                        {/* Notes with expand/collapse */}
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                              title={condition.notes}
                            >
                              {truncateText(condition.notes, 50)}
                            </span>
                            {condition.notes && condition.notes.length > 50 && (
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
                                    transform: expandedRow === condition.id ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              </Button>
                            )}
                          </div>
                        </td>

                        <td>
                          {formatDate(condition.createdAt)}
                        </td>

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
                            <Button
                              className="view-btn"
                              variant=""
                              size="sm"
                              style={{ color: "#dc3545", backgroundColor: "transparent" }}
                              onClick={() => handleDeleteClick(condition)}
                            >
                              {t("Delete")}
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for Notes */}
                      {expandedRow === condition.id && condition.notes && condition.notes.length > 50 && (
                        <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                          <td colSpan="8" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section p-3">
                              <Card>
                                <Card.Body>
                                  <h6>{t("Notes")}</h6>
                                  <p className="mb-0">{condition.notes}</p>
                                </Card.Body>
                              </Card>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      {currentFilters.searchValue ?
                        t('No results found for search', { search: currentFilters.searchValue }) :
                        t('No medical conditions found')
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {conditionsData && conditionsData.data && conditionsData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={conditionsData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={conditionsData.totalPages || 1}
            />
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <MedicalConditionModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCondition(null);
        }}
        onSave={() => {
          setShowModal(false);
          setSelectedCondition(null);
          refetch();
        }}
        condition={selectedCondition}
        isEdit={!isAddMode}
        availableConditions={availableConditions?.data || []}
      />

      {/* Delete Confirmation Popup */}
      {conditionToDelete && (
        <PopupMessage
          type="danger"
          title={t('Confirm Delete')}
          message={t('Are you sure you want to delete medical condition') + ` "${conditionToDelete.medicalConditionName}"?`}
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

export default PatientMedicalConditionsTable;