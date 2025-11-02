// PrescriptionsMobileView.jsx
import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { MdClose, MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../shared/Pagination";

const PrescriptionsMobileView = () => {
  const { t } = useTranslation();

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [rowsPerPage] = useState(5);

  // Mock data (from your table)
  const prescriptionsData = [
    {
      id: "#RX001",
      diagnosisName: "Diabetes Mellitus Type 2",
      title: "Diabetes Management",
      status: "active",
      note: "Patient requires regular monitoring of blood sugar levels and kidney function. Follow-up appointment scheduled in 3 months. Patient advised to maintain healthy diet and exercise routine.",
      prescribedMedication: [
        {
          id: "PM001",
          medicationName: "Metformin",
          dosage: "500mg",
          duration: "30 days",
          instructions: "Take with meals to reduce gastrointestinal side effects",
        },
        {
          id: "PM002",
          medicationName: "Glucose Test Strips",
          dosage: "As needed",
          duration: "90 days",
          instructions: "Check blood sugar levels before each meal",
        },
      ],
    },
    {
      id: "#RX002",
      diagnosisName: "Hypertension",
      title: "Blood Pressure Control",
      status: "completed",
      note: "Monitor blood pressure regularly. Patient responded well to treatment with no significant side effects. Blood pressure stabilized within target range.",
      prescribedMedication: [
        {
          id: "PM003",
          medicationName: "Lisinopril",
          dosage: "10mg",
          duration: "90 days",
          instructions: "Take in the morning, monitor for cough side effect",
        },
      ],
    },
    {
      id: "#RX003",
      diagnosisName: "Migraine",
      title: "Headache Management",
      status: "cancelled",
      note: "Patient reported side effects including dizziness and nausea. Alternative treatment options to be discussed in next appointment.",
      prescribedMedication: [
        {
          id: "PM004",
          medicationName: "Sumatriptan",
          dosage: "50mg",
          duration: "30 days",
          instructions: "Take at onset of migraine, maximum 2 tablets per day",
        },
      ],
    },
    {
      id: "#RX004",
      diagnosisName: "Vitamin Deficiency",
      title: "Supplement Plan",
      status: "expired",
      note: "Prescription expired, needs renewal. Patient showed improvement in vitamin D levels. Follow-up blood test required before renewal.",
      prescribedMedication: [
        {
          id: "PM005",
          medicationName: "Vitamin D3",
          dosage: "1000 IU",
          duration: "60 days",
          instructions: "Take with fatty meal for better absorption",
        },
      ],
    },
  ];

  // Toggle notes expansion
  const toggleNotes = (prescriptionId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId]
    }));
  };

  // Filters
  const filteredPrescriptions = prescriptionsData
    .filter((p) => {
      if (!searchTerm) return true;
      return (
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosisName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.note.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((p) => {
      if (filterType && p.title !== filterType) return false;
      if (filterDateFrom || filterDateTo) {
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
        const toDate = filterDateTo ? new Date(filterDateTo) : null;
        const mockDate = new Date("2025-01-01"); // placeholder
        if (fromDate && toDate) return mockDate >= fromDate && mockDate <= toDate;
        if (fromDate) return mockDate >= fromDate;
        if (toDate) return mockDate <= toDate;
      }
      return true;
    });

  const totalItems = filteredPrescriptions.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = filteredPrescriptions.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalExited = () => {
    setSelectedPrescription(null);
  };

  const truncateText = (text, max = 70) =>
    !text ? "" : text.length <= max ? text : text.substring(0, max) + "...";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#3fabf3";
      case "completed":
        return "#4BAE78";
      case "cancelled":
        return "#D66A6A";
      case "expired":
        return "#7A8B97";
      default:
        return "#6C757D";
    }
  };

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('PrescriptionsMobileView.table_title')}</h3>
          <h6 className="table-subtitle">{t('PrescriptionsMobileView.table_subtitle')}</h6>
        </div>
      </div>

      <div className="p-2">
        <div className="">
          {/* Filters */}
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
            {currentItems.map((p) => {
              const isNotesExpanded = expandedNotes[p.id];
              
              return (
                <Card key={p.id} className="mobile-view-card">
                  <Card.Body style={{ padding: "15px" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ margin: 0 }}>{p.title}</h5>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">
                        {t('PrescriptionsMobileView.diagnosis')}
                      </small>
                      <p>{p.diagnosisName}</p>
                    </div>

                    {/* Notes Section with Expand/Collapse */}
                    <div className="mb-2">
                      <small
                        className="text-muted d-flex mb-1"
                        onClick={() => toggleNotes(p.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {t('PrescriptionsMobileView.note')} :
                        {p.note && (
                          <button
                            className=""
                            onClick={() => toggleNotes(p.id)}
                            style={{
                              fontSize: '20px',
                              color: '#278fff',
                              padding: "3px 0 0"
                            }}
                          >
                            <MdExpandMore
                            onClick={() => toggleNotes(p.id)}
                              style={{
                                transform: expandedNotes[p.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </button>
                        )}
                      </small>
                      <div className={`expandable-content ${expandedNotes[p.id] ? '' : 'p-0'}`}>
                        <p
                          style={{
                            margin: "0",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => toggleNotes(p.id)}
                        >
                          {expandedNotes[p.id] ? p.note : ""}
                        </p>
                      </div>
                    </div>

                    <div className="row justify-content-around text-center mb-3">
                      <div className="">
                        <div
                          className="fw-bold"
                          style={{ color: getStatusColor(p.status) }}
                        >
                          {t(`PrescriptionsMobileView.status_options.${p.status}`)}
                        </div>
                        <small className="text-muted">{t('PrescriptionsMobileView.status')}</small>
                      </div>
                      <div className="">
                        <div className="fw-bold text-primary">
                          {p.prescribedMedication.length}
                        </div>
                        <small className="text-muted">{t('PrescriptionsMobileView.medications')}</small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 1 }}></div>
                      <Button
                        className="view-btn btn btn-outline-primary btn-sm"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenModal(p)}
                      >
                        {t('PrescriptionsMobileView.view_all_details')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            {currentItems.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">{t('PrescriptionsMobileView.no_prescriptions_found')}</p>
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
          <Modal.Title>{selectedPrescription?.title}</Modal.Title>
          <button className="btn-modal-close" onClick={handleCloseModal}>
            <MdClose />
          </button>
        </Modal.Header>

        <Modal.Body className="space-y-4 pt-0">
          <Field
            label={t('PrescriptionsMobileView.diagnosis_name')}
            value={selectedPrescription?.diagnosisName || ""}
            disabled
          />

          <Field
            label={t('PrescriptionsMobileView.status')}
            value={selectedPrescription?.status ? t(`PrescriptionsMobileView.status_options.${selectedPrescription.status}`) : ""}
            disabled
          />

          <TextAreaField
            label={t('PrescriptionsMobileView.prescription_note')}
            value={selectedPrescription?.note || ""}
            disabled
          />

          <CustomAccordion
            titleBackgroundColor="var(--scbccolor)"
            title={t('PrescriptionsMobileView.medications')}
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            data={selectedPrescription?.prescribedMedication || []}
            formFields={[
              {
                label: t('PrescriptionsMobileView.medication_name'),
                name: "medicationName",
                placeholder: t('PrescriptionsMobileView.medication'),
              },
              { label: t('PrescriptionsMobileView.dosage'), name: "dosage", half: true },
              { label: t('PrescriptionsMobileView.duration'), name: "duration", half: true },
              {
                label: t('PrescriptionsMobileView.instructions'),
                name: "instructions",
                type: "textarea",
                placeholder: t('PrescriptionsMobileView.instructions'),
              },
            ]}
          />
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <button className="dc-btn dc-cancel-btn" onClick={handleCloseModal}>
            {t('PrescriptionsMobileView.close')}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescriptionsMobileView;