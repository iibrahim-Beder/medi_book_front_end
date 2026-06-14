import React from "react";
import { Table, Button } from "react-bootstrap";
import ConditionsFilters from "../../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../../shared/Pagination";
import PopupMessage from "../../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../../shared/DynamicEditModal";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../../shared/HighlightText";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import "../../../../Patient-management.css";
import { useOtherMedications } from "./useOtherMedications";
import { otherMedicationsHelpers, TableSkeleton } from "./otherMedicationsHelpers";
import PatientName from "../../component/PatientName";

const Othermedications = ({patientId}) => {
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
    handleInstructionsClick,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setSelectedRecord,
    refetch,
    
    // Utilities
    truncateText,
    getStatusColor,
    getMatchedFields
  } = useOtherMedications(patientId);

  const {
    fieldMapping,
    tableHeaders,
    fields,
    filterConfigs,
    emptyStates,
    formatDate
  } = otherMedicationsHelpers(t);
  console.log("medicationsData", medicationsData);

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("Othermedications.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t('Othermedications.add_medication')}
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterStatus={currentFilters.isActive}
              setFilterStatus={(value) => setCurrentFilters(prev => ({ ...prev, isActive: value }))}
              filterDateFrom={currentFilters.startDateFrom}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, startDateFrom: date }))}
              filterDateTo={currentFilters.startDateTo}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, startDateTo: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              filterConfigs={filterConfigs}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{tableHeaders.medication}</th>
                  <th>{tableHeaders.medicationCategory}</th>
                  {/* <th>{tableHeaders.dosage}</th>
                  <th>{tableHeaders.frequency}</th>
                  <th>{tableHeaders.route}</th>
                  <th>{tableHeaders.instructions}</th> */}
                  <th>{tableHeaders.startDate}</th>
                  <th>{tableHeaders.endDate}</th>
                  <th>{tableHeaders.status}</th>
                  <th>{tableHeaders.actions}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  <TableSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="text-center text-danger">
                      <ErrorLoading
                        isError={error}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((medication) => (
                    <React.Fragment key={medication.id}>
                      <tr>
                        <td title={medication.medicationName}>
                          <HighlightText
                          text={medication.medicationName}
                          searchTerm={searchTerm}
                          matchedFields={medication.highlightInfo?.matchedFields || []}
                          fieldName={"MedicationName"}
                          />
                        </td>
                        <td title={medication.medicationCategory}>
                          <HighlightText
                            text={medication.medicationCategory}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName={"MedicationCategory"}
                          />
                        </td>
                        <td>{formatDate(medication.startDate)}</td>
                        <td>{formatDate(medication.endDate)}</td>
                        <td>
                          <span
                            style={{
                              color: getStatusColor(medication.isActive),
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {t(`Common.status_options.${medication.isActive ? 'active' : 'inactive'}`)}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              className="view-btn"
                              variant=""
                              size="sm"
                              style={{ color: "#007bff", backgroundColor: "transparent" }}
                              onClick={() => handleEdit(medication)}
                            >
                              {t("Manage")}
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for Instructions */}
                      {expandedRow === medication.id && (
                        <tr
                          className="table-active-content"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <td
                            colSpan="9"
                            className="border-0 background-in-hover-none"
                          >
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={tableHeaders.instructions}
                                value={medication.instructions}
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
                      {emptyStates.noResults(appliedFilters.searchValue)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
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
        </div>
      </div>

      {/* Modal for Add/Edit */}
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

      {/* Popup for Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t('Othermedications.confirm_delete_title')}
          message={t('Othermedications.confirm_delete_message', { 
            medication: recordToDelete.medicationName 
          })}
          buttons={[
            { 
              text: t('Cancel'), 
              onClick: handleClosePopup, 
              variant: "simple-cancel-btn shadow-0", 
            },
            { 
              text: t('Delete'), 
              onClick: handleConfirmDelete, 
              variant: "popup-btn deactivate-btn",
              disabled: isDeleting
            }
          ]}
          onClose={handleClosePopup}
        />
      )}

    </div>
  );
};

export default Othermedications;