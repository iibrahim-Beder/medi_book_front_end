// AllergenTable.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import "../../Patient-management.css";
import ConditionsFilters from "./component/ConditionsFilters";

const AllergyTable = () => {
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

  // Mock data for table preview
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

  return (
    <div className="table-container">
      <div className="table-header " style={{marginBottom:"10px"}}>
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

      <div className="table-card">
        <div className="mb-20 p-3">
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

        <div className="p-3">
          <div className="scrol patientTable" style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>Allergen</th>
                  <th>Severity</th>
                  <th>Active</th>
                  <th>Date Noted</th>
                  <th>Reaction</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((entry) => (
                    <tr key={entry.allergenId ?? entry.allergenLabel}>
                      <td>{entry.allergenLabel ?? String(entry.allergenId)}</td>
                      <td>{entry.severity}</td>
                      <td>{entry.isActive ? "Active" : "Inactive"}</td>
                      <td>{formatDate(entry.dateNoted)}</td>
                      <td>{entry.reaction}</td>
                      <td>
                        {entry.notes ? (
                          <span title={entry.notes}>
                            {entry.notes.length > 50 ? `${entry.notes.substring(0, 50)}...` : entry.notes}
                          </span>
                        ) : "-"}
                      </td>
                      <td>
                        <Button
                          className="view-btn"
                          variant=""
                          size="sm"
                          style={{ color: "#007bff", backgroundColor: "transparent" }}
                          onClick={() => handleEdit(entry)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No allergen records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            <div className="info-bar" color="#000">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="dt-layout-cell dt-layout-end">
              <div className="dt-paging">
                <nav aria-label="pagination" className="d-flex">
                  <button className="dt-paging-button first" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
                  <button className="dt-paging-button previous" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button key={index} className={`dt-paging-button none ${currentPage === index + 1 ? "current" : ""}`} type="button" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                  ))}
                  <button className="dt-paging-button next" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                  <button className="dt-paging-button last" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for add/edit */}
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

export default AllergyTable;
