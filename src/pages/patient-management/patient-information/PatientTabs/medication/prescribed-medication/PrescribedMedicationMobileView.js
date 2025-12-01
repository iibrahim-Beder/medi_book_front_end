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


const PrescribedMedicationMobileView = () => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedInstructions,
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
    
    // Actions
    handleSearch,
    handleResetFilters,
    toggleInstructions,
    handleOpenModal,
    handleCloseModal,
    handleModalExited,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    getMatchedFields,
  } = usePrescribedMedication(true); 

  const {
    mobileHeaders,
    emptyStates,
  } = prescribedMedicationHelpers(t);

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{mobileHeaders.table_title}</h3>
          <h6 className="table-subtitle">{mobileHeaders.table_subtitle}</h6>
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
              showStatusFilter={false}
              showSeverityFilter={false}
              showConditionTypeFilter={false}
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
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 style={{ margin: 0 }}>
                          <HighlightText
                            text={medication.medicationName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(medication.highlightInfo)}
                            fieldName="MedicationName"
                          />
                        </h5>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {mobileHeaders.diagnosis_name}:
                        </small>
                        <p>
                          <HighlightText
                            text={medication.diagnosisName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(medication.highlightInfo)}
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
                            matchedFields={getMatchedFields(medication.highlightInfo)}
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
                              matchedFields={getMatchedFields(medication.highlightInfo)}
                              fieldName="PrescriptionName"
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
                          onClick={() => toggleInstructions(medication.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {mobileHeaders.instructions} :
                          </small>
                            <MdExpandMore
                            onClick={() => toggleInstructions(medication.id)}
                                style={{
                                 transform: expandedInstructions[medication.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                 cursor: "pointer",
                                 fontSize: "22px",
                                 color: "#278fff",
                                }}
                              />
                          
                          </div>
                        <div className={`expandable-content ${expandedInstructions[medication.id] ? '' : 'p-0'}`}>
                          <p
                            style={{
                              margin: "0",
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => toggleInstructions(medication.id)}
                          >
                            {expandedInstructions[medication.id] ? medication.instructions : ""}
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
        rowsPerPage={5}
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
          <Modal.Title>{selectedMedication?.medicationName}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label={mobileHeaders.diagnosis_name}
            value={selectedMedication?.diagnosisName}
            disabled
          />

          <Field
            label={mobileHeaders.prescribed_name}
            value={selectedMedication?.prescriptionName}
            disabled
          />

          <Field
            label={mobileHeaders.dosage}
            value={selectedMedication?.dosage}
            disabled
          />

          <Field
            label={mobileHeaders.duration}
            value={`${selectedMedication?.durationInDays} ${t('PrescribedMedicationTable.days')}`}
            disabled
          />
          {console.log(selectedMedication)}
        { selectedMedication?.instructions && <TextAreaField
            label={mobileHeaders.instructions}
            value={selectedMedication?.instructions || ""}
            disabled
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