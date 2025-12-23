// AllergyMobileView.jsx
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import PopupMessage from "../../../../shared/PopupMessage";
import DynamicEditModal from "../../../../shared/DynamicEditModal";
import ConditionsFilters from "../component/ConditionsFilters";
import HighlightText from "../../../../shared/HighlightText";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../shared/ErrorLoading";

import { useAllergies } from "./useAllergies";
import { allergyHelpers } from "./allergyHelpers";

import "../../../Patient-management.css";

const AllergyMobileView = () => {
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
    refetch,

  } = useAllergies();

  const {
    fields,
    fieldMapping,
    filterConfigs,
    formatDate,
    translateSeverity,
    translateStatus,
  } = allergyHelpers(t);
  const [expandedRow, setExpandedRow] = useState(null);
  const handleNotesClick = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };
  
  const conditions = allergiesData?.data || [];
  const totalItems = allergiesData?.totalCount || 0;
  const totalPages = allergiesData?.totalPages || 1;

  const noResults = !isLoading && !isFetching && conditions.length === 0 && appliedFilters.searchValue;

  return (
    <div className="table-container mobile-view-card">
      {/* Header */}
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("AllergyMobileView.table_title")}</h3>
          <h6 className="table-subtitle">{t("AllergyMobileView.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("AllergyTable.add_allergen")}
          </button>
        </div>
      </div>

      <div className="p-2">
        {/* Filters */}
        <div className="mb-3">
          <ConditionsFilters
            searchPlaceholder="Search allergens..."
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(v) => setCurrentFilters(prev => ({ ...prev, searchValue: v }))}
            filterStatus={currentFilters.isActive}
            setFilterStatus={(v) => setCurrentFilters(prev => ({ ...prev, isActive: v }))}
            filterSeverity={currentFilters.severity}
            setFilterSeverity={(v) => setCurrentFilters(prev => ({ ...prev, severity: v }))}
            filterDateFrom={currentFilters.dateNoted ? new Date(currentFilters.dateNoted) : null}
            setFilterDateFrom={(date) =>
              setCurrentFilters(prev => ({
                ...prev,
                dateNoted: date ? date.toISOString().split("T")[0] : "",
              }))
            }
            filterDateTo={null}
            setFilterDateTo={() => {}}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={conditions}
            filterConfigs={filterConfigs}
          />
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="mobile-view-card">
                <Card.Body style={{ padding: "15px" }}>
                  <Skeleton height={24} width="70%" />
                  <Skeleton height={16} count={2} style={{ marginTop: 10 }} />
                  <div className="row text-center mt-3">
                    <div className="col-4"><Skeleton height={20} /></div>
                    <div className="col-4"><Skeleton height={20} /></div>
                    <div className="col-4"><Skeleton height={20} /></div>
                  </div>
                  <Skeleton height={36} width={100} style={{ marginLeft: "auto", marginTop: 15 }} />
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <ErrorLoading isError={error} refetch={refetch} />}

        {/* Cards */}
        {!isLoading && !isFetching && conditions.length > 0 && (
          <div className="space-y-3">
            {conditions.map((entry) => {
              const isExpanded = expandedRow === entry.id;

              return (
                <Card key={entry.id} className="mobile-view-card shadow-sm">
                  <Card.Body style={{ padding: "15px" }}>
                    {/* Allergen Name */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="mb-0 text-ellipsis flex-fill me-2">
                        <HighlightText
                          text={entry.allergenName}
                          searchTerm={allergiesData.searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.allergenName}
                        />
                      </h5>
                      <small className="text-muted">{formatDate(entry.dateNoted)}</small>
                    </div>

                    {/* Reaction */}
                    {entry.reaction && (
                      <div className="mb-2">
                        <small className="text-muted">{t("AllergyMobileView.reaction")}:</small>
                        <p className="mb-1">
                          <HighlightText
                            text={entry.reaction}
                            searchTerm={allergiesData.searchTerm}
                            matchedFields={entry.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.reaction}
                          />
                        </p>
                      </div>
                    )}
                    {/* Severity | Status | Date */}
                    <div className="row text-center mb-3 g-2">
                      <div className="col-4 border-end">
                        <div className="fw-bold" style={{ color: "#d66a6a" }}>
                          {translateSeverity(entry.severity)}
                        </div>
                        <small className="text-muted">{t("AllergyMobileView.severity")}</small>
                      </div>
                      <div className="col-4 border-end">
                        <div className="fw-bold" style={{ color: entry.isActive ? "#3fabf3" : "#7A8B97" }}>
                          {translateStatus(entry.isActive)}
                        </div>
                        <small className="text-muted">{t("AllergyMobileView.is_active")}</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-secondary">
                          {formatDate(entry.dateNoted)}
                        </div>
                        <small className="text-muted">{t("AllergyMobileView.date_noted")}</small>
                      </div>
                    </div>
                     {/* Notes - Expandable */}
                    {entry.notes && (
                      <div className="mb-3">
                        <div className="text-muted d-flex align-items-center mb-1">
                          <small onClick={() => handleNotesClick(entry.id)} style={{cursor:"pointer"}} className="text-muted">{t("AllergyMobileView.notes")}</small>
                            <MdExpandMore
                            onClick={() => handleNotesClick(entry.id)}
                              style={{
                              cursor: "pointer",
                              fontSize: "22px",
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                              color: "#278fff",
                            }}
                            />
                        </div>
                        {isExpanded && (
                          <div className="expandable-content">
                            <p className="mb-0">
                            <HighlightText
                              text={entry.notes}
                              searchTerm={allergiesData.searchTerm}
                              matchedFields={entry.highlightInfo?.matchedFields || []}
                              fieldName={fieldMapping.notes}
                            />
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Action Button */}
                    <div className="">
                     <button
                        style={{ float: "inline-end" }}
                        className="view-btn btn btn-outline-primary btn-sm btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm" onClick={() => handleEdit(entry)}>
                        {t("AllergyTable.manage")}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {noResults && (
          <Card className="text-center py-5">
            <Card.Body>
              <p className="text-muted">
                {t("AllergyTable.no_results_for_search", { search: appliedFilters.searchValue })}
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !isFetching && conditions.length === 0 && !appliedFilters.searchValue && !error && (
          <Card className="text-center py-5">
            <Card.Body>
              <p className="text-muted">{t("AllergyMobileView.no_records_found")}</p>
            </Card.Body>
          </Card>
        )}

        {/* Pagination */}
        {conditions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* Edit/Add Modal */}
      <DynamicEditModal
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
        title={isAddMode ? t("AllergyTable.add_allergen") : t("AllergyTable.edit_allergen")}
        typeDropdown="allergy"
      />

      {/* Delete Confirmation */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t("AllergyTable.confirm_delete_title")}
          message={t("AllergyTable.confirm_delete_message", {
            allergen: recordToDelete.allergenName || "this allergen",
          })}
          buttons={[
            { text: t("Cancel"), onClick: handleClosePopup, variant: "secondary" },
            { text: t("Delete"), onClick: handleConfirmDelete, variant: "danger", disabled: isDeleting },
          ]}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AllergyMobileView;