// MedicalHistoryMobileView.jsx
import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import MedicalHistoryModal from "./component/MedicalHistoryModal";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shared/Pagination";
import PopupMessage from "../../../shared/PopupMessage";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";

const MedicalHistoryMobileView = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});

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
      notes: "Successful surgery with no complications. Patient recovered well with minimal scarring. Follow-up appointments completed without issues.",
    },
    {
      id: 2,
      historyType: HistoryType.Accident,
      hereditaryDisease: "",
      description: "Car accident with minor injuries",
      dateOfEvent: "2021-11-02",
      relatedPerson: null,
      notes: "Recovered after 2 weeks with physical therapy. No long-term complications observed. Regular check-ups showed complete healing.",
    },
    {
      id: 3,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: "Heart Disease", 
      description: "Father had heart disease",
      dateOfEvent: "2020-01-01",
      relatedPerson: "Father",
      notes: "Family-related record. Father diagnosed with coronary artery disease at age 55. Regular cardiac screening recommended for patient.",
    },
    {
      id: 4,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: "Diabetes",
      description: "Mother has diabetes",
      dateOfEvent: "2019-05-10",
      relatedPerson: "Mother",
      notes: "Type 2 diabetes diagnosed at age 45. Mother manages condition with medication and diet. Patient advised to maintain healthy lifestyle.",
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
      const updatedData = medicalHistory.filter(
        item => item.id !== recordToDelete.id
      );
      setMedicalHistory(updatedData);
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

  // Toggle notes expansion
  const toggleNotes = (historyId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [historyId]: !prev[historyId]
    }));
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

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t('MedicalHistoryMobileView.table_title')}</h3>
          <h6 className="table-subtitle">{t('MedicalHistoryMobileView.table_subtitle')}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('MedicalHistoryMobileView.add_condition')}
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
            {currentData.map((history) => {
              const isNotesExpanded = expandedNotes[history.id];
              
              return (
                <Card key={history.id} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ margin: 0 }}>{history.historyType}</h5>
                    </div>

                    {history.hereditaryDisease && (
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("MedicalHistoryMobileView.hereditary_disease")}:
                        </small>
                        <p className="mb-1">{history.hereditaryDisease}</p>
                      </div>
                    )}

                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">
                        {t("MedicalHistoryMobileView.description")}:
                      </small>
                      <p className="mb-1">{history.description}</p>
                    </div>

                    {history.relatedPerson && (
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("MedicalHistoryMobileView.related_person")}:
                        </small>
                        <p className="mb-1">{history.relatedPerson}</p>
                      </div>
                    )}

                    {/* Notes Section with Expand/Collapse */}
                    {history.notes && (
                      <div className="mb-2">
                        <small
                          className="text-muted d-flex mb-1"
                          onClick={() => toggleNotes(history.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {t("MedicalHistoryMobileView.notes")} :
                          <button
                            className=""
                            onClick={() => toggleNotes(history.id)}
                            style={{
                              fontSize: "20px",
                              color: "#278fff",
                              padding: "3px 0 0",
                            }}
                          >
                            <MdExpandMore
                              onClick={() => toggleNotes(history.id)}
                              style={{
                                transform: expandedNotes[history.id]
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </button>
                        </small>
                        <div
                          className={`expandable-content ${
                            expandedNotes[history.id] ? "" : "p-0"
                          }`}
                        >
                          <p
                            style={{
                              margin: "0",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => toggleNotes(history.id)}
                          >
                            {expandedNotes[history.id] ? history.notes : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="row text-center mb-3">
                      <div className="col-6">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {formatDate(history.dateOfEvent)}
                          </div>
                          <small className="text-muted">
                            {t("MedicalHistoryMobileView.date_of_event")}
                          </small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="fw-bold text-primary">
                          {history.hereditaryDisease
                            ? t("MedicalHistoryMobileView.hereditary")
                            : t("MedicalHistoryMobileView.non_hereditary")}
                        </div>
                        <small className="text-muted">
                          {t("MedicalHistoryMobileView.type")}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 1 }}></div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(history)}
                      >
                        {t("MedicalHistoryMobileView.manage")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t('MedicalHistoryMobileView.no_records_found')}</p>
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
        onDelete={handleDeleteInModal}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        hereditaryDiseases={hereditaryDiseases}
        isEdit={isAddMode}
        title={isAddMode ? t('MedicalHistoryMobileView.add_medical_history') : t('MedicalHistoryMobileView.edit_medical_history')}
      />

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('MedicalHistory.confirm_delete_title')}
          message={t('MedicalHistory.confirm_delete_message', { 
            description: recordToDelete.description 
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

export default MedicalHistoryMobileView;  