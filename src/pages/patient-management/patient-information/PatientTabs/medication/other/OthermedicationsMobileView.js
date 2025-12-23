import { Card } from "react-bootstrap";
import ConditionsFilters from "../../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../../shared/Pagination";
import HighlightText from "../../../../../shared/HighlightText";
import PopupMessage from "../../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import "../../../../Patient-management.css";
import { useOtherMedications } from "./useOtherMedications";
import { MobileSkeleton, otherMedicationsHelpers, TableSkeleton } from "./otherMedicationsHelpers";
import {formatDate} from "../../../../../shared/utils";
const OtherMedicationsMobileView = () => {
  const { t } = useTranslation();

  const {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    showPopup,
    selectedRecord,
    recordToDelete,
    isAddMode,
    medicationsData,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    currentData,
    totalItems,
    totalPages,
    searchTerm,

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

    // Utilities
    getStatusColor,
    getMatchedFields,
  } = useOtherMedications();

  const { fieldMapping, tableHeaders, fields, filterConfigs, emptyStates } = otherMedicationsHelpers(t);
  return (
    <div className="table-container mobile-view-card">
      {/* Header + Add Button */}
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Othermedications.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('Othermedications.add_medication')}
          </button>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(v) => setCurrentFilters(prev => ({ ...prev, searchValue: v }))}
              filterStatus={currentFilters.isActive}
              setFilterStatus={(v) => setCurrentFilters(prev => ({ ...prev, isActive: v }))}
              filterDateFrom={currentFilters.startDateFrom}
              setFilterDateFrom={(d) => setCurrentFilters(prev => ({ ...prev, startDateFrom: d }))}
              filterDateTo={currentFilters.startDateTo}
              setFilterDateTo={(d) => setCurrentFilters(prev => ({ ...prev, startDateTo: d }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              filterConfigs={filterConfigs}
            />
          </div>

          {/* Loading / Error / Empty */}
          {(isLoading || isFetching) ? (
            <MobileSkeleton />
          ) : error ? (
            <Card className="text-center py-5">
              <Card.Body>
                <ErrorLoading isError={error} refetch={refetch} />
              </Card.Body>
            </Card>
          ) : currentData.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">
                  {emptyStates.noResults(appliedFilters.searchValue)}
                </p>
              </Card.Body>
            </Card>
          ) : (
            /* Mobile Cards */
            <div className="space-y-3">
              {currentData.map((med) => {
                return (
                  <Card key={med.id} className="mobile-view-card">
                    <Card.Body style={{ padding: "15px" }}>
                      {/* Medication Name */}
                      <div className="custom-card-title">
                        <h5 style={{ margin: 0 }}>
                          <HighlightText
                            text={med.medicationName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(med.highlightInfo)}
                            fieldName={fieldMapping.medicationName}
                          />
                      {med.createdAt && (<div className="created-date small"><small>Created:</small><small className="text-muted d-block">{formatDate(med.createdAt)}</small></div>)}

                        </h5>
                      </div>

                      {/* Category */}
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {tableHeaders.medicationCategory}:
                        </small>
                        <p>
                          <HighlightText
                            text={med.medicationCategory}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(med.highlightInfo)}
                            fieldName={fieldMapping.medicationCategory}
                          />
                        </p>
                      </div>

                      {/* Dates and Status */}
                      <div className="row text-center mb-3">
                        <div className="col-4 border-end">
                          <div className="fw-bold text-primary">{formatDate(med.startDate)}</div>
                          <small className="text-muted">{tableHeaders.startDate}</small>
                        </div>  
                         <div className="col-4">
                          <div className="fw-bold"
                           style={{
                            color: getStatusColor(med.isActive),
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                          >
                          {t(`Common.status_options.${med.isActive ? 'active' : 'inactive'}`)}
                            </div>
                          <small className="text-muted" >{tableHeaders.status}</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-primary">{formatDate(med.endDate) || "-"}</div>
                          <small className="text-muted">{tableHeaders.endDate}</small>
                        </div>
                     
                      </div>
                      {/* Action Buttons */}
                      <div className="d-flex justify-content-between align-items-center"
                      style={{float:"inline-end"}}
                      >    
                      <button
                          variant="primary"
                          size="sm"
                          className="view-btn btn btn-outline-primary btn-sm btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(med)}
                        >
                          {t("Manage")}
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {medicationsData && medicationsData.data && medicationsData.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={pageSize}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      )}
      <DynamicEditModal
        typeDropdown="medication"
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        onDelete={handleDeleteInModal}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={fields}
        addMode={isAddMode}
        title={isAddMode ? t('Othermedications.add_medication') : t('Othermedications.edit_medication')}
      />

      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('Othermedications.confirm_delete_title')}
          message={t('Othermedications.confirm_delete_message', { 
            medication: recordToDelete.medicationName 
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

export default OtherMedicationsMobileView;