import React, { useEffect } from "react";
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
import { formatDate, truncateText } from "../../../../shared/utils";
import HighlightText from "../../../../shared/HighlightText";
import { diagnosisHelpers } from "./diagnosisHelpers";
import { isHasMatched } from "../component/helpers";
import PatientName from "../component/PatientName";

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
    searchTerm,
    currentData,

    // Actions
    handleSearch,
    handleResetFilters,

    // Utilities
    expandedDescriptions,
    openDescription,
    toggleDescription,
    transformDiagnosisData,
    transformPrescriptionData,
  } = useDiagnoses();
  const{diagnosedConditionsFields,prescriptionRecipeFields,notesFields,prescriptionFields} = diagnosisHelpers(t);

  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState(null);

  useEffect(() => {
      if (!currentData?.length) return;
    
      currentData.forEach(item => {
        const fields = item.highlightInfo?.matchedFields || [];
    
        fields.forEach(match => {
          if (match.field === "Description") {
            openDescription(item.id);
          }
        });
      });
    }, [diagnosesData]);

  const totalItems = diagnosesData?.totalCount || 0;
  const currentItems =
    currentData?.map(transformDiagnosisData) || [];

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosisMobileView.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
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
              conditions={currentData || []}
            />
          </div>

          {/* Loading / Error */}
          {(isLoading || isFetching) && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="mobile-view-card">
           <Card.Body style={{ padding: "15px" }}>
             <Skeleton height={20} width="60%" className="mb-2" />
             <Skeleton height={15} count={2} className="mb-2" />
             <Skeleton height={15} width="80%" className="mb-3" />
             <div className="row text-center mb-3">
               <div className="col-4">
                 <Skeleton height={30} />
               </div>
               <div className="col-4">
                 <Skeleton height={30} />
               </div>
               <div className="col-4">
                 <Skeleton height={30} />
               </div>
             </div>
             <Skeleton
               height={35}
               width="100px"
               style={{ float: "right" }}
             />
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
                      <div className="custom-card-title">
                        <h5 style={{ margin: 0 }} title={disease.diagnosisName} >  
                           <HighlightText
                              text={truncateText(disease.diagnosisName, 100)}
                                searchTerm={searchTerm}
                                matchedFields={disease.highlightInfo?.matchedFields || []}
                                fieldName="DiagnosisName"
                              /></h5>
                      </div>
                        {disease.createdAt && (<div className="created-date"><small>Created:</small><small className="text-muted d-block">{formatDate(disease.createdAt)}</small></div>)}

                      {disease.symptomsDescription && <div className="mb-3">
                        <small className="text-muted d-block mb-1">
                          {t("DiagnosisMobileView.symptoms")}
                        </small>
                        <p className="mb-2" title={disease.symptomsDescription} >        
                             <HighlightText
                              text={truncateText(disease.symptomsDescription, 80)}
                              searchTerm={searchTerm}
                              matchedFields={disease.highlightInfo?.matchedFields || []}
                              fieldName="SymptomsDescription"
                            />
                        </p>
                      </div>}

                      {/* Diagnosis (Conditions - Notes - Prescription) */}
                      <div className="row text-center mb-3">
                        <div className="col-4 p-0">
                          <div className="border-end">
                            <div className="fw-bold text-primary">
                              {disease.diagnosedConditions.length}
                            </div>
                            <small className={` ${disease.hasConditionMatch ? 'subtlePulse has-match-field' : 'text-muted'}`}>
                              {t("DiagnosisMobileView.conditions")}
                            </small>
                          </div>
                        </div>
                        <div className="col-4 p-0">
                          <div className="border-end">
                            <div className="fw-bold text-primary">
                              {disease.notes.length}
                            </div>
                            <small className={` ${disease.hasNoteMatch ? 'subtlePulse has-match-field' : 'text-muted'}`}>
                              {t("DiagnosisMobileView.notes")}
                            </small>
                          </div>
                        </div>
                        <div className="col-4 p-0">
                          <div className="fw-bold text-primary">
                            {disease.prescription.length}
                          </div>
                            <small className={` ${disease.hasPrescriptionMatch ||disease.hasMedicationMatch? 'subtlePulse has-match-field' : 'text-muted'}`}>
                            {t("DiagnosisMobileView.prescription")}
                          </small>
                        </div>
                      </div>

                      {/* Diagnosis Description - Expand/Collapse */}
                      {disease.diagnosisDescription &&
                        <div className="mb-2">
                        <small
                          className="text-muted d-flex mb-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleDescription(disease.id)}
                        >
                          {t("DiagnosisMobileView.diagnosis_description")} :
                            <button
                              className={`${isHasMatched(disease, "Description") ? 'has-match pulse' : ''} md-expandable view-btn ms-2 `}                              onClick={() => toggleDescription(disease.id)}
                              style={{
                                fontSize: "20px",
                                // color: "#278fff",
                                padding: "3px 0 0",
                              }}
                            >
                              <MdExpandMore
                                onClick={() => toggleDescription(disease.id)}
                                style={{
                                  transform: isDescriptionExpanded
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </button>
                        </small>

                        <div
                          className={`expandable-content ${
                            isDescriptionExpanded ? "" : "p-0"
                          }`}
                        >
                          <p
                            style={{
                              margin: 0,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {isDescriptionExpanded
                              ?  <HighlightText
                                    text={disease.diagnosisDescription}
                                    searchTerm={searchTerm}
                                    matchedFields={disease.highlightInfo?.matchedFields || []}
                                    fieldName="Description"
                                  />
                              : ""}
                          </p>
                        </div>
                      </div>}

                    {disease.updatedAt && (<div className="created-date small"><small>Created:</small><small className="text-muted d-block">{formatDate(disease.updatedAt)}</small></div>)}
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
                 <HighlightText
                   text={(selectedDiagnosis.diagnosisName)}
                   searchTerm={searchTerm}
                   matchedFields={selectedDiagnosis.highlightInfo?.matchedFields || []}
                   fieldName="DiagnosisName"
                   />
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
                isHasMatched={isHasMatched(selectedDiagnosis|| {}, "SymptomsDescription")}
                searchTerm={searchTerm}
              />
            </div>

            {/* Diagnosis Description */}
            <div className="mb-4">
              <Field
                label={t("DiagnosisMobileView.diagnosis_description")}
                value={selectedDiagnosis.diagnosisDescription}
                disabled
                isHasMatched={isHasMatched(selectedDiagnosis|| {}, "Description")}
                searchTerm={searchTerm}

              />
            </div>

            {/* Diagnosed Conditions */}
            <div className="mb-4">
              <CustomAccordion
                titleBackgroundColor="var(--scbccolor)"
                title={t("DiagnosisMobileView.conditions")}
                getItemTitle={(condition) => condition.medicalConditionName || "Condition"}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.diagnosedConditions}
                formFields={diagnosedConditionsFields}
                isHasMatched={isHasMatched}
                searchTerm={searchTerm}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <CustomAccordion
                getItemTitle={(note) => note.note || "Note"}
                titleBackgroundColor="var(--scbccolor)"
                title={t("DiagnosisMobileView.notes")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.notes}
                formFields={notesFields}
                isHasMatched={isHasMatched}
                searchTerm={searchTerm}
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
                formFields={prescriptionFields}
                formFieldsRecipe={prescriptionRecipeFields}
                isHasMatched={isHasMatched}
                searchTerm={searchTerm}
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