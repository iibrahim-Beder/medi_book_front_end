// DiagnosedConditionsMobileView.jsx
import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Field from "../../../../../ui/form-fields/Field";
import Pagination from "../../../../../shareds/Pagination";

const DiagnosedConditionsMobileView = () => {
  const { t } = useTranslation();
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotes, setExpandedNotes] = useState({});

  // Filters states
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing diagnosed conditions
  const conditionsData = [
    {
      id: "#DC001",
      medicalConditionName: "Rheumatoid Arthritis",
      severity: "Severe",
      diagnosisName: "Seropositive Rheumatoid Arthritis",
      diagnosedDate: "2022-08-12",
      isActive: true,
      notes:
        "Patient presents with symmetric polyarthritis affecting small joints of hands and feet. Morning stiffness lasting over 2 hours. Elevated CRP and ESR levels. Rheumatoid factor positive. Started on Methotrexate and Prednisone taper. Requires regular monitoring of liver function and blood counts.",
    },
    {
      id: "#DC002",
      medicalConditionName: "Chronic Kidney Disease",
      severity: "Moderate",
      diagnosisName: "CKD Stage 3",
      diagnosedDate: "2023-03-18",
      isActive: true,
      notes:
        "Estimated GFR 45 mL/min/1.73m². Secondary to long-standing hypertension. Proteinuria 450 mg/24h. Blood pressure well-controlled on ACE inhibitors. Advised renal protective diet: low sodium, moderate protein. Avoid NSAIDs and nephrotoxic agents. Regular monitoring of renal function every 3 months.",
    },
    // ... باقي البيانات
  ];

  // Toggle notes expansion
  const toggleNotes = (conditionId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [conditionId]: !prev[conditionId]
    }));
  };

  // Apply search & filters
  const filteredConditions = conditionsData
    .filter((condition) => {
      if (!searchTerm) return true;
      if (searchBy === "all") {
        return Object.values(condition)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return condition[searchBy]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    })
    .filter((condition) => {
      if (filterType && condition.medicalConditionName !== filterType)
        return false;
      return true;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const handleOpenModal = (condition) => {
    setSelectedCondition(condition);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalExited = () => {
    setSelectedCondition(null);
  };

  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredConditions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredConditions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "#4BAE78";
      case "moderate":
        return "#FFA500";
      case "severe":
        return "#D66A6A";
      default:
        return "#6C757D";
    }
  };

  // Get status color and text
  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? "#3fabf3" : "#7A8B97",
      text: isActive
        ? t("Common.status_options.active")
        : t("Common.status_options.inactive"),
    };
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosedConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterDateFrom={filterDateFrom}
              setFilterDateFrom={setFilterDateFrom}
              filterDateTo={filterDateTo}
              setFilterDateTo={setFilterDateTo}
              onReset={resetFilters}
              onSearch={() => setCurrentPage(1)}
              conditions={conditionsData}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((condition) => {
              const statusInfo = getStatusInfo(condition.isActive);
              const isNotesExpanded = expandedNotes[condition.id];
              
              return (
                <Card key={condition.id} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    <h5>{condition.medicalConditionName}</h5>

                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">
                        {t("DiagnosedConditionsMobileView.diagnosis_name")}:
                      </small>
                      <p>{condition.diagnosisName}</p>
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: getSeverityColor(condition.severity) }}
                        >
                          {t(`DiagnosedConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`)}
                        </div>
                        <small className="text-muted">{t("DiagnosedConditionsMobileView.severity")}</small>
                      </div>
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: statusInfo.color }}
                        >
                          {statusInfo.text}
                        </div>
                        <small className="text-muted">{t("DiagnosedConditionsMobileView.status")}</small>
                      </div>
                      <div className="col-4 pl-0 pr-1">
                        <div className="fw-bold text-secondary">
                          {formatDate(condition.diagnosedDate)}
                        </div>
                        <small className="text-muted">{t("DiagnosedConditionsMobileView.diagnosed_date")}</small>
                      </div>
                    </div>

                    {/* Notes Section with Expand/Collapse */}
                    <div className="mb-2">
                      <small
                        className="text-muted d-flex mb-1"
                        onClick={() => toggleNotes(condition.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {t('DiagnosedConditionsMobileView.notes')} :
                        {condition.notes && (
                          <button
                            className=""
                            onClick={() => toggleNotes(condition.id)}
                            style={{
                              fontSize: '20px',
                              color: '#278fff',
                              padding: "3px 0 0"
                            }}
                          >
                            <MdExpandMore
                            onClick={() => toggleNotes(condition.id)}
                              style={{
                                transform: expandedNotes[condition.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </button>
                        )}
                      </small>
                      <div className={`expandable-content ${expandedNotes[condition.id] ? '' : 'p-0'}`}>
                        <p
                          style={{
                            margin: "0",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => toggleNotes(condition.id)}
                        >
                          {expandedNotes[condition.id] ? condition.notes : ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        style={{ float: "inline-end" }}
                        onClick={() => handleOpenModal(condition)}
                      >
                        {t("DiagnosedConditionsMobileView.view_all_details")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t("DiagnosedConditionsMobileView.no_conditions_found")}</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredConditions.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal Details */}
      <Modal
        className="mobile-view"
        show={showModal}
        onHide={handleCloseModal}
        onExited={handleModalExited}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header className="border-bottom-0">
          <Modal.Title>{selectedCondition?.medicalConditionName}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label={t("DiagnosedConditionsMobileView.diagnosis_name")}
            value={selectedCondition?.diagnosisName}
            disabled
          />

          <Field
            label={t("DiagnosedConditionsMobileView.severity")}
            value={
              selectedCondition?.severity
                ? t(`DiagnosedConditionsMobileView.severity_options.${selectedCondition.severity.toLowerCase()}`)
                : ""
            }
            disabled
            style={{ color: getSeverityColor(selectedCondition?.severity) }}
          />

          <Field
            label={t("DiagnosedConditionsMobileView.status")}
            value={
              selectedCondition?.isActive != null
                ? t(
                    `Common.status_options.${
                      selectedCondition.isActive ? "active" : "inactive"
                    }`
                  )
                : ""
            }
            disabled
            style={{ color: getStatusInfo(selectedCondition?.isActive).color }}
          />

          <Field
            label={t("DiagnosedConditionsMobileView.diagnosed_date")}
            value={formatDate(selectedCondition?.diagnosedDate)}
            disabled
          />

          <TextAreaField
            label={t("DiagnosedConditionsMobileView.notes")}
            value={selectedCondition?.notes || ""}
            disabled
          />
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button
            className="dc-btn dc-cancel-btn"
            onClick={handleCloseModal}
          >
            {t("DiagnosedConditionsMobileView.close")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiagnosedConditionsMobileView;