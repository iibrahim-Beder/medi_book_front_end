// OtherMedicationMobileView.jsx
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import ConditionsFilters from "./component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Pagination from "../../../shareds/Pagination";
import PopupMessage from "../../../shareds/PopupMessage";
import DynamicEditModal from "../../../shareds/DynamicEditModal";
import "../../Patient-management.css";

const OtherMedicationMobileView = () => {
  const { t } = useTranslation();
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState({});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters states
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const rowsPerPage = 5;

  // Mock data representing prescriptions
  const [prescriptionsData, setPrescriptionsData] = useState([
    {
      id: "#RX001",
      medication: "Metformin",
      dosage: "500mg twice daily",
      duration: "30 days",
      instructions: "Take one tablet with breakfast and one with dinner. Always take with food to minimize gastrointestinal side effects. If you experience significant stomach upset, consult your doctor. Monitor your blood sugar levels regularly and report any unusual readings.",
      status: "active",
    },
    {
      id: "#RX002",
      medication: "Glucose Test Strips",
      dosage: "As needed",
      duration: "90 days",
      instructions: "Check blood sugar levels: 1) First thing in the morning (fasting), 2) Before each main meal, 3) Two hours after meals, and 4) At bedtime. Record all readings in your logbook. Bring the logbook to your next appointment. Contact your doctor if fasting readings are consistently above 130 mg/dL or post-meal readings above 180 mg/dL.",
      status: "active",
    },
    
  ]);

  // Template for new record
  const emptyRecord = {
    medication: "",
    dosage: "",
    duration: "",
    instructions: "",
    status: "active"
  };

  // Form fields configuration for modal
  const fields = [
    { 
      name: "medication", 
      label: t('OtherMedication.medication'), 
      type: "text", 
      placeholder: t('OtherMedication.enter_medication') 
    },
    { 
      name: "dosage", 
      label: t('OtherMedication.dosage'), 
      type: "text", 
      placeholder: t('OtherMedication.enter_dosage') 
    },
    { 
      name: "duration", 
      label: t('OtherMedication.duration'), 
      type: "text", 
      placeholder: t('OtherMedication.enter_duration') 
    },
    { 
      name: "status", 
      label: t('OtherMedication.status'), 
      type: "select", 
      options: [
        { value: "active", label: t('Common.status_options.active') },
        { value: "completed", label: t('Common.status_options.completed') },
        { value: "cancelled", label: t('Common.status_options.cancelled') },
        { value: "expired", label: t('Common.status_options.expired') }
      ], 
      placeholder: t('OtherMedication.select_status') 
    },
    { 
      name: "instructions", 
      label: t('OtherMedication.instructions'), 
      type: "textarea", 
      placeholder: t('OtherMedication.enter_instructions') 
    },
  ];

  // Handle Add New
  const handleAddNew = () => {
    setSelectedMedication({ ...emptyRecord });
    setIsAddMode(true);
    setShowEditModal(true);
  };

  // Handle Edit
  const handleEdit = (medication) => {
    setSelectedMedication({ ...medication });
    setIsAddMode(false);
    setShowEditModal(true);
  };

  // Handle Save (Add/Update)
  const handleSave = () => {
    if (!selectedMedication) return;

    if (isAddMode) {
      // Generate new ID
      const newId = `#RX${String(prescriptionsData.length + 1).padStart(3, '0')}`;
      const newRecord = {
        ...selectedMedication,
        id: newId
      };
      setPrescriptionsData([...prescriptionsData, newRecord]);
    } else {
      // Update existing record
      const updatedData = prescriptionsData.map(item =>
        item.id === selectedMedication.id ? selectedMedication : item
      );
      setPrescriptionsData(updatedData);
    }

    setShowEditModal(false);
    setSelectedMedication(null);
  };

  // Handle Delete from Edit Modal
  const handleDeleteInModal = () => {
    if (selectedMedication) {
      setRecordToDelete(selectedMedication);
      setShowPopup(true);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      const updatedData = prescriptionsData.filter(
        item => item.id !== recordToDelete.id
      );
      setPrescriptionsData(updatedData);
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

  // Toggle instructions expansion
  const toggleInstructions = (medicationId) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [medicationId]: !prev[medicationId]
    }));
  };

  // Apply search & filters
  const filteredPrescriptions = prescriptionsData
    .filter((prescription) => {
      if (!searchTerm) return true;
      return (
        prescription.medication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.dosage?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((prescription) =>
      filterType ? prescription.medication === filterType : true
    );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPrescriptions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredPrescriptions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#3fabf3";
      case "completed":
        return "#4BAE78";
      case "cancelled":
        return "#D66A6A";
      case "expired":
        return "#7A8B97";
      default:
        return "#6C757D";
    }
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("OtherMedicationMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('OtherMedication.add_medication')}
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
              conditions={prescriptionsData}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((prescription) => {
              const isInstructionsExpanded = expandedInstructions[prescription.id];
              
              return (
                <Card key={prescription.id} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ margin: 0 }}>{prescription.medication}</h5>
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4 border-end">
                        <div className="fw-bold text-primary">
                          {prescription.dosage}
                        </div>
                        <small className="text-muted">
                          {t("OtherMedicationMobileView.dosage")}
                        </small>
                      </div>
                      <div className="col-4 border-end">
                        <div className="fw-bold text-primary">
                          {prescription.duration}
                        </div>
                        <small className="text-muted">
                          {t("OtherMedicationMobileView.duration")}
                        </small>
                      </div>
                      <div className="col-4 pl-0 pr-1">
                        <div
                          className="fw-bold"
                          style={{ color: getStatusColor(prescription.status) }}
                        >
                          {t(`Common.status_options.${prescription.status}`)}
                        </div>
                        <small className="text-muted">
                          {t("OtherMedicationMobileView.status")}
                        </small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small
                        className="text-muted d-flex mb-1"
                        onClick={() => toggleInstructions(prescription.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {t("OtherMedicationMobileView.instructions")} :
                        {prescription.instructions && (
                          <button
                            className=""
                            onClick={() => toggleInstructions(prescription.id)}
                            style={{
                              fontSize: "20px",
                              color: "#278fff",
                              padding: "3px 0 0",
                            }}
                          >
                            <MdExpandMore
                              onClick={() =>
                                toggleInstructions(prescription.id)
                              }
                              style={{
                                transform: expandedInstructions[prescription.id]
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </button>
                        )}
                      </small>
                      <div
                        className={`expandable-content ${
                          expandedInstructions[prescription.id] ? "" : "p-0"
                        }`}
                      >
                        <p
                          style={{
                            margin: "0",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => toggleInstructions(prescription.id)}
                        >
                          {expandedInstructions[prescription.id]
                            ? prescription.instructions
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        style={{ float: "inline-end" }}
                        onClick={() => handleEdit(prescription)}
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
                  <p className="text-muted">{t("OtherMedicationMobileView.no_medications_found")}</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredPrescriptions.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal for Add/Edit */}
      <DynamicEditModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMedication(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedMedication}
        setRecord={setSelectedMedication}
        fields={fields}
        addMode={isAddMode}
        title={isAddMode ? t('OtherMedication.add_medication') : t('OtherMedication.edit_medication')}
      />

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('OtherMedication.confirm_delete_title')}
          message={t('OtherMedication.confirm_delete_message', { 
            medication: recordToDelete.medication 
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

export default OtherMedicationMobileView;