// PrescribedMedicationMobileView.jsx
import { Button, Modal, Card } from "react-bootstrap";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Field from "../../../../../ui/form-fields/Field";
import Pagination from "../../../../../shared/Pagination";
import HighlightText from "../../../../../shared/HighlightText";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../../Patient-management.css";
import ErrorLoading from "../../../../../shared/ErrorLoading";
import { usePrescribedMedication } from "./usePrescribedMedication";
import { MobileSkeleton, prescribedMedicationHelpers } from "./prescribedMedicationHelpers";
import { formatDate } from "../../../../../shared/utils";
import { useEffect } from "react";
import { isHasMatched } from "../../component/helpers";
import PatientName from "../../component/PatientName";


const PrescribedMedicationMobileView = ({patientId}) => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedRow,
    currentFilters,
    currentPage,
    showModal,
    selectedMedication,
    isLoading,
    isFetching,
    error,
    currentData,
    totalItems,
    totalPages,
    searchTerm,
    expandedField,
    
    // Actions
    handleExpandClick,
    handleSearch,
    handleResetFilters,
    handleOpenModal,
    handleCloseModal,
    handleModalExited,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
  } = usePrescribedMedication({isMobile: true, patientId}); 

  const {
    mobileHeaders,
    emptyStates,
  } = prescribedMedicationHelpers(t);
  useEffect(() => {
   if (!currentData?.length) return;
      const firstMatchRow = currentData.find(item => item.highlightInfo?.matchedFields?.length);
   if(!firstMatchRow) return;
   const fields = firstMatchRow.highlightInfo?.matchedFields || []; 
   if(fields.some(match => match.field === "Instructions")) {
     handleExpandClick(firstMatchRow.id, "instructions",true)
   }

   }, [currentData]);
  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{mobileHeaders.table_title}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters Section */}
          <div className="mb-3 p-3">
         <ConditionsFilters
              searchTerm={currentFilters.searchValue}
              setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
              filterDateFrom={currentFilters.fromDate}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
              filterDateTo={currentFilters.toDate}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              showFilterDropdown={false}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {(isLoading || isFetching) ? (
              <MobileSkeleton />
            ) : error ? (
              <Card className="text-center py-5">
                <Card.Body>
                  <ErrorLoading
                    isError={error}
                    refetch={refetch}
                  />
                </Card.Body>
              </Card>
            ) : currentData.length > 0 ? (
              currentData.map((medication) => {
                return (
                  <Card key={medication.id} className="mobile-view-card">
                    {/* {console.log('medication:', medication)} */}
                    <Card.Body style={{ padding: "15px" }}>
                      <div className="custom-card-title">
                        <h5 style={{ margin: 0 }}>
                          <HighlightText
                            text={medication.medicationName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName="MedicationName"
                          />
                        </h5>
                    {medication.createdAt && (<div className="created-date small"><small>Created:</small><small className="text-muted d-block">{formatDate(medication.createdAt)}</small></div>)}
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {mobileHeaders.MedicationCategoryName}:
                        </small>
                        <p>
                          <HighlightText
                            text={medication.medicationCategoryName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName="MedicationCategoryName"
                          />
                        </p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {mobileHeaders.diagnosis_name}:
                        </small>
                        <p>
                          <HighlightText
                            text={medication.diagnosisName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName="DiagnosisName"
                          />
                        </p>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {mobileHeaders.prescribed_name}:
                        </small>
                        <p>
                          <HighlightText
                            text={medication.prescriptionName}
                            searchTerm={searchTerm}
                            matchedFields={medication.highlightInfo?.matchedFields || []}
                            fieldName="PrescriptionName"
                          />
                        </p>
                      </div>
                        <div className="mb-2">
                          <small className="text-muted d-block mb-1">
                            {mobileHeaders.dosage}:
                          </small>
                          <p>
                            <HighlightText
                              text={medication.dosage}
                              searchTerm={searchTerm}
                              matchedFields={medication.highlightInfo?.matchedFields || []}
                              fieldName="Dosage"
                            />
                          </p>
                        </div>

                      <div className="row text-center mb-3">
                        <div className="col-12">
                          <div className="fw-bold text-primary">
                            {medication.durationInDays} {t('PrescribedMedicationTable.days')}
                          </div>
                          <small className="text-muted">{mobileHeaders.duration}</small>
                        </div>
                      </div>

                      {/* Instructions Section with Expand/Collapse */}
                  {medication.instructions && (<div className="mb-2">
                        <div className="text-muted d-flex align-items-center mb-1">
                        <small
                          className="text-muted"
                          onClick={() => handleExpandClick(medication.id,"instructions")}
                          style={{ cursor: "pointer" }}
                        >
                          {mobileHeaders.instructions} :
                          </small>
                           <MdExpandMore
                            className={` ${isHasMatched(medication, "instructions")? "has-match pulse": ""} md-expandable view-btn ms-2`}
                            onClick={() => handleExpandClick(medication.id, "instructions")}
                                style={{
                                 transform: expandedRow === medication.id && expandedField === "instructions"? 'rotate(180deg)' : 'rotate(0deg)',
                                 cursor: "pointer",
                                 fontSize: "22px",
                                }}
                              />
                          </div>
                            <div
                              className={`expandable-content ${
                                expandedRow === medication.id &&
                                expandedField === "instructions"
                                  ? ""
                                  : "p-0"
                              }`}
                            >
                          <p
                            style={{
                              margin: "0",
                              transition: 'all 0.3s ease'
                            }}
                          >
                            { expandedRow === medication.id&& expandedField === "instructions"?     
                             <HighlightText
                              text={medication.instructions}
                              searchTerm={searchTerm}
                              matchedFields={medication.highlightInfo?.matchedFields || []}
                              fieldName="Instructions"
                            />: ""}
                          </p>
                        </div>
                      </div>)}

                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{ flex: 1 }}></div>
                        <Button
                          className="view-btn btn btn-outline-primary btn-sm"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleOpenModal(medication)}
                        >
                          {mobileHeaders.view_all_details}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{emptyStates.noMedications}</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={3}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Modal Details */}
      <Modal
        className="mobile-view"
        show={showModal}
        onHide={handleCloseModal}
        onExited={handleModalExited}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header className="border-bottom-0">
          <Modal.Title><HighlightText
          text={selectedMedication?.medicationName}
          searchTerm={searchTerm}
          matchedFields={selectedMedication?.highlightInfo?.matchedFields || []}
          fieldName="MedicationName"
          /></Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label={mobileHeaders.diagnosis_name}
            value={selectedMedication?.diagnosisName}
            disabled
            isHasMatched={isHasMatched(selectedMedication, "DiagnosisName")}
            searchTerm={searchTerm}
          />

          <Field
            label={mobileHeaders.prescribed_name}
            value={selectedMedication?.prescriptionName}
            disabled
            isHasMatched={isHasMatched(selectedMedication, "PrescriptionName")}
            searchTerm={searchTerm}
          />

          <Field
            label={mobileHeaders.dosage}
            value={selectedMedication?.dosage}
            disabled
            isHasMatched={isHasMatched(selectedMedication, "Dosage")}
            searchTerm={searchTerm}
          />

          <Field
            label={mobileHeaders.duration}
            value={`${selectedMedication?.durationInDays} ${t('PrescribedMedicationTable.days')}`}
            disabled
          />
          {console.log(selectedMedication)}
        { selectedMedication?.instructions &&
         <TextAreaField
            label={mobileHeaders.instructions}
            value={selectedMedication?.instructions || ""}
            disabled
            isHasMatched={isHasMatched(selectedMedication, "Instructions")}
            searchTerm={searchTerm}
          />  }
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button className="dc-btn dc-cancel-btn" onClick={handleCloseModal}>
            {mobileHeaders.close}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescribedMedicationMobileView;