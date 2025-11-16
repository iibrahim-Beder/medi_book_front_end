import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import MedicalHistoryModal from "./component/MedicalHistoryModal";
import Pagination from "../../../shared/Pagination";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetPatientMedicalHistoryQuery } from "../../../../api/medicalHistoryApi";
import HighlightText from "../../../shared/HighlightText";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import ErrorLoading from "../../../shared/ErrorLoading";

const MedicalHistoryTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;
  const [expandedRow, setExpandedRow] = useState(null);

  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const [currentFilters, setCurrentFilters] = useState({
    historyType: "",
    dateFrom: null,
    dateTo: null
  });

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // queryArgs يجمع كل شيء
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...currentFilters,
      dateFrom: formatDateForAPI(currentFilters.dateFrom),
      dateTo: formatDateForAPI(currentFilters.dateTo),
    };

    if (appliedSearch) {
      apiFilters.searchValue = appliedSearch;
    }

    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [currentFilters, appliedSearch, currentPage]);

  const {
    data: medicalHistoryData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientMedicalHistoryQuery(queryArgs, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: false,
  });

  const triggerRefetch = () => refetch();

  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCurrentFilters({
      historyType: "",
      dateFrom: null,
      dateTo: null
    });
    setSearchInput("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  const emptyRecord = {
    historyType: "",
    hereditaryDiseaseName: "",
    description: "",
    dateOfEvent: "",
    relatedPerson: "",
    notes: ""
  };

  const fieldMapping = {
    description: "Description",
    hereditaryDiseaseName: "HereditaryDiseaseName",
    relatedPerson: "RelatedPerson",
    notes: "Notes"
  };

  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  const handleEdit = (history) => {
    setSelectedRecord({ ...history });
    setIsAddMode(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!selectedRecord) return;
    console.log('Saving medical history record:', selectedRecord);
    setShowModal(false);
    setSelectedRecord(null);
    triggerRefetch();
  };

  const handleDeleteClick = (history) => {
    setRecordToDelete(history);
    setShowPopup(true);
  };

  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      console.log('Deleting medical history record:', recordToDelete);
      setShowPopup(false);
      setRecordToDelete(null);
      setShowModal(false);
      triggerRefetch();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleExpandClick = (id, field) => {
    const key = `${id}-${field}`;
    setExpandedRow(prev => prev === key ? null : key);
  };

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  const needsExpand = (text, maxLength = 70) => {
    return text && text.length > maxLength;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const historyTypes = [
    { key: "Surgery", label: t("Surgery") },
    { key: "FamilyHistory", label: t("FamilyHistory") },
    { key: "Hospitalization", label: t("Hospitalization") },
    { key: "Vaccination", label: t("Vaccination") },
    { key: "Accident", label: t("Accident") },
    { key: "Others", label: t("Others") }
  ];

  const hereditaryDiseases = [
    t("Diabetes"), t("Heart Disease"), t("Cancer"), t("Hypertension"),
    t("Asthma"), t("Mental Health Disorders"), t("Other")
  ];

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Medical History")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('MedicalHistory.add_history')}
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="mb-3 p-3">
          <ConditionsFilters
            searchTerm={searchInput}
            setSearchTerm={setSearchInput}
            filterType={currentFilters.historyType}
            setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, historyType: value }))}
            filterDateFrom={currentFilters.dateFrom}
            setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, dateFrom: date }))}
            filterDateTo={currentFilters.dateTo}
            setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, dateTo: date }))}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={medicalHistoryData?.data || []}
            filterConfigs={[{ name: "historyType", label: "History Type", data: historyTypes }]}
          />
        </div>

        <div style={{ overflow: "auto" }}>
          <Table className="data-table align-middle mb-0 table-hover">
            <thead>
              <tr>
                <th>{t("MedicalHistory.history_type")}</th>
                <th>{t("MedicalHistory.hereditary_disease")}</th>
                <th>{t("MedicalHistory.description")}</th>
                <th>{t("MedicalHistory.date_of_event")}</th>
                <th>{t("MedicalHistory.related_person")}</th>
                <th>{t("MedicalHistory.notes")}</th>
                <th>{t("created_at")}</th>
                <th>{t("updated_at")}</th>
                <th>{t("MedicalHistory.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading || isFetching) ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width={120} height={15} /></td>
                    <td><Skeleton width={100} height={15} /></td>
                    <td><Skeleton width={150} height={15} /></td>
                    <td><Skeleton width={100} height={15} /></td>
                    <td><Skeleton width={100} height={15} /></td>
                    <td><Skeleton width={150} height={15} /></td>
                    <td><Skeleton width={100} height={15} /></td>
                    <td><Skeleton width={100} height={15} /></td>
                    <td><Skeleton width={80} height={15} /></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="9" className="text-center text-danger">
                    <ErrorLoading isError={error} refetch={refetch} />
                  </td>
                </tr>
              ) : medicalHistoryData?.data?.length > 0 ? (
                medicalHistoryData.data.map((history) => (
                  <React.Fragment key={history.id}>
                    <tr>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {t(`MedicalHistory.history_type_options.${history.historyType}`)}
                        </span>
                      </td>

                      <td title={history.hereditaryDiseaseName}>
                        <div className="d-flex align-items-center">
                          <span className="text-truncate" style={{ maxWidth: 250 }}>
                            <HighlightText
                              text={truncateText(history.hereditaryDiseaseName || "-", 50)}
                              searchTerm={medicalHistoryData.searchTerm}
                              matchedFields={history.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.hereditaryDiseaseName}
                            />
                          </span>
                          {needsExpand(history.hereditaryDiseaseName, 50) && (
                            <Button
                              className="view-btn ms-2"
                              size="sm"
                              style={{ background: "transparent", color: "#278fff", padding: 0, fontSize: 19, height: 20 }}
                              onClick={() => handleExpandClick(history.id, 'hereditary')}
                            >
                              <MdExpandMore
                                style={{
                                  transform: expandedRow === `${history.id}-hereditary` ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "0.3s"
                                }}
                              />
                            </Button>
                          )}
                        </div>
                      </td>

                      <td title={history.description}>
                        <div className="d-flex align-items-center">
                          <span className="text-truncate" style={{ maxWidth: 250 }}>
                            <HighlightText
                              text={truncateText(history.description, 50)}
                              searchTerm={medicalHistoryData.searchTerm}
                              matchedFields={history.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.description}
                            />
                          </span>
                          {needsExpand(history.description, 50) && (
                            <Button
                              className="view-btn ms-2"
                              size="sm"
                              style={{ background: "transparent", color: "#278fff", padding: 0, fontSize: 19, height: 20 }}
                              onClick={() => handleExpandClick(history.id, 'description')}
                            >
                              <MdExpandMore
                                style={{
                                  transform: expandedRow === `${history.id}-description` ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "0.3s"
                                }}
                              />
                            </Button>
                          )}
                        </div>
                      </td>

                      <td>{formatDate(history.dateOfEvent)}</td>

                      <td>
                        <HighlightText
                          text={history.relatedPerson || "-"}
                          searchTerm={medicalHistoryData.searchTerm}
                          matchedFields={history.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.relatedPerson}
                        />
                      </td>

                      <td title={history.notes}>
                        <div className="d-flex align-items-center">
                          <span className="text-truncate" style={{ maxWidth: 250 }}>
                            {history.notes ? (
                              <HighlightText
                                text={truncateText(history.notes, 80)}
                                searchTerm={medicalHistoryData.searchTerm}
                                matchedFields={history.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.notes}
                              />
                            ) : "-"}
                          </span>
                          {needsExpand(history.notes, 80) && (
                            <Button
                              className="view-btn ms-2"
                              size="sm"
                              style={{ background: "transparent", color: "#278fff", padding: 0, fontSize: 19, height: 20 }}
                              onClick={() => handleExpandClick(history.id, 'notes')}
                            >
                              <MdExpandMore
                                style={{
                                  transform: expandedRow === `${history.id}-notes` ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "0.3s"
                                }}
                              />
                            </Button>
                          )}
                        </div>
                      </td>

                      <td>{formatDate(history.createdAt)}</td>
                      <td>{formatDate(history.updatedAt)}</td>

                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            className="view-btn"
                            variant=""
                            size="sm"
                            style={{ color: "#007bff", backgroundColor: "transparent" }}
                            onClick={() => handleEdit(history)}
                          >
                            {t("Manage")}
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Rows */}
                    {expandedRow === `${history.id}-hereditary` && needsExpand(history.hereditaryDiseaseName, 50) && (
                      <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                        <td colSpan="9" className="border-0">
                          <div className="description-expanded-section">
                            <TextAreaField label={t("MedicalHistory.hereditary_disease")} value={history.hereditaryDiseaseName} disabled />
                          </div>
                        </td>
                      </tr>
                    )}

                    {expandedRow === `${history.id}-description` && needsExpand(history.description, 50) && (
                      <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                        <td colSpan="9" className="border-0">
                          <div className="description-expanded-section">
                            <TextAreaField label={t("MedicalHistory.description")} value={history.description} disabled />
                          </div>
                        </td>
                      </tr>
                    )}

                    {expandedRow === `${history.id}-notes` && needsExpand(history.notes, 80) && (
                      <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                        <td colSpan="9" className="border-0">
                          <div className="description-expanded-section">
                            <TextAreaField label={t("MedicalHistory.notes")} value={history.notes} disabled />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    {appliedSearch
                      ? t('MedicalHistory.no_results_for_search', { search: appliedSearch })
                      : t('MedicalHistory.no_records_found')}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {medicalHistoryData?.data?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={medicalHistoryData.totalCount || 0}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={medicalHistoryData.totalPages || 1}
          />
        )}
      </div>

      {/* Modal & Popup */}
      <MedicalHistoryModal
        show={showModal}
        onClose={() => { setShowModal(false); setSelectedRecord(null); }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        hereditaryDiseases={hereditaryDiseases}
        isEdit={isAddMode}
        title={isAddMode ? t('MedicalHistory.add_history') : t('MedicalHistory.edit_history')}
      />

      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('MedicalHistory.confirm_delete_title')}
          message={t('MedicalHistory.confirm_delete_message', { description: recordToDelete.description })}
          buttons={[
            { text: t('Cancel'), onClick: handleClosePopup, variant: "secondary" },
            { text: t('Delete'), onClick: handleConfirmDelete, variant: "danger" }
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default MedicalHistoryTable;