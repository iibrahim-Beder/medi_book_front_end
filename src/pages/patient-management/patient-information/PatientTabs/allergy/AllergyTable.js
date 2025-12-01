import React from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../../shared/DynamicEditModal";
import Pagination from "../../../../shared/Pagination";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../../Patient-management.css";
import PopupMessage from "../../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../shared/HighlightText";
import ErrorLoading from "../../../../shared/ErrorLoading";
import { Toaster } from 'react-hot-toast';
import { useAllergies } from "./useAllergies";
import { allergyHelpers } from "./allergyHelpers";

const AllergyTable = () => {
  const { t } = useTranslation();
  
  const {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    selectedRecord,
    isAddMode,
    showPopup,
    recordToDelete,
    allergiesData,
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
    refetch
  } = useAllergies();

  const {
    allergenOptions,
    fields,
    filterConfigs,
    fieldMapping,
    formatDate,
    translateSeverity,
    translateStatus
  } = allergyHelpers(t);

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("AllergyTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("AllergyTable.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("AllergyTable.add_allergen")}
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="mb-20 p-3">
          <ConditionsFilters
            searchPlaceholder="Search allergens..."
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(value) =>
              setCurrentFilters((prev) => ({ ...prev, searchValue: value }))
            }
            filterConfigs={filterConfigs}
            filterDateFrom={
              currentFilters.dateNoted
                ? new Date(currentFilters.dateNoted)
                : null
            }
            setFilterDateFrom={(date) =>
              setCurrentFilters((prev) => ({
                ...prev,
                dateNoted: date ? date.toISOString() : "",
              }))
            }
            filterDateTo={null}
            setFilterDateTo={() => {}}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={allergiesData?.data || []}
          />
        </div>
        <div className="p-3">
          <div className="scrol patientTable" style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>{t("AllergyTable.allergen")}</th>
                  <th>{t("AllergyTable.severity")}</th>
                  <th>{t("AllergyTable.active")}</th>
                  <th>{t("AllergyTable.date_noted")}</th>
                  <th>{t("AllergyTable.reaction")}</th>
                  <th>{t("AllergyTable.notes")}</th>
                  <th>{t("AllergyTable.last_updated")}</th>
                  <th>{t("created_at")}</th>
                  <th>{t("actions")}</th>
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
                      <td>
                        {translateSeverity(entry.severity)}
                      </td>
                      <td>
                        <span>
                          {translateStatus(entry.isActive)}
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
                            text={
                              entry.notes.length > 50
                                ? `${entry.notes.substring(0, 50)}...`
                                : entry.notes
                            }
                            searchTerm={allergiesData.searchTerm}
                            matchedFields={entry.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.notes}
                          />
                        ) : (
                          "-"
                        )}
                      </td> 
                      <td>{formatDate(entry.updatedAt)}</td>
                      <td>{formatDate(entry.createdAt)}</td>
                      <td>
                        <Button
                          className="view-btn"
                          variant=""
                          size="sm"
                          style={{
                            color: "#007bff",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => handleEdit(entry)}
                        >
                          {t("AllergyTable.manage")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      {appliedFilters.searchValue
                        ? t("AllergyTable.no_results_for_search", {
                            search: appliedFilters.searchValue,
                          })
                        : t("AllergyTable.no_records_found")}
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

      {/* Modal for Add/Edit */}
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
        title={
          isAddMode
            ? t("AllergyTable.add_allergen")
            : t("AllergyTable.edit_allergen")
        }
        typeDropdown="allergy"
      />

      {/* Delete confirmation popup */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t("AllergyTable.confirm_delete_title")}
          message={t("AllergyTable.confirm_delete_message", {
            allergen: recordToDelete.allergenName || recordToDelete.allergenId,
          })}
          buttons={[
            {
              text: t("Cancel"),
              onClick: handleClosePopup,
              variant: "secondary",
            },
            {
              text: t("Delete"),
              onClick: handleConfirmDelete,
              variant: "danger",
              disabled: isDeleting
            },
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AllergyTable;