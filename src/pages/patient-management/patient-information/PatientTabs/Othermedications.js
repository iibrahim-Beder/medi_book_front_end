// Othermedications.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import ConditionsFilters from "./component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import Pagination from "../../../shared/Pagination";
import PopupMessage from "../../../shared/PopupMessage";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import "../../Patient-management.css";

const Othermedications = () => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters states
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

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
      label: t('Othermedications.medication'), 
      type: "text", 
      placeholder: t('Othermedications.enter_medication') 
    },
    { 
      name: "dosage", 
      label: t('Othermedications.dosage'), 
      type: "text", 
      placeholder: t('Othermedications.enter_dosage') 
    },
    { 
      name: "duration", 
      label: t('Othermedications.duration'), 
      type: "text", 
      placeholder: t('Othermedications.enter_duration') 
    },
    { 
      name: "status", 
      label: t('Othermedications.status'), 
      type: "select", 
      options: [
        { value: "active", label: t('Common.status_options.active') },
        { value: "completed", label: t('Common.status_options.completed') },
        { value: "cancelled", label: t('Common.status_options.cancelled') },
        { value: "expired", label: t('Common.status_options.expired') }
      ], 
      placeholder: t('Othermedications.select_status') 
    },
    { 
      name: "instructions", 
      label: t('Othermedications.instructions'), 
      type: "textarea", 
      placeholder: t('Othermedications.enter_instructions') 
    },
  ];

  // Handle Add New
  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (prescription) => {
    setSelectedRecord({ ...prescription });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Handle Save (Add/Update)
  const handleSave = () => {
    if (!selectedRecord) return;

    if (isAddMode) {
      // Generate new ID
      const newId = `#RX${String(prescriptionsData.length + 1).padStart(3, '0')}`;
      const newRecord = {
        ...selectedRecord,
        id: newId
      };
      setPrescriptionsData([...prescriptionsData, newRecord]);
    } else {
      // Update existing record
      const updatedData = prescriptionsData.map(item =>
        item.id === selectedRecord.id ? selectedRecord : item
      );
      setPrescriptionsData(updatedData);
    }

    setShowModal(false);
    setSelectedRecord(null);
  };

  // Handle Delete from Modal
  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
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
      setShowModal(false);
    }
  };

  // Close Popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  // Handle expand/collapse for instructions
  const handleInstructionsClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Apply search & filters
  const filteredPrescriptions = prescriptionsData
    .filter((prescription) => {
      if (!searchTerm) return true;
      if (searchBy === "all") {
        return Object.values(prescription)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return prescription[searchBy]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    })
    .filter((prescription) => {
      if (filterType && prescription.medication !== filterType) return false;
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
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Othermedications.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('Othermedications.add_medication')}
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
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

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("Othermedications.medication")}</th>
                  <th>{t("Othermedications.dosage")}</th>
                  <th>{t("Othermedications.duration")}</th>
                  <th>{t("Othermedications.instructions")}</th>
                  <th>{t("Othermedications.status")}</th>
                  <th>{t("Othermedications.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((prescription) => (
                  <React.Fragment key={prescription.id}>
                    <tr>
                      <td title={prescription.medication}>
                        {prescription.medication}
                      </td>
                      <td title={prescription.dosage}>{prescription.dosage}</td>
                      <td title={prescription.duration}>
                        {prescription.duration}
                      </td>

                      <td title={prescription.instructions}>
                        <div className="d-flex align-items-center">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "250px" }}
                          >
                            {truncateText(prescription.instructions, 80)}
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
                            onClick={() =>
                              handleInstructionsClick(prescription.id)
                            }
                          >
                            <MdExpandMore
                              style={{
                                transform:
                                  expandedRow === prescription.id
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </Button>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            color: getStatusColor(prescription.status),
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {t(`Common.status_options.${prescription.status}`)}
                        </span>
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
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row for Instructions */}
                    {expandedRow === prescription.id && (
                      <tr
                        className="table-active-content"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <td
                          colSpan="7"
                          className="border-0 background-in-hover-none"
                        >
                          <div className="description-expanded-section">
                            <TextAreaField
                              label={t("Othermedications.instructions")}
                              value={prescription.instructions}
                              disabled={true}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredPrescriptions.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <DynamicEditModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={fields}
        addMode={isAddMode}
        title={isAddMode ? t('Othermedications.add_medication') : t('Othermedications.edit_medication')}
      />

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('Othermedications.confirm_delete_title')}
          message={t('Othermedications.confirm_delete_message', { 
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

export default Othermedications;