// MedicalHistoryMobileView.jsx
import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import MedicalHistoryModal from "./component/MedicalHistoryModal";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shared/Pagination";
import { MdClose } from "react-icons/md";
import "../../Patient-management.css";

const MedicalHistoryMobileView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

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

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get badge class based on history type
  const getHistoryTypeBadge = (type) => {
    switch (type) {
      case HistoryType.Surgery: return "badge bg-danger";
      case HistoryType.Accident: return "badge bg-warning";
      case HistoryType.Hospitalization: return "badge bg-info";
      case HistoryType.FamilyHistory: return "badge bg-success";
      case HistoryType.Vaccination: return "badge bg-primary";
      case HistoryType.Others: return "badge bg-secondary";
      default: return "badge bg-secondary";
    }
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Medical History</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            Add Condition
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
              conditions={medicalHistory}
              historyTypes={historyTypes}
              HistoryType={HistoryType}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((history) => (
              <Card
                key={history.id}
                className="mobile-view-card"
                style={{ boxShadow: "0 0 20px 0px #dddddd70" }}
              >
                <Card.Body className="" style={{ padding: "15px" }}>

                  {history.hereditaryDisease && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Hereditary Disease:</small>
                      <p className="mb-1">{history.hereditaryDisease}</p>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Description:</small>
                    <p className="mb-1">{truncateText(history.description, 60)}</p>
                  </div>

                  {history.relatedPerson && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Related Person:</small>
                      <p className="mb-1">{history.relatedPerson}</p>
                    </div>
                  )}

                  {history.notes && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Notes:</small>
                      <p className="mb-1">{truncateText(history.notes, 80)}</p>
                    </div>
                  )}

                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border-end">
                        <div className="fw-bold text-primary">
                          {formatDate(history.dateOfEvent)}
                        </div>
                        <small className="text-muted">Date of Event</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="fw-bold text-primary">
                        {history.hereditaryDisease ? "Hereditary" : "Non-Hereditary"}
                      </div>
                      <small className="text-muted">Type</small>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="view-btn btn btn-outline-primary btn-sm"
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(history)}
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
                  <p className="text-muted">No Medical History Records Found</p>
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

export default MedicalHistoryMobileView;