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
import { MdExpandMore } from "react-icons/md";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import { useScrollToFirstMatch } from "../../../../../hooks/useScrollToFirstMatch";
import {hasHiddenMatch, isHasMatched} from "../component/helpers";
import { useHiddenRightMatchObserver } from "../../../../../hooks/useRightMatchObserver";
import PatientName from "../component/PatientName";

const AllergyTable = ({patientId}) => {
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
    currentData,
    searchTerm,
    isLoading,
    isFetching,
    error,
    isDeleting,
    pageSize,
    expandedRow,
    
    // Actions
    handleExpandClick,
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
  } = useAllergies(patientId);

  const {
    allergenOptions,
    fields,
    filterConfigs,
    fieldMapping,
    formatDate,
    translateSeverity,
    translateStatus
  } = allergyHelpers(t);
  useScrollToFirstMatch({
    currentData,
    searchTerm,
    FIELD_KEY_MAP: null,
    hasHiddenMatch,
    handleViewClick:handleExpandClick,
  });
  const tableWrapperRef = React.useRef(null);
  useHiddenRightMatchObserver({ tableWrapperRef, currentData, searchTerm });
  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("AllergyTable.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
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
          <div className="scrol patientTable" ref={tableWrapperRef} style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>{t("AllergyTable.allergen")}</th>
                  <th>{t("Category")}</th>
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
                    <React.Fragment key={entry.id}>
                    <tr key={entry.id}>
                      <td  data-has-match={isHasMatched(entry, fieldMapping.allergenName)? "true": undefined}>
                        <HighlightText
                          text={entry.allergenName}
                          searchTerm={searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.allergenName}
                        />
                      </td>
                      <td  data-has-match={isHasMatched(entry, "AllergenCategory")? "true": undefined}>
                        <HighlightText
                          text={entry.allergenCategory}
                          searchTerm={searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={"AllergenCategory"}
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
                      <td data-has-match={isHasMatched(entry, fieldMapping.reaction)? "true": undefined}>
                        <HighlightText
                          text={entry.reaction}
                          searchTerm={allergiesData.searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.reaction}
                        />
                      </td>
                      <td>
                        {entry.notes ? (
                          <span>
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
                            
                               {entry.notes && entry.notes.length > 80 && (
                                <Button
                                  data-has-match={isHasMatched(entry, fieldMapping.notes)? "true": undefined}
                                  className={` ${hasHiddenMatch(entry, fieldMapping.notes, entry.notes, searchTerm)? "has-match pulse": ""} md-expandable view-btn ms-2`}
                                  size="sm"
                                  style={{
                                    backgroundColor: "transparent",
                                    // color: "#278fff",
                                    padding: 0,
                                    fontSize: "19px",
                                    height: "20px",
                                  }}
                                  onClick={() => handleExpandClick(entry.id)}
                                >
                                  <MdExpandMore
                                    data-right-has-match={isHasMatched(entry, fieldMapping.notes)? "true": undefined}
                                    style={{
                                      transform:
                                        expandedRow === entry.id
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s ease",
                                    }}
                                  />
                                </Button>
                              )}

                          </span>
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
                      {/* Expanded row for Notes */}
                        {expandedRow === entry.id && entry.notes && entry.notes.length > 80 && (
                          <tr
                            className="table-active-content"
                            style={{ backgroundColor: "transparent" }}
                          >
                            <td
                              colSpan="6"
                              className="border-0 background-in-hover-none"
                            >
                              <div className="description-expanded-section">
                                <TextAreaField
                                  label={t("DiagnosedConditionsTable.notes")}
                                  value={entry.notes}
                                  disabled={true}
                                  isHasMatched={isHasMatched(entry, fieldMapping.notes)}
                                  searchTerm={searchTerm}
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