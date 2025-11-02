// OtherMedicalConditionsMobileView.jsx
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../../shared/Pagination";
import PopupMessage from "../../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";

const OtherMedicalConditionsMobileView = () => {
  const { t } = useTranslation();
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters states
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing diagnosed conditions
  const [conditionsData, setConditionsData] = useState([
    {
      id: "#DC001",
      medicalConditionName: "Rheumatoid Arthritis",
      severity: "Severe",
      diagnosedDate: "2022-08-12",
      isActive: true,
      notes: "Patient presents with symmetric polyarthritis affecting small joints of hands and feet. Morning stiffness lasting over 2 hours. Elevated CRP and ESR levels. Rheumatoid factor positive. Started on Methotrexate and Prednisone taper. Requires regular monitoring of liver function and blood counts."
    },
    {
      id: "#DC002",
      medicalConditionName: "Chronic Kidney Disease",
      severity: "Moderate",
      diagnosedDate: "2023-03-18",
      isActive: true,
      notes: "Estimated GFR 45 mL/min/1.73m². Secondary to long-standing hypertension. Proteinuria 450 mg/24h. Blood pressure well-controlled on ACE inhibitors. Advised renal protective diet: low sodium, moderate protein. Avoid NSAIDs and nephrotoxic agents. Regular monitoring of renal function every 3 months."
    },
  ]);

  // Template for new record
  const emptyRecord = {
    medicalConditionName: "",
    severity: "",
    diagnosedDate: "",
    isActive: true,
    notes: ""
  };

  // Form fields configuration for modal
  const fields = [
    { 
      name: "medicalConditionName", 
      label: t('OtherMedicalConditions.medical_condition_name'), 
      type: "text", 
      placeholder: t('OtherMedicalConditions.enter_condition_name') 
    },
    { 
      name: "severity", 
      label: t('OtherMedicalConditions.severity'), 
      type: "select", 
      options: [
        { value: "Mild", label: t('OtherMedicalConditions.severity_options.Mild') },
        { value: "Moderate", label: t('OtherMedicalConditions.severity_options.Moderate') }, 
        { value: "Severe", label: t('OtherMedicalConditions.severity_options.Severe') }
      ], 
      placeholder: t('OtherMedicalConditions.select_severity') 
    },
    { 
      name: "isActive", 
      label: t('OtherMedicalConditions.status'), 
      type: "select", 
      options: [
        { value: true, label: t('Common.status_options.active') },
        { value: false, label: t('Common.status_options.inactive') }
      ], 
      placeholder: t('OtherMedicalConditions.select_status') 
    },
    { name: "diagnosedDate", label: t('OtherMedicalConditions.diagnosed_date'), type: "date", placeholder: t('OtherMedicalConditions.select_date') },
    { name: "notes", label: t('OtherMedicalConditions.notes'), type: "textarea", placeholder: t('OtherMedicalConditions.enter_notes') },
  ];

  // Handle Add New
  const handleAddNew = () => {
    setSelectedCondition({ ...emptyRecord });
    setIsAddMode(true);
    setShowEditModal(true);
  };

  // Handle Edit
  const handleEdit = (condition) => {
    setSelectedCondition({ ...condition });
    setIsAddMode(false);
    setShowEditModal(true);
  };

  // Handle Save (Add/Update)
  const handleSave = () => {
    if (!selectedCondition) return;

    if (isAddMode) {
      // Generate new ID
      const newId = `#DC${String(conditionsData.length + 1).padStart(3, '0')}`;
      const newRecord = {
        ...selectedCondition,
        id: newId
      };
      setConditionsData([...conditionsData, newRecord]);
    } else {
      // Update existing record
      const updatedData = conditionsData.map(item =>
        item.id === selectedCondition.id ? selectedCondition : item
      );
      setConditionsData(updatedData);
    }

    setShowEditModal(false);
    setSelectedCondition(null);
  };

  // Handle Delete from Edit Modal
  const handleDeleteInModal = () => {
    if (selectedCondition) {
      setRecordToDelete(selectedCondition);
      setShowPopup(true);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      const updatedData = conditionsData.filter(
        item => item.id !== recordToDelete.id
      );
      setConditionsData(updatedData);
      setShowPopup(false);
      setRecordToDelete(null);
      setShowEditModal(false);
    }
  };

  // Close Popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

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

  const rowsPerPage = 5;
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
      text: t(`Common.status_options.${isActive ? "active" : "inactive"}`),
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
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("OtherMedicalConditionsMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('OtherMedicalConditions.add_condition')}
          </button>
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
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ margin: 0 }}>{condition.medicalConditionName}</h5>
                    </div>
                    
                    <div className="row text-center mb-3">
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{
                            color: getSeverityColor(condition.severity),
                          }}
                        >
                          {t(`OtherMedicalConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`)}
                        </div>
                        <small className="text-muted">{t("OtherMedicalConditionsMobileView.severity")}</small>
                      </div>
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: statusInfo.color }}
                        >
                          {statusInfo.text}
                        </div>
                        <small className="text-muted">{t("OtherMedicalConditionsMobileView.status")}</small>
                      </div>
                      <div className="col-4 pl-0 pr-1">
                        <div className="fw-bold text-secondary">
                          {formatDate(condition.diagnosedDate)}
                        </div>
                        <small className="text-muted">{t("OtherMedicalConditionsMobileView.diagnosed_date")}</small>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-2">
                      <small
                        className="text-muted d-flex mb-1"
                        onClick={() => toggleNotes(condition.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {t('OtherMedicalConditionsMobileView.notes')} :
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
                        onClick={() => handleEdit(condition)}
                      >
                        {t("Manage")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t("OtherMedicalConditionsMobileView.no_conditions_found")}</p>
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

      {/* Modal for Add/Edit */}
      <DynamicEditModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCondition(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedCondition}
        setRecord={setSelectedCondition}
        fields={fields}
        addMode={isAddMode}
        title={isAddMode ? t('OtherMedicalConditions.add_condition') : t('OtherMedicalConditions.edit_condition')}
      />

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('OtherMedicalConditions.confirm_delete_title')}
          message={t('OtherMedicalConditions.confirm_delete_message', { 
            condition: recordToDelete.medicalConditionName 
          })}
          buttons={[
            { 
              text: t('Cancel'), 
              onClick: handleClosePopup, 
              variant: "secondary" 
            },
            { 
              text: t('Delete'), 
              onClick: handleConfirmDelete, 
              variant: "danger" 
            }
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default OtherMedicalConditionsMobileView;