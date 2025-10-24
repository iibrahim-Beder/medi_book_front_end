import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdClose } from "react-icons/md";
import { t } from "i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import  Field  from "../../../../../ui/form-fields/Field";

const OtherMedicalConditionsMobileView = () => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Filters states
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing diagnosed conditions
  const conditionsData = [
    {
      id: "#DC001",
      medicalConditionName: "Rheumatoid Arthritis",
      severity: "Severe",
      diagnosedDate: "2022-08-12",
      isActive: true,
      notes: "Patient presents with symmetric polyarthritis affecting small joints of hands and feet. Morning stiffness lasting over 2 hours. Elevated CRP and ESR levels. Rheumatoid factor positive. Started on Methotrexate and Prednisone taper. Requires regular monitoring of liver function and blood counts."
    },
    {
      id: "#DC002",
      medicalConditionName: "Chronic Kidney Disease",
      severity: "Moderate",
      diagnosedDate: "2023-03-18",
      isActive: true,
      notes: "Estimated GFR 45 mL/min/1.73m². Secondary to long-standing hypertension. Proteinuria 450 mg/24h. Blood pressure well-controlled on ACE inhibitors. Advised renal protective diet: low sodium, moderate protein. Avoid NSAIDs and nephrotoxic agents. Regular monitoring of renal function every 3 months."
    },
    {
      id: "#DC003",
      medicalConditionName: "Generalized Anxiety Disorder",
      severity: "Moderate",
      diagnosedDate: "2021-11-05",
      isActive: true,
      notes: "Patient reports persistent worry, restlessness, muscle tension, and sleep disturbance. Experiencing panic attacks 2-3 times monthly. Started on SSRI and referred for cognitive behavioral therapy. Good response to treatment with reduced anxiety symptoms. Continuing medication and therapy sessions."
    },
    {
      id: "#DC004",
      medicalConditionName: "Osteoporosis",
      severity: "Mild",
      diagnosedDate: "2020-09-22",
      isActive: true,
      notes: "T-score -2.5 at lumbar spine. No previous fractures. Patient educated about fall prevention and importance of weight-bearing exercises. Started on calcium and vitamin D supplementation. Bisphosphonates initiated. Bone density scan scheduled in 2 years. Good adherence to treatment plan."
    },
    {
      id: "#DC005",
      medicalConditionName: "Psoriasis",
      severity: "Moderate",
      diagnosedDate: "2019-12-10",
      isActive: false,
      notes: "Extensive plaques covering approximately 15% of body surface area, primarily on elbows, knees, and scalp. Previously treated with topical corticosteroids and phototherapy. Condition resolved with biologic therapy. Patient currently in remission with clear skin. Monitoring for potential recurrence."
    },
    {
      id: "#DC006",
      medicalConditionName: "Hypothyroidism",
      severity: "Mild",
      diagnosedDate: "2018-06-30",
      isActive: true,
      notes: "TSH elevated at 8.5 mIU/L, free T4 low normal. Positive anti-TPO antibodies. Started on Levothyroxine 50 mcg daily. Symptoms of fatigue and weight gain improved with treatment. TSH now stable at 2.1 mIU/L on current dose. Requires lifelong thyroid replacement therapy with annual TSH monitoring."
    },
    {
      id: "#DC007",
      medicalConditionName: "Coronary Artery Disease",
      severity: "Severe",
      diagnosedDate: "2023-01-15",
      isActive: true,
      notes: "Significant stenosis in LAD, RCA, and LCx arteries. Status post CABG x3. EF 45%. On optimal medical therapy including beta-blocker, statin, aspirin, and ACE inhibitor. No current angina symptoms. Strict lipid control with LDL target <70 mg/dL. Cardiac rehab completed."
    },
    {
      id: "#DC008",
      medicalConditionName: "Chronic Obstructive Pulmonary Disease",
      severity: "Moderate",
      diagnosedDate: "2022-04-08",
      isActive: true,
      notes: "FEV1/FVC 60%, FEV1 65% predicted. Former smoker, quit 5 years ago. Symptoms include dyspnea on exertion and chronic cough. On LAMA/LABA inhaler therapy. Pulmonary rehab referral provided. Annual influenza vaccination and pneumococcal vaccine up to date. No recent exacerbations."
    }
  ];

  // Apply search & filters
  const filteredConditions = conditionsData
    .filter((condition) => {
      if (!searchTerm) return true; 
      if (searchBy === "all") {
        return Object.values(condition)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return condition[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    .filter((condition) => {
      if (filterType && condition.medicalConditionName !== filterType) return false;
      return true;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  // دالة لفتح المودال مع البيانات
  const handleOpenModal = (condition) => {
    setSelectedCondition(condition);
    setShowModal(true);
  };

  // دالة لإغلاق المودال
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // دالة لما المودال يخلص الإغلاق
  const handleModalExited = () => {
    setSelectedCondition(null);
  };

  const rowsPerPage = 5; 
  const totalPages = Math.ceil(filteredConditions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredConditions.slice(startIndex, startIndex + rowsPerPage);

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return '#4BAE78';  // Green
      case 'moderate':
        return '#FFA500';  // Orange
      case 'severe':
        return '#D66A6A';  // Red
      default:
        return '#6C757D';  // Gray
    }
  };

  // Get status color and text
  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? '#3fabf3' : '#7A8B97',
      text: isActive ? 'Active' : 'Inactive'
    };
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Other Medical Conditions</h3>
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
              conditions={conditionsData}
            />
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {currentData.map((condition) => {
              const statusInfo = getStatusInfo(condition.isActive);
              return (
                <Card 
                  key={condition.id} 
                  className="mobile-view-card" 
                  style={{ boxShadow: "0 0 20px 0px #dddddd70" }}
                >
                  <Card.Body style={{ padding: "15px" }}>
                    <h5>{condition.medicalConditionName}</h5>
                    <div className="row text-center mb-3">
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: getSeverityColor(condition.severity) }}
                        >
                          {condition.severity}
                        </div>
                        <small className="text-muted">Severity</small>
                      </div>
                      <div className="col-4 border-end">
                        <div
                          className="fw-bold"
                          style={{ color: statusInfo.color }}
                        >
                          {statusInfo.text}
                        </div>
                        <small className="text-muted">Status</small>
                      </div>
                      <div className="col-4 pl-0 pr-1 ">
                        <div className="fw-bold text-secondary">
                          {formatDate(condition.diagnosedDate)}
                        </div>
                        <small className="text-muted">Diagnosed Date</small>
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Notes:</small>
                      <p>{truncateText(condition.notes, 80)}</p>
                    </div>

                    <div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        style={{ float: "inline-end" }}
                        onClick={() => handleOpenModal(condition)}
                      >
                        View All Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentData.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">No Conditions Found</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredConditions.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
          <div style={{ fontSize: "14px", color: "#555" }}>
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredConditions.length)} of {filteredConditions.length} entries
          </div>

          <nav className="d-flex flex-wrap justify-content-center">
            <button
              className="dt-paging-button first"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              «
            </button>
            <button
              className="dt-paging-button previous"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`dt-paging-button none ${
                  currentPage === pageNumber ? "current" : ""
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              className="dt-paging-button next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
            <button
              className="dt-paging-button last"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              »
            </button>
          </nav>
        </div>
      )}

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
          <Modal.Title>{selectedCondition?.medicalConditionName}</Modal.Title>
          <button
            className="btn-modal-close"
            onClick={handleCloseModal}
          >
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
         

          {/* <div className="row mb-3"> */}
         <Field label="Severity" value={selectedCondition?.severity} disabled/>
          <Field label="Status" value={selectedCondition?.isActive} disabled/>
          {/* </div> */}

          <Field className="mb-3" label="Diagnosed Date" value={selectedCondition?.diagnosedDate} disabled/>

          <TextAreaField
            label="Notes"
            value={selectedCondition?.notes || ""}
            disabled
          />
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button
            className="dc-btn dc-cancel-btn"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OtherMedicalConditionsMobileView;