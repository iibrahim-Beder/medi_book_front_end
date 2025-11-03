// DiagnosisMobileView.jsx
import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import CustomAccordion from "../../../../shareds/CustomAccordion";
import TwoLevelAccordion from "../../../../shareds/TwoLevelAccordion";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import { MdClose, MdExpandMore } from "react-icons/md";
import Pagination from "../../../../shareds/Pagination";

const DiagnosisMobileView = () => {
  const { t } = useTranslation();

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Number of items per page

  // Mock data representing diseases and related records
  const diseasesData = [
    {
      id: "#DZ001",
      diagnosisName: "Diabetes Mellitus Type 2",
      symptomsDescription: "Increased thirst, frequent urination, fatigue, blurred vision, unexplained weight loss, slow healing of cuts and wounds, tingling or numbness in hands or feet",
      diagnosisDescription: "Chronic condition affecting the way the body processes blood sugar. Characterized by insulin resistance and relative insulin deficiency. Long-term complications include cardiovascular disease, stroke, chronic kidney disease, foot ulcers, and damage to the eyes.",
      diagnosedConditions: [
        { MedicalCondition: "Diabetic Retinopathy", Severity: "Moderate", note: "Requires regular monitoring" },
        { MedicalCondition: "Hypertension", Severity: "severe", note: "patient has high blood pressure" },
      ],
      notes: [
        { title: "Diabetes Management", content: "Patient started on Metformin 500mg twice daily" },
        { title: "the checkups specialist", content: "Blood sugar levels improving with medication" },
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
  ];

  // Toggle symptoms description expansion
  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId]
    }));
  };

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

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('DiagnosisMobileView.table_title')}</h3>
          <h6 className="table-subtitle">{t('DiagnosisMobileView.table_subtitle')}</h6>
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
                      {t('DiagnosisMobileView.symptoms')}
                    </small>
                    <p className="mb-2">
                      {truncateText(disease.symptomsDescription, 80)}
                    </p>
                  </div>

                    {/* Symptoms Description with Expand/Collapse */}
                    <div className="mb-2">
                      <small
                        className="text-muted d-flex mb-1"
                        onClick={() => toggleDescription(disease.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {t('DiagnosisMobileView.diagnosis_description')} :
                        {disease.symptomsDescription && (
                          <button
                            className=""
                            onClick={() => toggleDescription(disease.id)}
                            style={{
                              fontSize: '20px',
                              color: '#278fff',
                              padding: "3px 0 0"
                            }}
                          >
                            <MdExpandMore
                            onClick={() => toggleDescription(disease.id)}
                              style={{
                                transform: expandedDescriptions[disease.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </button>
                        )}
                      </small>
                      <div className={`expandable-content ${expandedDescriptions[disease.id] ? '' : 'p-0'}`}>
                        <p
                          style={{
                            margin: "0",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => toggleDescription(disease.id)}
                        >
                          {expandedDescriptions[disease.id] ? disease.diagnosisDescription : ""}
                        </p>
                      </div>
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {disease.diagnosedConditions.length}
                          </div>
                          <small className="text-muted">{t('DiagnosisMobileView.conditions')}</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border-end">
                          <div className="fw-bold text-primary">
                            {disease.notes.length}
                          </div>
                          <small className="text-muted">{t('DiagnosisMobileView.notes')}</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-primary">
                          {disease.prescription.length}
                        </div>
                        <small className="text-muted">{t('DiagnosisMobileView.prescription')}</small>
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
                        {t('DiagnosisMobileView.view_all_details')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentItems.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t('DiagnosisMobileView.no_diagnosis_found')}</p>
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

          <Modal.Body className="space-y-4 pt-0">
            {/* Symptoms Description */}
            <div className="mb-4">
              <Field
                label={t('DiagnosisMobileView.symptoms_description')}
                value={selectedDiagnosis.symptomsDescription}
                disabled
              />
            </div>

            {/* Diagnosis Description */}
            <div className="mb-4">
              <Field
                label={t('DiagnosisMobileView.diagnosis_description')}
                value={selectedDiagnosis.diagnosisDescription}
                disabled
              />
            </div>

            {/* Diagnosed Conditions */}
            <div className="mb-4">
              <CustomAccordion
                titleBackgroundColor="var(--scbccolor)"
                title={t('DiagnosisMobileView.conditions')}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.diagnosedConditions}
                formFields={[
                  {
                    label: t('DiagnosisMobileView.medical_condition'),
                    name: "MedicalCondition",
                    placeholder: t('DiagnosisMobileView.condition_type'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.severity'),
                    name: "Severity",
                    placeholder: t('DiagnosisMobileView.severity'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.note'),
                    name: "note",
                    type: "textarea",
                    placeholder: t('DiagnosisMobileView.note_content'),
                  },
                ]}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <CustomAccordion
                titleBackgroundColor="var(--scbccolor)"
                title={t('DiagnosisMobileView.notes')}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.notes}
                formFields={[
                  {
                    label: t('DiagnosisMobileView.note_content'),
                    name: "content",
                    type: "textarea",
                    placeholder: t('DiagnosisMobileView.note_content'),
                  },
                ]}
              />
            </div>

            {/* Prescription */}
            <div className="mb-4">
              <TwoLevelAccordion
                title={t('DiagnosisMobileView.prescription')}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                titleBackgroundColor="var(--scbccolor)"
                data={selectedDiagnosis.prescription}
                formFields={[
                  {
                    label: t('DiagnosisMobileView.prescription_title'),
                    name: "title",
                    type: "text",
                    placeholder: t('DiagnosisMobileView.prescription_title'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.status'),
                    name: "status",
                    placeholder: t('DiagnosisMobileView.status'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.note'),
                    name: "note",
                    type: "textarea",
                    placeholder: t('DiagnosisMobileView.prescription_note'),
                  },
                ]}
                formFieldsRecipe={[
                  { label: t('DiagnosisMobileView.type'), name: "type", placeholder: t('DiagnosisMobileView.type') },
                  {
                    label: t('DiagnosisMobileView.dosage'),
                    name: "dosage",
                    placeholder: t('DiagnosisMobileView.dosage'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.duration_days'),
                    name: "durationInDays",
                    type: "number",
                    placeholder: t('DiagnosisMobileView.duration_days'),
                    half: true,
                  },
                  {
                    label: t('DiagnosisMobileView.instructions'),
                    name: "instructions",
                    placeholder: t('DiagnosisMobileView.instructions'),
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
              {t('DiagnosisMobileView.close')}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DiagnosisMobileView;