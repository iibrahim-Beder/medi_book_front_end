// AllergyMobileView.jsx
import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shared/Pagination";
import { MdClose } from "react-icons/md";
import "../../Patient-management.css";

const AllergyMobileView = () => {
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
      notes: "Patient must avoid penicillin completely"
    },
    {
      allergenId: 13,
      allergenLabel: "13 - Peanuts",
      severity: "Mild",
      isActive: false,
      dateNoted: "2024-05-10T00:00:00",
      reaction: "Skin rash",
      notes: "Occurs after eating peanuts"
    },
    {
      allergenId: 14,
      allergenLabel: "14 - Dust mites",
      severity: "Moderate",
      isActive: true,
      dateNoted: "2024-03-15T00:00:00",
      reaction: "Sneezing, runny nose",
      notes: "More severe during spring season"
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
    notes: ""
  };

  // Form field configuration for modal
  const fields = [
    { 
      name: "severity", 
      label: "Severity", 
      type: "select", 
      options: [
        { value: "Mild", label: "Mild" },
        { value: "Moderate", label: "Moderate" }, 
        { value: "Severe", label: "Severe" }
      ], 
      placeholder: "Select severity" 
    },
    { 
      name: "isActive", 
      label: "Active", 
      type: "select", 
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
      ], 
      placeholder: "Is it active?" 
    },
    { name: "dateNoted", label: "Date Noted", type: "date", placeholder: "Select date" },
    { name: "reaction", label: "Reaction", type: "text", placeholder: "Enter reaction" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter notes" },
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
      allergenLabel: entry.allergenLabel || ""
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
        const found = allergenOptions.find(o => o.label === selectedRecord.allergenLabel || String(o.id) === String(selectedRecord.allergenLabel));
        id = found ? found.id : Math.max(0, ...allergens.map(a => a.allergenId)) + 1;
      }
      const newRecord = {
        ...selectedRecord,
        allergenId: id,
        allergenLabel: selectedRecord.allergenLabel || (allergenOptions.find(o => o.id === id)?.label ?? String(id))
      };
      setAllergens([...allergens, newRecord]);
    } else {
      // Update existing record
      const updated = allergens.map(item =>
        item.allergenId === selectedRecord.allergenId ? {
          ...selectedRecord,
          allergenLabel: selectedRecord.allergenLabel ?? item.allergenLabel
        } : item
      );
      setAllergens(updated);
    }
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Apply filters (search, type, date range)
  const filteredData = allergens
    .filter((c) =>
      c.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.reaction?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.notes?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.allergenLabel?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((c) => (filterType ? c.severity === filterType : true))
    .filter((c) => {
      if (!filterDateFrom && !filterDateTo) return true;
      const eventDate = new Date(c.dateNoted);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;

      if (fromDate && toDate) return eventDate >= fromDate && eventDate <= toDate;
      if (fromDate) return eventDate >= fromDate;
      if (toDate) return eventDate <= toDate;
      return true;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
          <h3 className="table-title">Allergy List</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            Add Allergen
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
              HistoryType={{ All: "All", Mild: "Mild", Moderate: "Moderate", Severe: "Severe" }}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((allergy) => (
              <Card
                key={allergy.allergenId ?? allergy.allergenLabel}
                className="mobile-view-card"
                style={{ boxShadow: "0 0 20px 0px #dddddd70" }}
              >
                <Card.Body className="" style={{ padding: "15px" }}>


                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Reaction:</small>
                    <p className="mb-1">{truncateText(allergy.reaction, 60)}</p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Date Noted:</small>
                    <p className="mb-1">{formatDate(allergy.dateNoted)}</p>
                  </div>

                  {allergy.notes && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Notes:</small>
                      <p className="mb-1">{truncateText(allergy.notes, 80)}</p>
                    </div>
                  )}

                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <div className="border-end">
                        <div className="fw-bold text-primary">
                          {allergy.severity}
                        </div>
                        <small className="text-muted">Severity</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-primary">
                        {formatDate(allergy.dateNoted)}
                      </div>
                      <small className="text-muted">Date Noted</small>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-primary">
                        {allergy.isActive ? "Active" : "Inactive"}
                      </div>
                      <small className="text-muted">is Active</small>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="view-btn btn btn-outline-primary btn-sm btn btn-outline-primary btn-sm"
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(allergy)}
                      style={{ float: "inline-end" }}
                    >
                      Manage
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">No Allergy Records Found</p>
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
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={fields}
        title={isAddMode ? "Add Allergen" : "Edit Allergen"}
        dropdownOptions={allergenOptions}
        dropdownField="allergenId"
        dropdownLabel="Allergen"
      />
    </div>
  );
};

export default AllergyMobileView;