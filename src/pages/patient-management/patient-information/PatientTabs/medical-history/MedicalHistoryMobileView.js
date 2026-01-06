// MedicalHistoryMobileView.jsx
import { Card, Button } from "react-bootstrap";
import MedicalHistoryModal from "../component/MedicalHistoryModal";
import ConditionsFilters from "../component/ConditionsFilters";
import Pagination from "../../../../shared/Pagination";
import PopupMessage from "../../../../shared/PopupMessage";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "../../../Patient-management.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../shared/ErrorLoading";
import HighlightText from "../../../../shared/HighlightText";
import { useMedicalHistory } from "./useMedicalHistoryOperations";
import { medicalHistoryHelpers } from "./MedicalHistoryHelpers";
import { formatDate } from "../../../../shared/utils";
import { useEffect } from "react";

const MedicalHistoryMobileView = () => {

  const { t } = useTranslation();
  const {
    // State
    currentFilters,setExpandedNotes,
    setExpandedDiscription,

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
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    // Helpers
    expandedNotes,
    toggleNotes,
    expandedDescription,
    toggleDescription
  } = useMedicalHistory(true);

  const {
    historyTypes,
    hereditaryDiseases,
    fieldMapping,
  } = medicalHistoryHelpers(t);
  useEffect(() => {
    if (!medicalHistoryData?.data?.length) return;
  
    medicalHistoryData.data.forEach(item => {
      const fields = item.highlightInfo?.matchedFields || [];
  
      fields.forEach(match => {
        if (match.field === "Description") {
          setExpandedDiscription(prev => ({
            ...prev,
            [item.id]: true
          }));
        }
  
        if (match.field === "Notes") {
          setExpandedNotes(prev => ({
            ...prev,
            [item.id]: true
          }));
        }
      });
    });
  }, [medicalHistoryData]);
  // if (isLoading || isFetching) {
  //   return (
  //     <div className="table-container mobile-view-card p-3">
  //       {Array.from({ length: 5 }).map((_, i) => (
  //         <Card key={i} className="mb-3">
  //           <Card.Body>
  //             <Skeleton height={20} width="60%" />
  //             <Skeleton height={15} count={4} className="mt-2" />
  //           </Card.Body>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="p-4 text-center">
        <ErrorLoading isError={error} refetch={refetch} />
      </div>
    );
  }

  const hasData = medicalHistoryData?.data && medicalHistoryData.data.length > 0;

  return (
    <div className="table-container mobile-view-card">
      {/* Header */}
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
        {/* Filters */}
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


      { isLoading || isFetching ? (
      <div className="table-container mobile-view-card p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="mb-3">
            <Card.Body>
              <Skeleton height={20} width="60%" />
              <Skeleton height={15} count={4} className="mt-2" />
            </Card.Body>
          </Card>
        ))}
      </div>
    ) : (



    <div className="p-2">
      

        {/* Cards List */}
        <div className="space-y-3">
          {hasData ? (
            medicalHistoryData.data.map((history) => {
              return (
                <Card key={history.id} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    {/* Header with History Type and Manage Button */}
                    <div className="custom-card-title">
                      <h5 style={{ margin: 0 }}>
                        {/* {t(
                          `MedicalHistory.history_type_options.${history.historyType}`
                        )} */}
                      <HighlightText
                      text={history.historyType}
                      searchTerm={medicalHistoryData.searchTerm}
                      matchedFields={history.highlightInfo?.matchedFields || []}
                      fieldName={fieldMapping.historyType}
                      />
                      </h5>
                  {history.createdAt && (<div className="created-date small"><small>Created:</small><small className="text-muted d-block">{formatDate(history.createdAt)}</small></div>)}
                    </div>
                    {/* Hereditary Disease */}
                    {history.hereditaryDisease.name && (
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("MedicalHistory.hereditary_disease")}:
                        </small>
                        <div className="d-flex align-items-start">
                          <p className="mb-1 flex-grow-1">
                            <HighlightText
                              text={history.hereditaryDiseaseName}
                              searchTerm={medicalHistoryData.searchTerm}
                              matchedFields={
                                history.highlightInfo?.matchedFields || []
                              }
                              fieldName={fieldMapping.hereditaryDiseaseName}
                            />
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Related Person */}
                    {history.relatedPerson && (
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {t("MedicalHistory.related_person")}:
                        </small>
                        <p className="mb-1">
                          <HighlightText
                            text={history.relatedPerson}
                            searchTerm={medicalHistoryData.searchTerm}
                            matchedFields={
                              history.highlightInfo?.matchedFields || []
                            }
                            fieldName={fieldMapping.relatedPerson}
                          />
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {history.description && (
                      <div className="mb-2">
                        <small
                          className="text-muted d-flex mb-1"
                          onClick={() => toggleDescription(history.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {t("MedicalHistory.description")} :
                          <button
                            className=""
                            onClick={() => toggleDescription(history.id)}
                            style={{
                              fontSize: "20px",
                              color: "#278fff",
                              padding: "3px 0 0",
                            }}
                          >
                            <MdExpandMore
                              onClick={() => toggleDescription(history.id)}
                              style={{
                                transform: expandedDescription[history.id]
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </button>
                        </small>

                        <div
                          className={`expandable-content ${
                            expandedDescription[history.id] ? "" : "p-0"
                          }`}
                        >
                          <p
                            style={{
                              margin: 0,
                              transition: "all 0.3s ease",
                            }}
                            // onClick={() => toggleDescription(history.id)}
                          >
                            {expandedDescription[history.id] ? (
                              <HighlightText
                                text={history.description}
                                searchTerm={medicalHistoryData.searchTerm}
                                matchedFields={
                                  history.highlightInfo?.matchedFields || []
                                }
                                fieldName={fieldMapping.description}
                              />
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date and Type Row */}
                    <div className="row text-center mb-3">
                      <div className="col-6">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {formatDate(history.dateOfEvent)}
                          </div>
                          <small className="text-muted">
                            {t("MedicalHistory.date_of_event")}
                          </small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="fw-bold text-primary">
                          {history.hereditaryDisease.name
                            ? t("MedicalHistory.hereditary")
                            : t("MedicalHistory.non_hereditary")}
                        </div>
                        <small className="text-muted">
                          {t("MedicalHistory.type")}
                        </small>
                      </div>
                    </div>

                    {/* Notes */}
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
                              transition: "all 0.3s ease",
                            }}
                            // onClick={() => toggleNotes(history.id)}
                          >
                            {expandedNotes[history.id] ? (
                              <HighlightText
                                text={history.notes}
                                searchTerm={medicalHistoryData.searchTerm}
                                matchedFields={
                                  history.highlightInfo?.matchedFields || []
                                }
                                fieldName={fieldMapping.notes}
                              />
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Manage Button at Bottom */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 1 }}></div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(history)}
                      >
                        {t("Manage")}
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
                  {appliedFilters.searchValue
                    ? t('MedicalHistory.no_results_for_search', { search: appliedFilters.searchValue })
                    : t('MedicalHistory.no_records_found')
                  }
                </p>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {hasData && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={medicalHistoryData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={medicalHistoryData.totalPages || 1}
            />
          </div>
        )}
      </div>
    )
  }

      {/* Modal */}
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

      {/* Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('MedicalHistory.confirm_delete_title')}
          message={t('MedicalHistory.confirm_delete_message', {
            description: t(`MedicalHistory.history_type_options.${recordToDelete.historyType}`)
          })}
          buttons={[
            { text: t('Cancel'), onClick: handleClosePopup, variant: "secondary" },
            { text: t('Delete'), onClick: handleConfirmDelete, variant: "danger", disabled: isDeleting }
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default MedicalHistoryMobileView;