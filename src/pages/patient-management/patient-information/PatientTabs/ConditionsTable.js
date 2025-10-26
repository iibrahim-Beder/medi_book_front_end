import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import MedicalHistoryModal from "./component/MedicalHistoryModal"; 
import "../../Patient-management.css";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shared/Pagination";
import { useTranslation } from "react-i18next";

const MedicalHistoryTable = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const rowsPerPage = 4;

  
  const HistoryType = {
    All: t("All"),
    Surgery: t("Surgery"),
    Accident: t("Accident"), 
    Hospitalization: t("Hospitalization"),
    FamilyHistory: t("FamilyHistory"),
    Vaccination: t("Vaccination"),
    Others: t("Others")
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
    t("Diabetes"),
    t("Heart Disease"), 
    t("Cancer"),
    t("Hypertension"),
    t("Asthma"),
    t("Mental Health Disorders"),
    t("Other")
  ];

  // Mock Data 
  const [medicalHistory, setMedicalHistory] = useState([
    {
      id: 1,
      historyType: HistoryType.Surgery,
      hereditaryDisease: "",
      description: t("Appendix removal"),
      dateOfEvent: "2022-03-15",
      relatedPerson: null,
      notes: t("Successful surgery with no complications."),
    },
    {
      id: 2,
      historyType: HistoryType.Accident,
      hereditaryDisease: "",
      description: t("Car accident with minor injuries"),
      dateOfEvent: "2021-11-02",
      relatedPerson: null,
      notes: t("Recovered after 2 weeks."),
    },
    {
      id: 3,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: t("Heart Disease"), 
      description: t("Father had heart disease"),
      dateOfEvent: "2020-01-01",
      relatedPerson: t("Father"),
      notes: t("Family-related record"),
    },
    {
      id: 4,
      historyType: HistoryType.FamilyHistory,
      hereditaryDisease: t("Diabetes"),
      description: t("Mother has diabetes"),
      dateOfEvent: "2019-05-10",
      relatedPerson: t("Mother"),
      notes: t("Type 2 diabetes diagnosed at age 45"),
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
    
    console.log(t("Saved record:"), selectedRecord);
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
          <h3 className="table-title">{t("Medical History")}</h3>
          <h6 className="table-subtitle">{t("Ahmed Mohamed Ali")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("Add Condition")}
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
                  <th>{t("History Type")}</th>
                  <th>{t("Hereditary Disease")}</th>
                  <th>{t("Description")}</th>
                  <th>{t("Date of Event")}</th>
                  <th>{t("Related Person")}</th>
                  <th>{t("Notes")}</th>
                  <th>{t("Actions")}</th>
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
                          {t("Manage")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      {t("No medical history records found.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

      <Pagination
  currentPage={currentPage}
  totalItems={filteredData.length}
  rowsPerPage={rowsPerPage}
  onPageChange={setCurrentPage}
/>

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
        title={isAddMode ? t("Add Medical History") : t("Edit Medical History")}
      />
    </div>
  );
};

export default MedicalHistoryTable;