import React from "react";
import { Table, Button } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import MedicalHistoryModal from "../component/MedicalHistoryModal";
import Pagination from "../../../../shared/Pagination";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../../Patient-management.css";
import PopupMessage from "../../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../shared/HighlightText";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import ErrorLoading from "../../../../shared/ErrorLoading";
import { useMedicalHistory } from "./useMedicalHistoryOperations";
import { medicalHistoryHelpers } from "./MedicalHistoryHelpers";
import { formatDate } from "../../../../shared/utils";

const MedicalHistoryTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedRow,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    showPopup,
    selectedRecord,
    recordToDelete,
    isAddMode,
    medicalHistoryData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNew,
    handleEdit,
    handleDeleteInModal,
    handleClosePopup,
    handleExpandClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch
  } = useMedicalHistory(false);

  const {
    truncateText,
    needsExpand,
    historyTypes,
    hereditaryDiseases,
    fieldMapping,
  } = medicalHistoryHelpers(t);

   

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
      <div className="">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterType={currentFilters.historyType}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, historyType: value }))}
              filterDateFrom={currentFilters.dateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, dateFrom: date }))}
              filterDateTo={currentFilters.dateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, dateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={medicalHistoryData?.data || []}
              filterConfigs={[
                {
                  name: "historyType",
                  label: "History Type",
                  data: historyTypes,
                },
              ]}
            />
          </div>
          {/* Data Table */}
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
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
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
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : medicalHistoryData?.data && medicalHistoryData.data.length > 0 ? (
                  medicalHistoryData.data.map((history) => (
                    <React.Fragment key={history.id}>
                      <tr>
                        <td>
                          <span
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {t(`MedicalHistory.history_type_options.${history.historyType}`)}
                          </span>
                        </td>
                        <td title={history.hereditaryDisease.name}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              <HighlightText
                                text={truncateText(history.hereditaryDisease.name || "-", 50)}
                                searchTerm={medicalHistoryData.searchTerm}
                                matchedFields={history.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.hereditaryDiseaseName}
                              />
                            </span>
                            {needsExpand(history.hereditaryDisease.name, 50) && (
                              <Button
                                className="view-btn ms-2"
                                size="sm"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#278fff",
                                  padding: 0,
                                  fontSize: "19px",
                                  height: "20px",
                                }}
                                onClick={() => handleExpandClick(history.id, 'hereditary')}
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === `${history.id}-hereditary`
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td title={history.description}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              <HighlightText
                                text={truncateText(history.description || "-", 50)}
                                searchTerm={medicalHistoryData.searchTerm}
                                matchedFields={history.highlightInfo?.matchedFields || []}
                                fieldName={fieldMapping.description}
                              />
                            </span>
                            {needsExpand(history.description, 50) && (
                              <Button
                                className="view-btn ms-2"
                                size="sm"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#278fff",
                                  padding: 0,
                                  fontSize: "19px",
                                  height: "20px",
                                }}
                                onClick={() => handleExpandClick(history.id, 'description')}
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === `${history.id}-description`
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
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
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
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
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#278fff",
                                  padding: 0,
                                  fontSize: "19px",
                                  height: "20px",
                                }}
                                onClick={() => handleExpandClick(history.id, 'notes')}
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === `${history.id}-notes`
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
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

                      {/* Expanded rows */}
                      {expandedRow === `${history.id}-hereditary` && needsExpand(history.hereditaryDisease.name, 50) && (
                        <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                          <td colSpan="9" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("MedicalHistory.hereditary_disease")}
                                value={history.hereditaryDisease.name}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}

                      {expandedRow === `${history.id}-description` && needsExpand(history.description, 50) && (
                        <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                          <td colSpan="9" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("MedicalHistory.description")}
                                value={history.description}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}

                      {expandedRow === `${history.id}-notes` && needsExpand(history.notes, 80) && (
                        <tr className="table-active-content" style={{ backgroundColor: "transparent" }}>
                          <td colSpan="9" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("MedicalHistory.notes")}
                                value={history.notes}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      {appliedFilters.searchValue ?
                        t('MedicalHistory.no_results_for_search', { search: appliedFilters.searchValue }) :
                        t('MedicalHistory.no_records_found')
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {/* Pagination */}
          {medicalHistoryData && medicalHistoryData.data && medicalHistoryData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={medicalHistoryData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={medicalHistoryData.totalPages || 1}
            />
          )}
        </div>
      </div>
      {/* Modal for Add/Edit */}
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
        title={isAddMode ? t('MedicalHistory.add_history') : t('MedicalHistory.edit_history')}
      />
      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('MedicalHistory.confirm_delete_title')}
          message={t('MedicalHistory.confirm_delete_message', {
            description: recordToDelete.historyType
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
              variant: "danger",
              disabled: isDeleting
            }
          ]}
          onClose={handleClosePopup}
          />
        )}
    </div>
  );
};

export default MedicalHistoryTable;