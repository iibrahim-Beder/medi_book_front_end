import React, { useState, useMemo } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../shared/Pagination";
import "../../Patient-management.css";
import { useGetPatientPrescriptionsQuery, useDeletePatientPrescriptionMutation } from "../../../../api/patientPrescriptionApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../shared/ErrorLoading";
import DaynamicEditModal from "../../../shared/DynamicEditModal";
import PopupMessage from "../../../shared/PopupMessage";
import toast from "react-hot-toast";

const PatientPrescriptionTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [expandedRow, setExpandedRow] = useState(null);
  
  // Filters states
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    status: "",
    dateFrom: null,
    dateTo: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
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
    data: prescriptionsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientPrescriptionsQuery(queryArgs);

  const [deletePrescription, { isLoading: isDeleting }] = useDeletePatientPrescriptionMutation();

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      status: "",
      dateFrom: null,
      dateTo: null
    };
    setCurrentFilters(resetFilters);
    setCurrentPage(1);
  };

  // Handle Add New
  const handleAddNew = () => {
    setSelectedPrescription({
      title: "",
      notes: "",
      status: "Active",
      prescribedMedications: []
    });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (prescription) => {
    setSelectedPrescription({ ...prescription });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (prescription) => {
    setPrescriptionToDelete(prescription);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!prescriptionToDelete) return;
    
    try {
      const res = await deletePrescription(prescriptionToDelete.id).unwrap();
      if (res?.succeeded) {
        toast.success(res.message || "Prescription deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Failed to delete prescription");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Error deleting prescription");
    }
    
    setPrescriptionToDelete(null);
  };

  // Close Popup
  const handleClosePopup = () => {
    setPrescriptionToDelete(null);
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

  // Status options for filters
  const statusOptions = [
    { key: "Active", label: t("Active") },
    { key: "Completed", label: t("Completed") },
    { key: "Cancelled", label: t("Cancelled") },
    { key: "Pending", label: t("Pending") },
    { key: "Expired", label: t("Expired") }
  ];

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Prescriptions")}</h3>
          <h6 className="table-subtitle">{t("Manage patient prescriptions and medications")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("Add New Prescription")}
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
              filterType={currentFilters.status}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, status: value }))}
              filterDateFrom={currentFilters.dateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, dateFrom: date }))}
              filterDateTo={currentFilters.dateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, dateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={prescriptionsData?.data || []}
              filterConfigs={[
                {
                  name: "status",
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
                  <th>{t("Title")}</th>
                  <th>{t("Diagnosis")}</th>
                  <th>{t("Notes")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Medications")}</th>
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
                      <td><Skeleton width={200} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={60} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center text-danger">
                      <ErrorLoading isError={error} refetch={refetch} />
                    </td>
                  </tr>
                ) : prescriptionsData?.data && prescriptionsData.data.length > 0 ? (
                  prescriptionsData.data.map((prescription) => (
                    <React.Fragment key={prescription.id}>
                      <tr>
                        <td>
                          <strong>{prescription.title}</strong>
                        </td>
                        
                        <td>
                          {prescription.diagnosisName || "-"}
                        </td>

                        {/* Notes with expand/collapse */}
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                              title={prescription.notes}
                            >
                              {truncateText(prescription.notes, 50)}
                            </span>
                            {prescription.notes && prescription.notes.length > 50 && (
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
                                onClick={() => handleExpandClick(prescription.id)}
                              >
                                <MdExpandMore
                                  style={{
                                    transform: expandedRow === prescription.id ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              </Button>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              prescription.status === "Active" ? "bg-success" :
                              prescription.status === "Completed" ? "bg-primary" :
                              prescription.status === "Cancelled" ? "bg-danger" :
                              prescription.status === "Pending" ? "bg-warning" : "bg-secondary"
                            }`}
                          >
                            {prescription.status}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-info">
                            {prescription.prescribedMedications?.length || 0}
                          </span>
                        </td>

                        <td>
                          {formatDate(prescription.createdAt)}
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              className="view-btn"
                              variant=""
                              size="sm"
                              style={{ color: "#007bff", backgroundColor: "transparent" }}
                              onClick={() => handleEdit(prescription)}
                            >
                              {t("Manage")}
                            </Button>
                            <Button
                              className="view-btn"
                              variant=""
                              size="sm"
                              style={{ color: "#dc3545", backgroundColor: "transparent" }}
                              onClick={() => handleDeleteClick(prescription)}
                            >
                              {t("Delete")}
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for Notes */}
                      {expandedRow === prescription.id && prescription.notes && prescription.notes.length > 50 && (
                        <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                          <td colSpan="7" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section p-3">
                              <Card>
                                <Card.Body>
                                  <h6>{t("Notes")}</h6>
                                  <p className="mb-0">{prescription.notes}</p>
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
                    <td colSpan="7" className="text-center text-muted">
                      {currentFilters.searchValue ?
                        t('No results found for search', { search: currentFilters.searchValue }) :
                        t('No prescriptions found')
                      }
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
              totalItems={prescriptionsData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={prescriptionsData.totalPages || 1}
            />
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <DaynamicEditModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPrescription(null);
        }}
        onSave={() => {
          setShowModal(false);
          setSelectedPrescription(null);
          refetch();
        }}
        prescription={selectedPrescription}
        isEdit={!isAddMode}
        patientId={PATIENT_ID}
      />

      {/* Delete Confirmation Popup */}
      {prescriptionToDelete && (
        <PopupMessage
          type="danger"
          title={t('Confirm Delete')}
          message={t('Are you sure you want to delete prescription') + ` "${prescriptionToDelete.title}"?`}
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

export default PatientPrescriptionTable;