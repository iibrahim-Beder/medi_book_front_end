// AllergyMobileView.jsx
import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import DynamicEditModal from "../../../shareds/DynamicEditModal";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shareds/Pagination";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shareds/PopupMessage";

const AllergyMobileView = () => {
  const { t } = useTranslation();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Pagination and modal state
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const rowsPerPage = 5;

  // Dropdown options for allergens
  const allergenOptions = [
    { id: 12, label: "12 - Penicillin" },
    { id: 13, label: "13 - Peanuts" },
    { id: 14, label: "14 - Dust mites" },
    { id: 20, label: "20 - Dust mites" },
    { id: 16, label: "16 - Dust mites" },
    { id: 15, label: "15 - Dust mites" },
    { id: 17, label: "17 - Dust mites" },
    { id: 18, label: "18 - Dust mites" },
  ];

  // Mock data for allergies
  const [allergens, setAllergens] = useState([
    {
      allergenId: 12,
      allergenLabel: "12 - Penicillin",
      severity: "Severe",
      isActive: true,
      dateNoted: "2025-10-08T00:00:00",
      reaction: "Difficulty breathing",
      notes: "Patient must avoid penicillin completely. Severe anaphylactic reaction observed during previous exposure. Emergency epinephrine prescribed.",
    },
    {
      allergenId: 13,
      allergenLabel: "13 - Peanuts",
      severity: "Mild",
      isActive: false,
      dateNoted: "2024-05-10T00:00:00",
      reaction: "Skin rash",
      notes: "Occurs after eating peanuts. Mild urticaria and itching. Patient advised to avoid peanut products and carry antihistamines.",
    },
    {
      allergenId: 14,
      allergenLabel: "14 - Dust mites",
      severity: "Moderate",
      isActive: true,
      dateNoted: "2024-03-15T00:00:00",
      reaction: "Sneezing, runny nose",
      notes: "More severe during spring season. Patient recommended to use allergen-proof bedding and maintain low humidity at home.",
    },
  ]);

  // Template for adding a new record
  const emptyRecord = {
    allergenId: null,
    allergenLabel: "",
    severity: "",
    isActive: true,
    dateNoted: "",
    reaction: "",
    notes: "",
  };

  // Form field configuration for modal
  const fields = [
    {
      name: "severity",
      label: t("AllergyMobileView.severity"),
      type: "select",
      options: [
        { value: "Mild", label: t("AllergyMobileView.severity_options.Mild") },
        {
          value: "Moderate",
          label: t("AllergyMobileView.severity_options.Moderate"),
        },
        {
          value: "Severe",
          label: t("AllergyMobileView.severity_options.Severe"),
        },
      ],
      placeholder: t("AllergyMobileView.select_severity"),
    },
    {
      name: "isActive",
      label: t("AllergyMobileView.active"),
      type: "select",
      options: [
        { value: true, label: t("AllergyMobileView.active_options.Active") },
        { value: false, label: t("AllergyMobileView.active_options.Inactive") },
      ],
      placeholder: t("AllergyMobileView.select_active_status"),
    },
    {
      name: "dateNoted",
      label: t("AllergyMobileView.date_noted"),
      type: "date",
      placeholder: t("AllergyMobileView.select_date"),
    },
    {
      name: "reaction",
      label: t("AllergyMobileView.reaction"),
      type: "text",
      placeholder: t("AllergyMobileView.enter_reaction"),
    },
    {
      name: "notes",
      label: t("AllergyMobileView.notes"),
      type: "textarea",
      placeholder: t("AllergyMobileView.enter_notes"),
    },
  ];

  // Open modal for adding a new record
  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  // Open modal for editing an existing record
  const handleEdit = (entry) => {
    setSelectedRecord({
      ...entry,
      allergenId: entry.allergenId ?? null,
      allergenLabel: entry.allergenLabel || "",
    });
    setIsAddMode(false);
    setShowModal(true);
  };

  // Save changes (add or update)
  const handleSave = () => {
    if (!selectedRecord) return;
    if (isAddMode) {
      // Generate ID if missing
      let id = selectedRecord.allergenId;
      if (!id && selectedRecord.allergenLabel) {
        const found = allergenOptions.find(
          (o) =>
            o.label === selectedRecord.allergenLabel ||
            String(o.id) === String(selectedRecord.allergenLabel)
        );
        id = found
          ? found.id
          : Math.max(0, ...allergens.map((a) => a.allergenId)) + 1;
      }
      const newRecord = {
        ...selectedRecord,
        allergenId: id,
        allergenLabel:
          selectedRecord.allergenLabel ||
          (allergenOptions.find((o) => o.id === id)?.label ?? String(id)),
      };
      setAllergens([...allergens, newRecord]);
    } else {
      // Update existing record
      const updated = allergens.map((item) =>
        item.allergenId === selectedRecord.allergenId
          ? {
              ...selectedRecord,
              allergenLabel: selectedRecord.allergenLabel ?? item.allergenLabel,
            }
          : item
      );
      setAllergens(updated);
    }
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Toggle notes expansion
  const toggleNotes = (allergyId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [allergyId]: !prev[allergyId]
    }));
  };

  // Apply filters (search, type, date range)
  const filteredData = allergens
    .filter(
      (c) =>
        c.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.reaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.allergenLabel?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((c) => (filterType ? c.severity === filterType : true))
    .filter((c) => {
      if (!filterDateFrom && !filterDateTo) return true;
      const eventDate = new Date(c.dateNoted);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;

      if (fromDate && toDate)
        return eventDate >= fromDate && eventDate <= toDate;
      if (fromDate) return eventDate >= fromDate;
      if (toDate) return eventDate <= toDate;
      return true;
    });

  // Delete record confirmation
  const handleDeleteClick = (entry) => {
    setRecordToDelete(entry);
    setShowPopup(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      const updatedAllergens = allergens.filter(
        item => item.allergenId !== recordToDelete.allergenId
      );
      setAllergens(updatedAllergens);
      setShowPopup(false);
      setRecordToDelete(null);
      setShowModal(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
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

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("AllergyMobileView.table_title")}</h3>
          <h6 className="table-subtitle">
            {t("AllergyMobileView.table_subtitle")}
          </h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("AllergyMobileView.add_allergen")}
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
              conditions={allergens}
              historyTypes={["Mild", "Moderate", "Severe"]}
              HistoryType={{
                All: "All",
                Mild: "Mild",
                Moderate: "Moderate",
                Severe: "Severe",
              }}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((allergy) => {
              const isNotesExpanded = expandedNotes[allergy.allergenId];
              
              return (
                <Card
                  key={allergy.allergenId ?? allergy.allergenLabel}
                  className="mobile-view-card"
                >
                  <Card.Body style={{ padding: "15px" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ margin: 0 }}>{allergy.allergenLabel}</h5>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">
                        {t("AllergyMobileView.reaction")}:
                      </small>
                      <p className="mb-1">{allergy.reaction}</p>
                    </div>

                    {/* Notes Section with Expand/Collapse */}
                    {allergy.notes && (
                      <div className="mb-2">
                        <small
                          className="text-muted d-flex mb-1"
                          onClick={() => toggleNotes(allergy.allergenId)}
                          style={{ cursor: "pointer" }}
                        >
                          {t('AllergyMobileView.notes')} :
                          <button
                            className=""
                            onClick={() => toggleNotes(allergy.allergenId)}
                            style={{
                              fontSize: '20px',
                              color: '#278fff',
                              padding: "3px 0 0"
                            }}
                          >
                            <MdExpandMore
                            onClick={() => toggleNotes(allergy.allergenId)}
                              style={{
                                transform: expandedNotes[allergy.allergenId] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </button>
                        </small>
                        <div className={`expandable-content ${expandedNotes[allergy.allergenId] ? '' : 'p-0'}`}>
                          <p
                            style={{
                              margin: "0",
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => toggleNotes(allergy.allergenId)}
                          >
                            {expandedNotes[allergy.allergenId] ? allergy.notes : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {t(
                              `AllergyMobileView.severity_options.${allergy.severity}`
                            )}
                          </div>
                          <small className="text-muted">
                            {t("AllergyMobileView.severity")}
                          </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-primary">
                          {formatDate(allergy.dateNoted)}
                        </div>
                        <small className="text-muted">
                          {t("AllergyMobileView.date_noted")}
                        </small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-primary">
                          {allergy.isActive
                            ? t("AllergyMobileView.active_options.Active")
                            : t("AllergyMobileView.active_options.Inactive")}
                        </div>
                        <small className="text-muted">
                          {t("AllergyMobileView.is_active")}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 1 }}></div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(allergy)}
                      >
                        {t("AllergyMobileView.manage")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">
                    {t("AllergyMobileView.no_records_found")}
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Edit/Add Modal */}
      <DynamicEditModal
        onDelete={handleDeleteInModal}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={fields}
        title={
          isAddMode
            ? t("AllergyMobileView.add_allergen")
            : t("AllergyMobileView.edit_allergen")
        }
        dropdownOptions={allergenOptions}
        dropdownField="allergenId"
        dropdownLabel={t("AllergyMobileView.allergen")}
      />
      
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('AllergyTable.confirm_delete_title')}
          message={t('AllergyTable.confirm_delete_message', { 
            allergen: recordToDelete.allergenLabel || recordToDelete.allergenId 
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

export default AllergyMobileView;