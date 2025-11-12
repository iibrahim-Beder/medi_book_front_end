// AllergyMobileView.jsx
import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import ConditionsFilters from "./component/ConditionsFilters";
import Pagination from "../../../shared/Pagination";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLazyGetPatientAllergiesQuery } from "../../../../api/patientAllergiesApi";
import HighlightText from "../../../shared/HighlightText";
import ErrorLoding from "../../../shared/ErrorLoading"
const AllergyMobileView = () => {
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
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [triggerGetAllergies, { 
    data: allergiesData, 
    isLoading, 
    isFetching, 
    error 
  }] = useLazyGetPatientAllergiesQuery();

  const allergenOptions = [
    { id: 12, label: "12 - Penicillin" },
    { id: 13, label: "13 - Peanuts" },
    { id: 14, label: "14 - Dust mites" },
    { id: 15, label: "15 - Shellfish" },
    { id: 16, label: "16 - Latex" },
    { id: 17, label: "17 - Aspirin" },
    { id: 18, label: "18 - Insect stings" },
  ];

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
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      setAppliedFilters(filters);
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
    // Refresh data after save
    fetchAllergies();
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
    // Refresh data after delete
    fetchAllergies();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  // Toggle notes expansion 
  const toggleNotes = (allergyId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [allergyId]: !prev[allergyId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const fieldMapping = {
    allergenName: "AllergenName",
    reaction: "Reaction", 
    notes: "Notes"
  };

  // Skeleton loader for mobile
  const renderSkeletonCards = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="mobile-view-card">
        <Card.Body style={{ padding: "15px" }}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Skeleton width={150} height={20} />
          </div>
          <div className="mb-2">
            <Skeleton width={100} height={15} />
            <Skeleton width={200} height={15} />
          </div>
          <div className="mb-2">
            <Skeleton width={80} height={15} />
            <Skeleton width={230} height={15} />
            <Skeleton width={200} height={15} />
          </div>
          <div className="row text-center mb-3">
            <div className="col-4">
              <Skeleton width={60} height={20} />
              <Skeleton width={50} height={15} />
            </div>
            <div className="col-4">
              <Skeleton width={80} height={20} />
              <Skeleton width={70} height={15} />
            </div>
            <div className="col-4">
              <Skeleton width={50} height={20} />
              <Skeleton width={40} height={15} />
            </div>
          </div>
          <div style={{textAlign:"end"}}>
          <Skeleton width={80} height={30} /></div>
        </Card.Body>
      </Card>
    ));
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
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchPlaceholder="Search allergens..."
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

          {/* Mobile Cards */}
          <div className="space-y-3">
            {(isLoading || isFetching) ? (
              renderSkeletonCards()
            ) : error ? (
              <Card className="text-center py-5">
                <Card.Body>
                    <ErrorLoding 
                    isError={error}
                      refetch={fetchAllergies}
                    />
                </Card.Body>
              </Card>
            ) : allergiesData?.data && allergiesData.data.length > 0 ? (
              allergiesData.data.map((entry) => {
                const isNotesExpanded = expandedNotes[entry.id];
                
                return (
                  <Card
                    key={entry.id}
                    className="mobile-view-card"
                  >
                    <Card.Body style={{ padding: "15px" }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 style={{ margin: 0 }}>
                          <HighlightText
                            text={entry.allergenName}
                            searchTerm={allergiesData.searchTerm}
                            matchedFields={entry.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.allergenName}
                          />
                        </h5>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("AllergyMobileView.reaction")}:
                        </small>
                        <p className="mb-1">
                          <HighlightText
                            text={entry.reaction}
                            searchTerm={allergiesData.searchTerm}
                            matchedFields={entry.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.reaction}
                          />
                        </p>
                      </div>

                      {/* Notes Section with Expand/Collapse */}
                      {entry.notes && (
                        <div className="mb-2">
                          <small
                            onClick={() => toggleNotes(entry.id)}
                            className="text-muted d-flex mb-1"
                            style={{ cursor: "pointer" }}
                          >
                            {t('AllergyMobileView.notes')} :
                            <button
                              className=""
                              onClick={() => toggleNotes(entry.id)}
                              style={{
                                fontSize: '20px',
                                color: '#278fff',
                                padding: "3px 0 0"
                              }}
                            >
                              <MdExpandMore
                                onClick={() => toggleNotes(entry.id)}
                                style={{
                                  transform: isNotesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease',
                                }}
                              />
                            </button>
                          </small>
                          <div className={`expandable-content ${isNotesExpanded ? '' : 'p-0'}`}>
                            <p
                              style={{
                                margin: "0",
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onClick={() => toggleNotes(entry.id)}
                            >
                              {isNotesExpanded ? (
                                <HighlightText
                                  text={entry.notes}
                                  searchTerm={allergiesData.searchTerm}
                                  matchedFields={entry.highlightInfo?.matchedFields || []}
                                  fieldName={fieldMapping.notes}
                                />
                              ) : ""}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div className="border-end">
                            <div className="fw-bold text-primary">
                              {t(`AllergyMobileView.severity_options.${entry.severity}`)}
                            </div>
                            <small className="text-muted">
                              {t("AllergyMobileView.severity")}
                            </small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-primary">
                            {formatDate(entry.dateNoted)}
                          </div>
                          <small className="text-muted">
                            {t("AllergyMobileView.date_noted")}
                          </small>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-primary">
                            {entry.isActive
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
                          onClick={() => handleEdit(entry)}
                        >
                          {t("AllergyMobileView.manage")}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">
                    {appliedFilters.searchValue ? 
                      t('AllergyTable.no_results_for_search', { search: appliedFilters.searchValue }) :
                      t("AllergyMobileView.no_records_found")
                    }
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      {allergiesData && allergiesData.data && allergiesData.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={allergiesData.totalCount || 0}
          rowsPerPage={pageSize}
          onPageChange={setCurrentPage}
          totalPages={allergiesData.totalPages || 1}
        />
      )}

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

export default AllergyMobileView;