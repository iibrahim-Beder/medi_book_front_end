import React from "react";
import { Button, Modal, Card } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";
import HighlightText from "../../../../shared/HighlightText";
import ErrorLoading from "../../../../shared/ErrorLoading";
import "../../../Patient-management.css";
import { usePrescriptions } from "./usePrescriptions";
import { prescriptionsHelpers, MobileSkeleton } from "./prescriptionsHelpers";
import { formatDate } from "../../../../shared/utils";

const PrescriptionsMobileView = () => {
  const { t } = useTranslation();
  
  const {
    // State
    expandedNotes,
    currentFilters,
    currentPage,
    showModal,
    selectedPrescription,
    prescriptionsData,
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
    toggleNotes,
    handleOpenModalMobile,
    handleCloseModalMobile,
    handleModalExited,
    setCurrentPage,
    setCurrentFilters,
    refetch,
    
    // Utilities
    getStatusColor,
    getMatchedFields,
    transformMedicationData
  } = usePrescriptions(true); 

  const {
    mobileHeaders,
    mobileStatusOptions,
    filterConfigs,
    medicationFields,
    emptyStates
  } = prescriptionsHelpers(t);

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
              filterType={currentFilters.status}
              setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, status: value }))}
              filterDateFrom={currentFilters.fromDate}
              setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
              filterDateTo={currentFilters.toDate}
              setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
              onReset={handleResetFilters}
              onSearch={handleSearch}
              conditions={currentData}
              filterConfigs={filterConfigs}
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
              currentData.map((prescription) => {
                const medicationCount = prescription.prescribedMedications ? prescription.prescribedMedications.length : 0;
                console.log("prescription", prescription);
                return (
                  <Card key={prescription.id} className="mobile-view-card">
                    <Card.Body style={{ padding: "15px" }}>
                      <div className="custom-card-title">
                        <h5 style={{ margin: 0 }}>
                          <HighlightText
                            text={prescription.title}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(prescription.highlightInfo)}
                            fieldName="Title"
                          />
                        </h5>
                        {prescription.createdAt && (<div className="created-date"><small>Created:</small><small className="text-muted d-block">{formatDate(prescription.createdAt)}</small></div>)}
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block mb-1">
                          {mobileHeaders.diagnosis}:
                        </small>
                        <p>
                          <HighlightText
                            text={prescription.diagnosisName}
                            searchTerm={searchTerm}
                            matchedFields={getMatchedFields(prescription.highlightInfo)}
                            fieldName="DiagnosisName"
                          />
                        </p>
                      </div>
                      <div className="row justify-content-around text-center mb-3">
                        <div className="">
                          <div
                            className="fw-bold"
                            style={{ color: getStatusColor(prescription.status) }}
                          >
                            {mobileStatusOptions[prescription.status] || prescription.status}
                          </div>
                          <small className="text-muted">{mobileHeaders.status}</small>
                        </div>
                        <div className="">
                          <div className="fw-bold text-primary">
                            {medicationCount}
                          </div>
                          <small className="text-muted">{mobileHeaders.medications}</small>
                        </div>
                      </div>
               
                       {/* Notes Section with Expand/Collapse */}
                      <div className="mb-2">
                         {prescription.notes && (   <small
                          className="text-muted d-flex align-items-center mb-1"
                          onClick={() => toggleNotes(prescription.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {mobileHeaders.note} :
                              <MdExpandMore
                              style={{
                                  fontSize: '20px',
                                  color: '#278fff',
                                  padding: "3px 0 0",
                                  transform: expandedNotes[prescription.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease',
                                }}
                              />
                        </small>
                          )}
                        <div className={`expandable-content ${expandedNotes[prescription.id] ? '' : 'p-0'}`}>
                          <p
                            style={{
                              margin: "0",
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {expandedNotes[prescription.id] ? prescription.notes : ""}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{ flex: 1 }}></div>
                        <Button
                          className="view-btn btn btn-outline-primary btn-sm"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleOpenModalMobile(prescription)}
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
                  <p className="text-muted">
                    {emptyStates.noPrescriptions}
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {prescriptionsData && prescriptionsData.data && prescriptionsData.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={5}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {/* Modal Details */}
      <Modal
        className="mobile-view"
        show={showModal}
        onHide={handleCloseModalMobile}
        onExited={handleModalExited}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header className="border-bottom-0">
          <Modal.Title>{selectedPrescription?.title}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModalMobile}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label={mobileHeaders.diagnosis_name}
            value={selectedPrescription?.diagnosisName || ""}
            disabled
          />

          <Field
            label={mobileHeaders.status}
            value={selectedPrescription?.status || ""}
            disabled
            style={{ color: getStatusColor(selectedPrescription?.status) }}
          />

          <TextAreaField
            label={mobileHeaders.prescription_note}
            value={selectedPrescription?.notes || ""}
            disabled
          />

          <CustomAccordion
            getItemTitle={(medication) => medication.medicationName || "Medication"}
            titleBackgroundColor="var(--scbccolor)"
            title={mobileHeaders.medications}
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            data={selectedPrescription?.prescribedMedications ? transformMedicationData(selectedPrescription.prescribedMedications) : []}
            formFields={medicationFields}
          />
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button className="dc-btn dc-cancel-btn" onClick={handleCloseModalMobile}>
            {mobileHeaders.close}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescriptionsMobileView;