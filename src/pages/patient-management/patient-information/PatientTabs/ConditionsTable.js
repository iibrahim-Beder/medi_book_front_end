import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import "../../Patient-management.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ConditionsFilters from "./ConditionsFilters";

const ConditionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const rowsPerPage = 5;

  const conditions = [
    { id: 1, nameEn: "Diabetes", type: "Chronic", severity: "Moderate", isActive: true, diagnosedDate: "2023-05-15", notes: "Patient needs regular insulin monitoring." },
    { id: 2, nameEn: "Flu", type: "NonChronic", severity: "Mild", isActive: false, diagnosedDate: "2024-01-20", notes: "Recovered fully." },
    { id: 3, nameEn: "Hypertension", type: "Chronic", severity: "Severe", isActive: true, diagnosedDate: "2022-09-10", notes: "Under medication and monitoring." },
  ];

  const fields = [
    { name: "id", label: "ID", type: "text", placeholder: "Enter ID" },
    { name: "nameEn", label: "Name", type: "text", placeholder: "Enter name" },
    { name: "type", label: "Type", type: "text", placeholder: "Enter type" },
    { name: "severity", label: "Severity", type: "text", placeholder: "Enter severity" },
    { name: "isActive", label: "Is Active", type: "checkbox" },
    { name: "diagnosedDate", label: "Diagnosed Date", type: "date" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter notes" },
  ];

  const handleView = (id) => alert(`View details of ${id}`);
  const handleEdit = (entry) => {
    setSelectedRecord(entry);
    setShowModal(true);
  };
  const handleSave = () => {
    console.log("Saved record:", selectedRecord);
    setShowModal(false);
  };

  const filteredData = conditions
    .filter(c =>
      c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c => filterActive ? String(c.isActive) === filterActive : true)
    .filter(c => filterSeverity ? c.severity === filterSeverity : true)
    .filter(c => filterType ? c.type === filterType : true)
    .filter(c => filterDateFrom ? new Date(c.diagnosedDate) >= new Date(filterDateFrom) : true)
    .filter(c => filterDateTo ? new Date(c.diagnosedDate) <= new Date(filterDateTo) : true);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterActive("");
    setFilterSeverity("");
    setFilterType("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">Medical Conditions</h3>
        <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
      </div>

      <ConditionsFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
        filterType={filterType}
        setFilterType={setFilterType}
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        onReset={resetFilters}
        conditions={conditions}
      />

      <div className="p-3">
        <div className="table-card">
          <div className="scrol patientTable" style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Active</th>
                  <th>Diagnosed Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? currentData.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.nameEn}</td>
                    <td>{entry.type}</td>
                    <td>{entry.severity}</td>
                    <td>{entry.isActive ? "Active" : "Inactive"}</td>
                    <td>{entry.diagnosedDate}</td>
                    <td>{entry.notes}</td>
                    <td>
                      <Button variant="outline-primary" size="lg" className="me-2" onClick={() => handleView(entry.id)}>
                        <MdOutlineRemoveRedEye />
                      </Button>
                      <Button variant="outline-secondary" size="lg" onClick={() => handleEdit(entry)}>
                        <FaRegEdit />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No records found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            <div className="info-bar">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="pagination-buttons d-flex">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
              {[...Array(totalPages)].map((_, idx) => (
                <button key={idx} className={currentPage === idx + 1 ? "current" : ""} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
            </div>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <DynamicEditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          record={selectedRecord}
          setRecord={setSelectedRecord}
          fields={fields}
          title="Edit Condition"
        />
      )}
    </div>
  );
};

export default ConditionsTable;
