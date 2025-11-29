import React from "react";
import { Button, Modal, Card } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import TwoLevelAccordion from "../../../../shared/TwoLevelAccordion";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import { MdClose, MdExpandMore } from "react-icons/md";
import Pagination from "../../../../shared/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorLoading from "../../../../shared/ErrorLoading";
import { useDiagnoses } from "./useDiagnoses";

const DiagnosisMobileView = () => {
  const { t } = useTranslation();

  const {
    currentFilters,
    setCurrentFilters,
    currentPage,
    setCurrentPage,
    diagnosesData,
    isLoading,
    isFetching,
    error,
    refetch,
    pageSize,

    // Actions
    handleSearch,
    handleResetFilters,

    // Utilities
    truncateText,
    formatDate,
    transformDiagnosisData,
    transformPrescriptionData,
  } = useDiagnoses();

  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState(null);

  const [expandedDescriptions, setExpandedDescriptions] = React.useState({});

  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId],
    }));
  };

  const totalItems = diagnosesData?.totalCount || 0;
  const currentItems =
    diagnosesData?.data?.map(transformDiagnosisData) || [];

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosisMobileView.table_title")}</h3>
          <h6 className="table-subtitle">
            {t("DiagnosisMobileView.table_subtitle")}
          </h6>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) =>
                setCurrentFilters((prev) => ({ ...prev, searchValue: value }))
              }
              filterType={currentFilters.diagnosisType}
              setFilterType={(value) =>
                setCurrentFilters((prev) => ({ ...prev, diagnosisType: value }))
              }
              filterDateFrom={currentFilters.dateFrom}
              setFilterDateFrom={(date) =>
                setCurrentFilters((prev) => ({ ...prev, dateFrom: date }))
              }
              filterDateTo={currentFilters.dateTo}
              setFilterDateTo={(date) =>
                setCurrentFilters((prev) => ({ ...prev, dateTo: date }))
              }
              onReset={handleResetFilters}
              onSearch={() => {
                setCurrentPage(1);
                handleSearch();
              }}
              conditions={diagnosesData?.data || []}
            />
          </div>

          {/* Loading / Error */}
          {(isLoading || isFetching) && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={60} className="mt-2" />
                    <Skeleton height={20} width="40%" className="mt-3" />
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {error && !isLoading && !isFetching && (
            <Card className="text-center py-5">
              <Card.Body>
                <ErrorLoading isError={error} refetch={refetch} />
              </Card.Body>
            </Card>
          )}

          {/* Mobile Cards */}
          {!isLoading && !isFetching && !error && (
            <div className="space-y-3">
              {currentItems.map((disease) => {
                const isDescriptionExpanded = expandedDescriptions[disease.id];

                return (
                  <Card key={disease.id} className="mobile-view-card">
                    <Card.Body style={{ padding: "15px" }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 style={{ margin: 0 }}>{disease.diagnosisName}</h5>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">
                          {t("DiagnosisMobileView.symptoms")}
                        </small>
                        <p className="mb-2">
                          {truncateText(disease.symptomsDescription, 80)}
                        </p>
                      </div>

                      {/* Diagnosis Description - Expand/Collapse */}
                      <div className="mb-2">
                        <small
                          className="text-muted d-flex mb-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleDescription(disease.id)}
                        >
                          {t("DiagnosisMobileView.diagnosis_description")} :
                          {disease.symptomsDescription && (
                            <button
                              className=""
                              onClick={() => toggleDescription(disease.id)}
                              style={{
                                fontSize: "20px",
                                color: "#278fff",
                                padding: "3px 0 0",
                              }}
                            >
                              <MdExpandMore
                                style={{
                                  transform: isDescriptionExpanded
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </button>
                          )}
                        </small>

                        <div
                          className={`expandable-content ${
                            isDescriptionExpanded ? "" : "p-0"
                          }`}
                        >
                          <p
                            style={{
                              margin: 0,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => toggleDescription(disease.id)}
                          >
                            {isDescriptionExpanded
                              ? disease.diagnosisDescription
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Diagnosis (Conditions - Notes - Prescription) */}
                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div className="border-end">
                            <div className="fw-bold text-primary">
                              {disease.diagnosedConditions.length}
                            </div>
                            <small className="text-muted">
                              {t("DiagnosisMobileView.conditions")}
                            </small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="border-end">
                            <div className="fw-bold text-primary">
                              {disease.notes.length}
                            </div>
                            <small className="text-muted">
                              {t("DiagnosisMobileView.notes")}
                            </small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-primary">
                            {disease.prescription.length}
                          </div>
                          <small className="text-muted">
                            {t("DiagnosisMobileView.prescription")}
                          </small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{ flex: 1 }}></div>
                        <Button
                          className="view-btn btn btn-outline-primary btn-sm"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setSelectedDiagnosis(disease)}
                        >
                          {t("DiagnosisMobileView.view_all_details")}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}

              {currentItems.length === 0 && (
                <Card className="text-center py-5">
                  <Card.Body>
                    <p className="text-muted">
                      {t("DiagnosisMobileView.no_diagnosis_found")}
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {diagnosesData && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedDiagnosis && (
        <Modal
          className="mobile-view"
          show={true}
          onHide={() => setSelectedDiagnosis(null)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton className="border-bottom-0">
            <Modal.Title className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <span>{selectedDiagnosis.diagnosisName}</span>
              </div>
            </Modal.Title>
            <button
              className="btn-modal-close"
              onClick={() => setSelectedDiagnosis(null)}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.8")}
            >
              <MdClose />
            </button>
          </Modal.Header>

          <Modal.Body className="space-y-4 pt-0">
            {/* Symptoms Description */}
            <div className="mb-4">
              <Field
                label={t("DiagnosisMobileView.symptoms_description")}
                value={selectedDiagnosis.symptomsDescription}
                disabled
              />
            </div>

            {/* Diagnosis Description */}
            <div className="mb-4">
              <Field
                label={t("DiagnosisMobileView.diagnosis_description")}
                value={selectedDiagnosis.diagnosisDescription}
                disabled
              />
            </div>

            {/* Diagnosed Conditions */}
            <div className="mb-4">
              <CustomAccordion
                titleBackgroundColor="var(--scbccolor)"
                title={t("DiagnosisMobileView.conditions")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.diagnosedConditions}
                formFields={[
                  {
                    label: t("DiagnosisMobileView.medical_condition"),
                    name: "MedicalCondition",
                    placeholder: t("DiagnosisMobileView.condition_type"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.severity"),
                    name: "Severity",
                    placeholder: t("DiagnosisMobileView.severity"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.note"),
                    name: "note",
                    type: "textarea",
                    placeholder: t("DiagnosisMobileView.note_content"),
                  },
                ]}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <CustomAccordion
                titleBackgroundColor="var(--scbccolor)"
                title={t("DiagnosisMobileView.notes")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.notes}
                formFields={[
                  {
                    label: t("DiagnosisMobileView.note_content"),
                    name: "content",
                    type: "textarea",
                    placeholder: t("DiagnosisMobileView.note_content"),
                  },
                ]}
              />
            </div>

            {/* Prescription */}
            <div className="mb-4">
              <TwoLevelAccordion
                title={t("DiagnosisMobileView.prescription")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                titleBackgroundColor="var(--scbccolor)"
                data={transformPrescriptionData(selectedDiagnosis.prescription)}
                formFields={[
                  {
                    label: t("DiagnosisMobileView.prescription_title"),
                    name: "title",
                    type: "text",
                    placeholder: t("DiagnosisMobileView.prescription_title"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.status"),
                    name: "status",
                    placeholder: t("DiagnosisMobileView.status"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.note"),
                    name: "note",
                    type: "textarea",
                    placeholder: t("DiagnosisMobileView.prescription_note"),
                  },
                ]}
                formFieldsRecipe={[
                  {
                    label: t("DiagnosisMobileView.type"),
                    name: "type",
                    placeholder: t("DiagnosisMobileView.type"),
                  },
                  {
                    label: t("DiagnosisMobileView.dosage"),
                    name: "dosage",
                    placeholder: t("DiagnosisMobileView.dosage"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.duration_days"),
                    name: "durationInDays",
                    type: "number",
                    placeholder: t("DiagnosisMobileView.duration_days"),
                    half: true,
                  },
                  {
                    label: t("DiagnosisMobileView.instructions"),
                    name: "instructions",
                    placeholder: t("DiagnosisMobileView.instructions"),
                    type: "textarea",
                  },
                ]}
              />
            </div>
          </Modal.Body>

          <Modal.Footer className="border-top-0">
            <button
              className="dc-btn dc-cancel-btn"
              onClick={() => setSelectedDiagnosis(null)}
            >
              {t("DiagnosisMobileView.close")}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DiagnosisMobileView;