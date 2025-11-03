// OtherMedicalConditions.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../../shared/Pagination";
import PopupMessage from "../../../../../shared/PopupMessage"; 
import DynamicEditModal from "../../../../../shared/DynamicEditModal"; 

const OtherMedicalConditions = () => {
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

  // Mock data representing diagnosed conditions
  const [conditionsData, setConditionsData] = useState([
    {
      id: "#DC001",
      medicalConditionName: "Rheumatoid Arthritis",
      severity: "Severe",
      diagnosedDate: "2022-08-12",
      isActive: true,
      notes: "Patient presents with symmetric polyarthritis affecting small joints of hands and feet..."
    },
    {
      id: "#DC002",
      medicalConditionName: "Chronic Kidney Disease",
      severity: "Moderate",
      diagnosedDate: "2023-03-18",
      isActive: true,
      notes: "Estimated GFR 45 mL/min/1.73m². Secondary to long-standing hypertension..."
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
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (condition) => {
    setSelectedRecord({ ...condition });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Handle Save (Add/Update)
  const handleSave = () => {
    if (!selectedRecord) return;

    if (isAddMode) {
      // Generate new ID
      const newId = `#DC${String(conditionsData.length + 1).padStart(3, '0')}`;
      const newRecord = {
        ...selectedRecord,
        id: newId
      };
      setConditionsData([...conditionsData, newRecord]);
    } else {
      // Update existing record
      const updatedData = conditionsData.map(item =>
        item.id === selectedRecord.id ? selectedRecord : item
      );
      setConditionsData(updatedData);
    }

    setShowModal(false);
    setSelectedRecord(null);
  };

  // Handle Delete Click
  const handleDeleteClick = (condition) => {
    setRecordToDelete(condition);
    setShowPopup(true);
  };

  // Handle Delete from Modal
  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      // setShowModal(false);
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
      setShowModal(false);
    }
  };

  // Close Popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleNotesClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
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
    <div className="table-container">
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

      <div className="">
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
              conditions={conditionsData}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("OtherMedicalConditionsMobileView.medical_condition_name")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.severity")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.diagnosed_date")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.status")}</th>
                  <th>{t("OtherMedicalConditionsMobileView.notes")}</th>
                  <th>{t("OtherMedicalConditions.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((condition) => {
                  const statusInfo = getStatusInfo(condition.isActive);
                  return (
                    <React.Fragment key={condition.id}>
                      <tr>
                        <td title={condition.medicalConditionName}>
                          {condition.medicalConditionName}
                        </td>
                        <td>
                          <span
                            style={{
                              color: getSeverityColor(condition.severity),
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {t(`OtherMedicalConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`)}
                          </span>
                        </td>
                        <td>{formatDate(condition.diagnosedDate)}</td>
                        <td>
                          <span
                            style={{
                              color: statusInfo.color,
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td title={condition.notes}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              {truncateText(condition.notes, 80)}
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
                              onClick={() => handleNotesClick(condition.id)}
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === condition.id
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                          </div>
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
                              {/* <MdEdit size={16} /> */}
                              {t("Manage")}
                            </Button>
                            {/* <Button
                              className="view-btn"
                              variant=""
                              size="sm"
                              style={{ color: "#dc3545", backgroundColor: "transparent" }}
                              onClick={() => handleDeleteClick(condition)}
                            >
                              {t("Delete")}
                            </Button> */}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for Notes */}
                      {expandedRow === condition.id && (
                        <tr
                          className="table-active-content"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <td
                            colSpan="6"
                            className="border-0 background-in-hover-none"
                          >
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("OtherMedicalConditionsMobileView.notes")}
                                value={condition.notes}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredConditions.length}
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

export default OtherMedicalConditions;