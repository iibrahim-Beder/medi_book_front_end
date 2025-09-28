import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import MedicalHistoryModal from "./component/MedicalHistoryModal"; 
import "../../Patient-management.css";
import ConditionsFilters from "./component/ConditionsFilters";

const MedicalHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const rowsPerPage = 5;

  
  const HistoryType = {
    All: "All",
    Surgery: "Surgery",
    Accident: "Accident", 
    Hospitalization: "Hospitalization",
    FamilyHistory: "FamilyHistory",
    Vaccination: "Vaccination",
    Others: "Others"
  };

  const historyTypes = [
    HistoryType.Surgery,
    HistoryType.Accident,
    HistoryType.Hospitalization,
    HistoryType.FamilyHistory,
    HistoryType.Vaccination,
    HistoryType.Others
  ];


  const hereditaryDiseases = [
    "Diabetes",
    "Heart Disease", 
    "Cancer",
    "Hypertension",
    "Asthma",
    "Mental Health Disorders",
    "Other"
  ];

  // Mock Data 
  const [medicalHistory, setMedicalHistory] = useState([
    {
      id: 1,
      historyType: HistoryType.Surgery,
      hereditaryDisease: "",
      description: "Appendix removal",
      dateOfEvent: "2022-03-15",
      relatedPerson: null,
      notes: "Successful surgery with no complications.",
    },
    {
      id: 2,
      historyType: HistoryType.Accident,
      hereditaryDisease: "",
      description: "Car accident with minor injuries",
      dateOfEvent: "2021-11-02",
      relatedPerson: null,
      notes: "Recovered after 2 weeks.",
    },
    {
      id: 3,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: "Heart Disease", 
      description: "Father had heart disease",
      dateOfEvent: "2020-01-01",
      relatedPerson: "Father",
      notes: "Family-related record",
    },
    {
      id: 4,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: "Diabetes",
      description: "Mother has diabetes",
      dateOfEvent: "2019-05-10",
      relatedPerson: "Mother",
      notes: "Type 2 diabetes diagnosed at age 45",
    },
  ]);

  // to reset the form in modal
  const emptyRecord = {
    historyType: "",
    hereditaryDisease: "",
    description: "",
    dateOfEvent: "",
    relatedPerson: "",
    notes: ""
  };

  const handleAddNew = () => {
    setSelectedRecord({...emptyRecord});
    setIsAddMode(true);
    setShowModal(true);
  };

  const handleEdit = (entry) => {
    setSelectedRecord({...entry});
    setIsAddMode(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (isAddMode) {
      const newRecord = {
        ...selectedRecord,
        id: Math.max(0, ...medicalHistory.map(item => item.id)) + 1
      };
      setMedicalHistory([...medicalHistory, newRecord]);
    } else {
      
      const updatedHistory = medicalHistory.map(item =>
        item.id === selectedRecord.id ? selectedRecord : item
      );
      setMedicalHistory(updatedHistory);
    }
    
    console.log("Saved record:", selectedRecord);
    setShowModal(false);
    setSelectedRecord(null);
  };

  // filters the data based on search and filters
  const filteredData = medicalHistory
    .filter((c) =>
      c.historyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.hereditaryDisease?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.relatedPerson?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((c) => (filterType ? c.historyType === filterType : true))
    .filter((c) => {
      if (!filterDateFrom && !filterDateTo) return true;
      const eventDate = new Date(c.dateOfEvent);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;

      if (fromDate && toDate) return eventDate >= fromDate && eventDate <= toDate;
      if (fromDate) return eventDate >= fromDate;
      if (toDate) return eventDate <= toDate;
      return true;
    });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  // to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">Medical History</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            Add Record
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
            conditions={medicalHistory}
            historyTypes={historyTypes}
            HistoryType={HistoryType}
          />
        </div>

        <div className="p-3">
          <div className="scrol patientTable" style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>History Type</th>
                  <th>Hereditary Disease</th>
                  <th>Description</th>
                  <th>Date of Event</th>
                  <th>Related Person</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.historyType}</td>
                      <td>{entry.hereditaryDisease || "-"}</td>
                      <td>{entry.description}</td>
                      <td>{formatDate(entry.dateOfEvent)}</td>
                      <td>{entry.relatedPerson || "-"}</td>
                      <td>
                        {entry.notes ? (
                          <span title={entry.notes}>
                            {entry.notes.length > 50 
                              ? `${entry.notes.substring(0, 50)}...` 
                              : entry.notes}
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
                      No medical history records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            <div className="info-bar" color="#000">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="dt-layout-cell dt-layout-end">
              <div className="dt-paging">
                <nav aria-label="pagination" className="d-flex">
                  <button
                    className="dt-paging-button first"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    «
                  </button>
                  <button
                    className="dt-paging-button previous"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`dt-paging-button none ${currentPage === index + 1 ? "current" : ""}`}
                      type="button"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="dt-paging-button next"
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                  <button
                    className="dt-paging-button last"
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/* the modal for add/edit */}
      <MedicalHistoryModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        hereditaryDiseases={hereditaryDiseases}
        title={isAddMode ? "Add Medical History" : "Edit Medical History"}
      />
    </div>
  );
};

export default MedicalHistoryTable;