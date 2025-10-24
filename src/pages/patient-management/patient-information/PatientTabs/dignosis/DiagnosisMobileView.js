  import React, { useState } from "react";
  import { Button, Modal, Card } from "react-bootstrap";
  import CustomAccordion from "../../../../shared/CustomAccordion";
  import TwoLevelAccordion from "../../../../shared/TwoLevelAccordion";
  import Field from "../../../../ui/form-fields/Field";
  import ConditionsFilters from "../component/ConditionsFilters";
  import { t } from "i18next";
import { MdClose } from "react-icons/md";
import Pagination from "../../../../shared/Pagination";

  const DiagnosisMobileView = () => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState(null);
    const [filterDateTo, setFilterDateTo] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of items per page

    // Mock data representing diseases and related records
    const diseasesData = [
      {
        id: "#DZ001",
        diagnosisName: "Diabetes Mellitus Type 2",
        symptomsDescription: "Increased thirst, frequent urination, fatigue, blurred vision",
        diagnosisDescription: "Chronic condition affecting the way the body processes blood sugar",
        diagnosedConditions: [
          { MedicalCondition: "Diabetic Retinopathy", Severity: "Moderate", note: "Requires regular monitoring" },
          { MedicalCondition: "Hypertension", Severity: "severe", note: "patient has high blood pressure" },
        ],
        notes: [
          { title: "Diabetes Management", content: "Patient started on Metformin 500mg twice daily" },
          {  title: " the checkups specialist",content: "Blood sugar levels improving with medication" },
        ],
        prescription: [
          {
            id: "RX001",
            title: "Diabetes Management",
            status: "completed",
            isExpanded: false,
            note: "Patient requires regular monitoring",
            recipes: [
              { type: "medication", durationInDays: 30, instructions: "Patient started on Metformin 500mg twice daily", dosage: "2 tablets per day" },
              { type: "referral", durationInDays: 20, instructions: "Referred to ophthalmologist for regular checkups", dosage: "5 times per week" },
            ]
          },
          {
            id: "RX002",
            title: "Eye Care",
            date: "2025-03-20",
            isExpanded: false,
            type: "Specialist",
            recipes: [
              { type: "Referral", date: "2025-03-20", content: "Referred to ophthalmologist for regular checkups" },
            ]
          }
        ],
      },
      {
        id: "#DZ002",
        diagnosisName: "Hypertension",
        symptomsDescription: "Headaches, shortness of breath, nosebleeds",
        diagnosisDescription: "High blood pressure condition",
        diagnosedConditions: [
          { MedicalCondition: "Primary Hypertension", Severity: "Mild", note: "Lifestyle modifications recommended" },
        ],
        notes: [
          { content: "Patient advised to reduce salt intake" },
          { content: "Regular blood pressure monitoring required" },
        ],
        prescription: [
          {
            id: "RX003",
            title: "Blood Pressure Management",
            status: "active",
            isExpanded: false,
            note: "Monitor blood pressure weekly",
            recipes: [
              { type: "medication", durationInDays: 30, instructions: "Lisinopril 10mg daily", dosage: "1 tablet per day" },
            ]
          }
        ],
      },
      {
        id: "#DZ003",
        diagnosisName: "Asthma",
        symptomsDescription: "Wheezing, coughing, chest tightness",
        diagnosisDescription: "Chronic respiratory condition",
        diagnosedConditions: [
          { MedicalCondition: "Allergic Asthma", Severity: "Moderate", note: "Triggered by allergens" },
        ],
        notes: [
          { content: "Patient uses inhaler as needed" },
          { content: "Avoid known allergens" },
        ],
        prescription: [
          {
            id: "RX004",
            title: "Respiratory Care",
            status: "active",
            isExpanded: false,
            note: "Keep rescue inhaler available",
            recipes: [
              { type: "medication", durationInDays: 90, instructions: "Albuterol inhaler", dosage: "2 puffs as needed" },
            ]
          }
        ],
      },
      {
        id: "#DZ004",
        diagnosisName: "Migraine",
        symptomsDescription: "Severe headaches, nausea, sensitivity to light",
        diagnosisDescription: "Neurological condition characterized by recurrent headaches",
        diagnosedConditions: [
          { MedicalCondition: "Chronic Migraine", Severity: "Severe", note: "Frequency: 15+ days per month" },
        ],
        notes: [
          { content: "Patient experiences aura before attacks" },
          { content: "Triggers include stress and certain foods" },
        ],
        prescription: [
          {
            id: "RX005",
            title: "Migraine Management",
            status: "completed",
            isExpanded: false,
            note: "Preventive and abortive therapy",
            recipes: [
              { type: "medication", durationInDays: 30, instructions: "Sumatriptan 50mg", dosage: "1 tablet at onset" },
            ]
          }
        ],
      },
      {
        id: "#DZ005",
        diagnosisName: "Arthritis",
        symptomsDescription: "Joint pain, stiffness, swelling",
        diagnosisDescription: "Inflammation of one or more joints",
        diagnosedConditions: [
          { MedicalCondition: "Osteoarthritis", Severity: "Moderate", note: "Affects knees and hips" },
        ],
        notes: [
          { content: "Patient benefits from physical therapy" },
          { content: "Weight management recommended" },
        ],
        prescription: [
          {
            id: "RX006",
            title: "Joint Pain Management",
            status: "active",
            isExpanded: false,
            note: "Pain management and mobility improvement",
            recipes: [
              { type: "medication", durationInDays: 60, instructions: "Ibuprofen 400mg", dosage: "3 times daily as needed" },
            ]
          }
        ],
      },
      {
        id: "#DZ006",
        diagnosisName: "Anxiety Disorder",
        symptomsDescription: "Excessive worry, restlessness, fatigue",
        diagnosisDescription: "Mental health disorder characterized by feelings of worry and fear",
        diagnosedConditions: [
          { MedicalCondition: "Generalized Anxiety Disorder", Severity: "Moderate", note: "Cognitive behavioral therapy recommended" },
        ],
        notes: [
          { content: "Patient practicing mindfulness techniques" },
          { content: "Regular follow-up appointments scheduled" },
        ],
        prescription: [
          {
            id: "RX007",
            title: "Anxiety Treatment",
            status: "active",
            isExpanded: false,
            note: "Combination therapy approach",
            recipes: [
              { type: "medication", durationInDays: 30, instructions: "Sertraline 50mg daily", dosage: "1 tablet per day" },
              { type: "therapy", durationInDays: 90, instructions: "Weekly counseling sessions", dosage: "1 hour per week" },
            ]
          }
        ],
      }
    ];

    // Apply search & filters
    const filteredDiseases = diseasesData
      .filter((disease) => {
        if (!searchTerm) return true;
        return disease.diagnosisName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              disease.symptomsDescription?.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter((disease) => {
        if (filterType && disease.diagnosisName !== filterType) return false;
        
        // Filter by date range (based on first diagnosed condition)
        if (filterDateFrom || filterDateTo) {
          const diagnosisDate = new Date(disease.diagnosedConditions[0]?.date);
          const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
          const toDate = filterDateTo ? new Date(filterDateTo) : null;

          if (fromDate && toDate) return diagnosisDate >= fromDate && diagnosisDate <= toDate;
          if (fromDate) return diagnosisDate >= fromDate;
          if (toDate) return diagnosisDate <= toDate;
        }
        return true;
      });

    // Pagination calculations
    const totalItems = filteredDiseases.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentItems = filteredDiseases.slice(startIndex, endIndex);

    // Reset filters and pagination
    const resetFilters = () => {
      setSearchTerm("");
      setFilterType("");
      setFilterDateFrom(null);
      setFilterDateTo(null);
      setCurrentPage(1); // Reset to first page when filters are cleared
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    // Utility: truncate long text
    const truncateText = (text, maxLength = 70) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
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
      <div className="table-container mobile-view-card ">
        <div className="table-header">
          <div>
            <h3 className="table-title">Diagnosis list</h3>
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
                onSearch={() => setCurrentPage(1)} // Reset to first page on search
                conditions={diseasesData}
              />
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3">
              {currentItems.map((disease) => (
                <Card
                  key={disease.id}
                  className="mobile-view-card"
                  style={{ boxShadow: "0 0 20px 0px #dddddd70 " }}
                >
                  <Card.Body className="" style={{ padding: "15px" }}>
                    <div className="">
                      <h5 className="">{disease.diagnosisName}</h5>{" "}
                    </div>

                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">
                        {" "}
                        Symptoms :
                      </small>
                      <p className="mb-2">
                        {truncateText(disease.symptomsDescription, 80)}
                      </p>
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {disease.diagnosedConditions.length}
                          </div>
                          <small className="text-muted"> Conditions </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {disease.notes.length}
                          </div>
                          <small className="text-muted"> Notes </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-primary">
                          {disease.prescription.length}
                        </div>
                        <small className="text-muted"> Prescription </small>
                      </div>
                    </div>

                    <div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        style={{ float: "inline-end" }}
                        onClick={() => setSelectedDiagnosis(disease)}
                      >
                        View All Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {currentItems.length === 0 && (
                <Card className="text-center py-5">
                  <Card.Body>
                    <p className="text-muted"> No Diagnosis Found </p>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredDiseases.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
        />

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
              {/* Close button (icon only, styled manually) */}
              <button
                className="btn-modal-close"
                onClick={() => setSelectedDiagnosis(null)}
                onMouseOver={(e) => (e.target.style.opacity = "1")}
                onMouseOut={(e) => (e.target.style.opacity = "0.8")}
              >
                <MdClose />
              </button>
            </Modal.Header>

            <Modal.Body className="space-y-4 pt-0 ">
              {/* Symptoms Description */}
              <div className="mb-4">
                <Field
                  label=" symptoms Description "
                  value={selectedDiagnosis.symptomsDescription}
                  disabled
                />
              </div>

              {/* Diagnosis Description */}
              <div className="mb-4">
                <Field
                  label=" diagnosis Description "
                  value={selectedDiagnosis.diagnosisDescription}
                  disabled
                />
              </div>

              {/* Diagnosed Conditions */}
              <div className="mb-4">
                <CustomAccordion
                  titleBackgroundColor="var(--scbccolor)"
                  title=" Conditions  "
                  readOnly={true}
                  backgroundColor="var(--scbccolor)"
                  data={selectedDiagnosis.diagnosedConditions}
                  formFields={[
                    {
                      label: "Medical Condition",
                      name: "MedicalCondition",
                      placeholder: "Condition Type",
                      half: true,
                    },
                    {
                      label: "Severity",
                      name: "Severity",
                      placeholder: "Severity",
                      half: true,
                    },
                    {
                      label: "Note",
                      name: "note",
                      type: "textarea",
                      placeholder: "Note Content",
                    },
                  ]}
                />
              </div>

              {/* Notes */}
              <div className="mb-4">
                <CustomAccordion
                  titleBackgroundColor="var(--scbccolor)"
                  title=" Notes  "
                  readOnly={true}
                  backgroundColor="var(--scbccolor)"
                  data={selectedDiagnosis.notes}
                  formFields={[
                    {
                      label: "Note Content",
                      name: "content",
                      type: "textarea",
                      placeholder: "Note Content",
                    },
                  ]}
                />
              </div>

              {/* Prescription */}
              <div className="mb-4">
                <TwoLevelAccordion
                  title=" Prescription  "
                  readOnly={true}
                  backgroundColor="var(--scbccolor)"
                  titleBackgroundColor="var(--scbccolor)"
                  data={selectedDiagnosis.prescription}
                  formFields={[
                    {
                      label: "Prescription Title",
                      name: "title",
                      type: "text",
                      placeholder: "Prescription Title",
                      half: true,
                    },
                    {
                      label: "Status",
                      name: "status",
                      placeholder: "Status",
                      half: true,
                    },
                    {
                      label: "Note",
                      name: "note",
                      type: "textarea",
                      placeholder: "Prescription note",
                    },
                  ]}
                  formFieldsRecipe={[
                    { label: "Type", name: "type", placeholder: "Type" },
                    {
                      label: "Dosage",
                      name: "dosage",
                      placeholder: "Dosage",
                      half: true,
                    },
                    {
                      label: "Duration (Days)",
                      name: "durationInDays",
                      type: "number",
                      placeholder: "Duration (Days)",
                      half: true,
                    },
                    {
                      label: "Instructions",
                      name: "instructions",
                      placeholder: "Instructions",
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
                close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  };

  export default DiagnosisMobileView;