// PrescribedMedicationMobileView.jsx
import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import "../../Patient-management.css";
import ConditionsFilters from "./component/ConditionsFilters";
import { MdClose } from "react-icons/md";
import { t } from "i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import Field from "../../../ui/form-fields/Field";
import Pagination from "../../../shared/Pagination";

const PrescribedMedicationMobileView = () => {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Filters states
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const rowsPerPage = 5;

  // Mock data representing prescriptions
  const prescriptionsData = [
    {
      id: "#RX001",
      diagnosisName: "Diabetes Mellitus Type 2",
      prescribedName: "Diabetes Management Plan",
      medication: "Metformin",
      dosage: "500mg twice daily",
      duration: "30 days",
      instructions: "Take one tablet with breakfast and one with dinner. Always take with food to minimize gastrointestinal side effects. If you experience significant stomach upset, consult your doctor. Monitor your blood sugar levels regularly and report any unusual readings.",
      status: "active"
    },
    {
      id: "#RX002",
      diagnosisName: "Diabetes Mellitus Type 2", 
      prescribedName: "Blood Sugar Monitoring",
      medication: "Glucose Test Strips",
      dosage: "As needed",
      duration: "90 days",
      instructions: "Check blood sugar levels: 1) First thing in the morning (fasting), 2) Before each main meal, 3) Two hours after meals, and 4) At bedtime. Record all readings in your logbook. Bring the logbook to your next appointment. Contact your doctor if fasting readings are consistently above 130 mg/dL or post-meal readings above 180 mg/dL.",
      status: "active"
    },
    {
      id: "#RX003",
      diagnosisName: "Hypertension",
      prescribedName: "Blood Pressure Control",
      medication: "Lisinopril",
      dosage: "10mg once daily", 
      duration: "90 days",
      instructions: "Take one tablet every morning at the same time, with or without food. Do not skip doses. Monitor your blood pressure twice daily - morning and evening. Report any persistent dry cough, dizziness, or swelling. Avoid sudden position changes to prevent dizziness. Regular blood tests will be needed to monitor kidney function.",
      status: "completed"
    },
    {
      id: "#RX004",
      diagnosisName: "Migraine",
      prescribedName: "Headache Relief",
      medication: "Sumatriptan",
      dosage: "50mg as needed",
      duration: "30 days",
      instructions: "Take at the first sign of migraine headache. Swallow tablet whole with water. Maximum dose is 2 tablets in 24 hours. Do not take if you have heart disease, uncontrolled hypertension, or history of stroke. Wait at least 2 hours between doses. Avoid driving or operating machinery until you know how this medication affects you.",
      status: "cancelled"
    },
    {
      id: "#RX005",
      diagnosisName: "Vitamin Deficiency",
      prescribedName: "Supplement Therapy", 
      medication: "Vitamin D3",
      dosage: "1000 IU once daily",
      duration: "60 days",
      instructions: "Take one capsule daily with your largest meal that contains healthy fats (such as avocado, nuts, or olive oil) for optimal absorption. Best taken in the morning. Do not exceed the recommended dose. Store in a cool, dry place away from direct sunlight. Follow up with blood test after 8 weeks to check vitamin D levels.",
      status: "expired"
    },
    {
      id: "#RX006",
      diagnosisName: "Asthma",
      prescribedName: "Respiratory Management",
      medication: "Salbutamol Inhaler",
      dosage: "2 puffs every 4-6 hours",
      duration: "180 days", 
      instructions: "Shake well before each use. Breathe out fully, place mouthpiece between lips, and inhale deeply while pressing down on canister. Hold breath for 10 seconds if possible. Wait one minute between puffs. Rinse mouth after use to prevent oral thrush. Use as needed for shortness of breath, wheezing, or chest tightness. Do not exceed 8 puffs in 24 hours. Seek emergency care if no improvement after 4 puffs.",
      status: "active"
    }
  ];

  // Apply search & filters
  const filteredPrescriptions = prescriptionsData
    .filter((prescription) => {
      if (!searchTerm) return true;
      return prescription.medication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prescription.diagnosisName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prescription.prescribedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prescription.dosage?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((prescription) => (filterType ? prescription.medication === filterType : true));

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const handleOpenModal = (medication) => {
    setSelectedMedication(medication);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalExited = () => {
    setSelectedMedication(null);
  };

  const totalPages = Math.ceil(filteredPrescriptions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredPrescriptions.slice(startIndex, startIndex + rowsPerPage);

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#3fabf3';  
      case 'completed': return '#4BAE78'; 
      case 'cancelled': return '#D66A6A';
      case 'expired': return '#7A8B97'; 
      default: return '#6C757D';
    }
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Prescribed Medication List</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters Section */}
          <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterDateFrom={filterDateFrom}
              setFilterDateFrom={setFilterDateFrom}
              filterDateTo={filterDateTo}
              setFilterDateTo={setFilterDateTo}
              onReset={resetFilters}
              onSearch={() => setCurrentPage(1)}
              conditions={prescriptionsData}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((prescription) => (
              <Card
                key={prescription.id}
                className="mobile-view-card"
              >
                <Card.Body style={{ padding: "15px" }}>
                  <h5>{prescription.medication}</h5>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">
                      Diagnosis Name:
                    </small>
                    <p>{prescription.diagnosisName}</p>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">
                      Prescribed Name:
                    </small>
                    <p>{prescription.prescribedName}</p>
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col-4 border-end pl-2 p-1">
                      <div className="fw-bold text-primary">
                        {prescription.dosage}
                      </div>
                      <small className="text-muted">Dosage</small>
                    </div>
                    <div className="col-4 border-end p-1">
                      <div className="fw-bold text-primary">
                        {prescription.duration}
                      </div>
                      <small className="text-muted">Duration</small>
                    </div>
                    <div className="col-4 pl-0 p-1">
                      <div
                        className="fw-bold"
                        style={{ color: getStatusColor(prescription.status) }}
                      >
                        {prescription.status}
                      </div>
                      <small className="text-muted">Status</small>
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">
                      Instructions:
                    </small>
                    <p>{truncateText(prescription.instructions, 80)}</p>
                  </div>

                  <div>
                    <Button
                      className="view-btn btn btn-outline-primary btn-sm"
                      variant="outline-primary"
                      size="sm"
                      style={{ float: "inline-end" }}
                      onClick={() => handleOpenModal(prescription)}
                    >
                      View All Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">No Prescribed Medications Found</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredPrescriptions.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
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
          <Modal.Title>{selectedMedication?.medication}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label="Diagnosis Name"
            value={selectedMedication?.diagnosisName}
            disabled
          />

          <Field
            label="Prescribed Name"
            value={selectedMedication?.prescribedName}
            disabled
          />

          <Field label="Dosage" value={selectedMedication?.dosage} disabled />
          <Field
            label="Duration"
            value={selectedMedication?.duration}
            disabled
          />

          <Field
            label="Status"
            value={selectedMedication?.status}
            disabled
            style={{ color: getStatusColor(selectedMedication?.status) }}
          />

          <TextAreaField
            label="Instructions"
            value={selectedMedication?.instructions || ""}
            disabled
          />
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button className="dc-btn dc-cancel-btn" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescribedMedicationMobileView;