// AllergenTable.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shareds/DynamicEditModal";
import Pagination from "../../../shareds/Pagination";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shareds/PopupMessage";

const AllergyTable = () => {
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
  // 
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
      label: t('AllergyTable.severity'), 
      type: "select", 
      options: [
        { value: "Mild", label: t('AllergyTable.severity_options.Mild') },
        { value: "Moderate", label: t('AllergyTable.severity_options.Moderate') }, 
        { value: "Severe", label: t('AllergyTable.severity_options.Severe') }
      ], 
      placeholder: t('AllergyTable.select_severity') 
    },
    { 
      name: "isActive", 
      label: t('AllergyTable.active'), 
      type: "select", 
      options: [
        { value: true, label: t('AllergyTable.active_options.Active') },
        { value: false, label: t('AllergyTable.active_options.Inactive') }
      ], 
      placeholder: t('AllergyTable.select_active_status') 
    },
    { name: "dateNoted", label: t('AllergyTable.date_noted'), type: "date", placeholder: t('AllergyTable.select_date') },
    { name: "reaction", label: t('AllergyTable.reaction'), type: "text", placeholder: t('AllergyTable.enter_reaction') },
    { name: "notes", label: t('AllergyTable.notes'), type: "textarea", placeholder: t('AllergyTable.enter_notes') },
  ];

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

  // إغلاق الـ popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  // تعديل الـ modal ليدعم الحذف
  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      // setShowModal(false);
      setShowPopup(true);
    }
  };
 



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
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t('AllergyTable.table_title')}</h3>
          <h6 className="table-subtitle">{t('AllergyTable.table_subtitle')}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('AllergyTable.add_allergen')}
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
                  <th>{t('AllergyTable.allergen')}</th>
                  <th>{t('AllergyTable.severity')}</th>
                  <th>{t('AllergyTable.active')}</th>
                  <th>{t('AllergyTable.date_noted')}</th>
                  <th>{t('AllergyTable.reaction')}</th>
                  <th>{t('AllergyTable.notes')}</th>
                  <th>{t('AllergyTable.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((entry) => (
                    <tr key={entry.allergenId ?? entry.allergenLabel}>
                      <td>{entry.allergenLabel ?? String(entry.allergenId)}</td>
                      <td>{t(`AllergyTable.severity_options.${entry.severity}`)}</td>
                      <td>{entry.isActive ? t('AllergyTable.active_options.Active') : t('AllergyTable.active_options.Inactive')}</td>
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
                          {t('AllergyTable.manage')}
                        </Button>
                         {/* <Button
                          // className="delete-btn"
                          variant=""
                          size="sm"
                          style={{ color: "#dc3545", backgroundColor: "transparent" }}
                          onClick={() => handleDeleteClick(entry)}
                        >
                          {t('Delete')}
                        </Button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      {t('AllergyTable.no_records_found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={allergens.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modal for add/edit */}
      <DynamicEditModal
      addMode={isAddMode}
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
        title={isAddMode ? t('AllergyTable.add_allergen') : t('AllergyTable.edit_allergen')}
        dropdownOptions={allergenOptions}
        dropdownField="allergenId"
        dropdownLabel={t('AllergyTable.allergen')}
      />
       {/* Popup تأكيد الحذف */}
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

export default AllergyTable;