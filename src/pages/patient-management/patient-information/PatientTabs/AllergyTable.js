import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import Pagination from "../../../shared/Pagination";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLazyGetPatientAllergiesQuery } from "../../../../api/patientAllergiesApi";
import HighlightText from "../../../shared/HighlightText";
const allergenOptions = [
  { id: 12, label: "12 - Penicillin" },
  { id: 13, label: "13 - Peanuts" },
  { id: 14, label: "14 - Dust mites" },
  { id: 15, label: "15 - Shellfish" },
  { id: 16, label: "16 - Latex" },
  { id: 17, label: "17 - Aspirin" },
  { id: 18, label: "18 - Insect stings" },
];
const AllergyTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });

  const [orderBy, setOrderBy] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // RTK Query
  
  const [triggerGetAllergies, { 
    data: allergiesData, 
    isLoading, 
    isFetching, 
    error 
  }] = useLazyGetPatientAllergiesQuery(); 

  useEffect(() => {
    fetchAllergies();
  }, [currentPage, appliedFilters, orderBy]);

  const fetchAllergies = () => {
    const apiFilters = {
      ...appliedFilters,
      isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true :
                appliedFilters.isActive === "Inactive" ? false : undefined
    };

    triggerGetAllergies({
      patientId: PATIENT_ID,
      filter: apiFilters,
      orderBy: orderBy,
      pageNumber: currentPage,
      pageSize: pageSize
    });
  };

  
const handleSearch = (filters) => {
  setCurrentPage(1); // Reset to first page on new search
  if (filters && typeof filters === "object") {
    setAppliedFilters(filters);
    // to correct the currentFilters so that the UI remains synchronized:
    setCurrentFilters(filters);
  } else {
    setAppliedFilters(currentFilters); 
  }
};

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      isActive: "All",
      severity: "",
      dateNoted: ""
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setOrderBy(2);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedRecord({
      allergenId: null,
      allergenLabel: "",
      severity: "",
      isActive: true,
      dateNoted: "",
      reaction: "",
      notes: ""
    });
    setIsAddMode(true);
    setShowModal(true);
  };

  const handleEdit = (entry) => {
    setSelectedRecord({ ...entry });
    setIsAddMode(false);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  const handleConfirmDelete = () => {
    setShowPopup(false);
    setRecordToDelete(null);
    setShowModal(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  // Field mapping for highlight
  const fieldMapping = {
    allergenName: "AllergenName",
    reaction: "Reaction", 
    notes: "Notes"
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
          searchPlaceholder = "Search allergens..."
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
            filterStatus={currentFilters.isActive}
            setFilterStatus={(value) => setCurrentFilters(prev => ({ ...prev, isActive: value }))}
            filterSeverity={currentFilters.severity}
            setFilterSeverity={(value) => setCurrentFilters(prev => ({ ...prev, severity: value }))}
            filterDateFrom={currentFilters.dateNoted ? new Date(currentFilters.dateNoted) : null}
            setFilterDateFrom={(date) => setCurrentFilters(prev => ({ 
              ...prev, 
              dateNoted: date ? date.toISOString() : "" 
            }))}
            filterDateTo={null}
            setFilterDateTo={() => {}}
            onReset={handleResetFilters}
            onSearch={handleSearch} 
            conditions={allergiesData?.data || []}
            statusOptions={["All", "Active", "Inactive"]}
            severityOptions={["Mild", "Moderate", "Severe"]}
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
  {(isLoading || isFetching) ? (
    Array.from({ length: 5 }).map((_, index) => (
      <tr key={index}>
        <td><Skeleton width={120} height={15} /></td>
        <td><Skeleton width={80} height={15} /></td>
        <td><Skeleton width={60} height={15} /></td>
        <td><Skeleton width={100} height={15} /></td>
        <td><Skeleton width={150} height={15} /></td>
        <td><Skeleton width={200} height={15} /></td>
        <td><Skeleton width={80} height={15} /></td>
      </tr>
    ))
  ) : error ? (
    <tr>
      <td colSpan="7" className="text-center text-danger">
        ❌ {t('AllergyTable.loading_error')}
        <Button 
          variant="link" 
          onClick={fetchAllergies}
          className="p-0 ml-2"
        >
          {t('AllergyTable.retry')}
        </Button>
      </td>
    </tr>
  ) : allergiesData?.data && allergiesData.data.length > 0 ? (
    allergiesData.data.map((entry) => (
      <tr key={entry.id}>
        <td>
          <HighlightText
            text={entry.allergenName}
            searchTerm={allergiesData.searchTerm}
            matchedFields={entry.highlightInfo?.matchedFields || []}
            fieldName={fieldMapping.allergenName}
          />
        </td>
        <td>{t(`AllergyTable.severity_options.${entry.severity}`)}</td>
        <td>
          <span 
         
          >
            {entry.isActive ? 
              t('AllergyTable.active_options.Active') : 
              t('AllergyTable.active_options.Inactive')
            }
          </span>
        </td>
        <td>{formatDate(entry.dateNoted)}</td>
        <td>
          <HighlightText
            text={entry.reaction}
            searchTerm={allergiesData.searchTerm}
            matchedFields={entry.highlightInfo?.matchedFields || []}
            fieldName={fieldMapping.reaction}
          />
        </td>
        <td>
          {entry.notes ? (
            <HighlightText
              text={entry.notes.length > 50 ? 
                `${entry.notes.substring(0, 50)}...` : 
                entry.notes
              }
              searchTerm={allergiesData.searchTerm}
              matchedFields={entry.highlightInfo?.matchedFields || []}
              fieldName={fieldMapping.notes}
            />
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
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center text-muted">
        {appliedFilters.searchValue ? 
          t('AllergyTable.no_results_for_search', { search: appliedFilters.searchValue }) :
          t('AllergyTable.no_records_found')
        }
      </td>
    </tr>
  )}
</tbody>

            </Table>
          </div>

          {/* Pagination */}
          {allergiesData && allergiesData.data && allergiesData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={allergiesData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={allergiesData.totalPages || 1}
            />
          )}
        </div>
      </div>

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
  fields={[
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
  ]}
  title={isAddMode ? t('AllergyTable.add_allergen') : t('AllergyTable.edit_allergen')}
  dropdownOptions={allergenOptions}
  dropdownField="allergenId"
  dropdownLabel={t('AllergyTable.allergen')}
/>

      {/* Delete confirmation popup */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('AllergyTable.confirm_delete_title')}
          message={t('AllergyTable.confirm_delete_message', { 
            allergen: recordToDelete.allergenName || recordToDelete.allergenId 
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