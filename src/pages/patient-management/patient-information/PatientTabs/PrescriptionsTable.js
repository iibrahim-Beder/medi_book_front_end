import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../Patient-management.css";
import CustomAccordion from "../../../shared/CustomAccordion";
import { MdExpandMore } from "react-icons/md";
import Field from "../../../ui/form-fields/Field";
import ConditionsFilters from "./component/ConditionsFilters";
import { t } from "i18next";

const PrescriptionsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Filters states
  const [filterType, setFilterType] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing prescriptions and related records
  const prescriptionsData = [
    {
      id: "#RX001",
      diagnosisName: "Diabetes Mellitus Type 2",
      title: "Diabetes Management",
      status: "active",
      note: "Patient requires regular monitoring",
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
      ]
    },
    {
      id: "#RX002",
      diagnosisName: "Hypertension",
      title: "Blood Pressure Control",
      status: "completed",
      note: "Monitor blood pressure regularly",
      prescribedMedication: [
        { 
          id: "PM003",
          medicationName: "Lisinopril",
          dosage: "10mg", 
          duration: "90 days",
          instructions: "Take in the morning, monitor for cough side effect",
        },
      ]
    },
    {
      id: "#RX003",
      diagnosisName: "Migraine",
      title: "Headache Management",
      status: "cancelled",
      note: "Patient reported side effects",
      prescribedMedication: [
        { 
          id: "PM004",
          medicationName: "Sumatriptan",
          dosage: "50mg", 
          duration: "30 days",
          instructions: "Take at onset of migraine, maximum 2 tablets per day",
        },
      ]
    },
    {
      id: "#RX004",
      diagnosisName: "Vitamin Deficiency",
      title: "Supplement Plan",
      status: "expired",
      note: "Prescription expired, needs renewal",
      prescribedMedication: [
        { 
          id: "PM005",
          medicationName: "Vitamin D3",
          dosage: "1000 IU", 
          duration: "60 days",
          instructions: "Take with fatty meal for better absorption",

        },
      ]
    }
  ];

  // Handle expand/collapse for row fields
  const handleViewClick = (id, field) => {
    if (expandedRow === id && expandedField === field) {
      setExpandedRow(null);
      setExpandedField(null);
    } else {
      setExpandedRow(id);
      setExpandedField(field);
    }
  };

  // Apply search & filters
  const filteredPrescriptions = prescriptionsData
    .filter((prescription) => {
      if (!searchTerm) return true; 
      if (searchBy === "all") {
        return Object.values(prescription)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return prescription[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    .filter((prescription) => {
      if (filterType && prescription.title !== filterType) return false;
      
      // Filter by date range based on prescribed medicationName dates
      if (filterDateFrom || filterDateTo) {
        const hasMatchingDate = prescription.prescribedMedication.some(med => {
          const startDate = new Date(med.startDate);
          const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
          const toDate = filterDateTo ? new Date(filterDateTo) : null;

          if (fromDate && toDate) return startDate >= fromDate && startDate <= toDate;
          if (fromDate) return startDate >= fromDate;
          if (toDate) return startDate <= toDate;
          return true;
        });
        return hasMatchingDate;
      }
      return true;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const rowsPerPage = 5; 
  const totalPages = Math.ceil(filteredPrescriptions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredPrescriptions.slice(startIndex, startIndex + rowsPerPage);

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#28A745';
      case 'completed':
        return '#007BFF'; 
      case 'cancelled':
        return '#DC3545'; 
      case 'expired':
        return '#6C757D'; 
      default:
        return '#6C757D';
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">Prescriptions list</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
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

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Diagnosis Name</th>
                  <th>Prescription Title</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Medication</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((prescription) => (
                  <React.Fragment key={prescription.id}>
                    <tr>
                      <td>{prescription.diagnosisName}</td>
                      
                      {/* Prescription Title */}
                      <td>{prescription.title}</td>
                      
                      {/* Status with colored text */}
                      <td>
                        <span 
                          style={{ 
                            color: getStatusColor(prescription.status),
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {prescription.status}
                        </span>
                      </td>

                      {/* Note with expand/collapse */}
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {truncateText(prescription.note, 70)}
                          </span>
                          <Button
                            className="view-btn ms-2"
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                              color: "#278fff",
                              padding: 0,
                              fontSize: "19px",
                              height: "20px",
                            }}
                            onClick={() =>
                              handleViewClick(prescription.id, "note")
                            }
                          >
                            <MdExpandMore
                              style={{
                                transform:
                                  expandedRow === prescription.id &&
                                  expandedField === "note"
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </Button>
                        </div>
                      </td>

                      {/* Prescribed Medication - Custom Accordion */}
                      <td>
                        <Button
                          className="view-btn"
                          size="sm"
                          variant={
                            expandedRow === prescription.id &&
                            expandedField === "prescribedMedication"
                              ? "primary"
                              : "outline-primary"
                          }
                          onClick={() =>
                            handleViewClick(prescription.id, "prescribedMedication")
                          }
                          disabled={prescription.prescribedMedication.length === 0}
                        >
                          View
                          {prescription.prescribedMedication.length > 0 && (
                            <span
                              className="num-item"
                              style={{
                                backgroundColor:
                                  expandedRow === prescription.id &&
                                  expandedField === "prescribedMedication"
                                    ? "#f8f9fa"
                                    : "transparent",
                              }}
                            >
                              {prescription.prescribedMedication.length}
                            </span>
                          )}
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded row content (conditionally rendered based on field) */}
                    {expandedRow === prescription.id && (
                      <tr className="table-active-content" style={{backgroundColor:"transparent"}}>
                        <td
                          colSpan="5"
                          className="border-0 background-in-hover-none"
                        >
                          <div>
                            {expandedField === "note" && (
                              <div className="description-expanded-section">
                                <Field
                                  label="Prescription Note"
                                  value={prescription.note}
                                  disabled
                                />
                              </div>
                            )}

                            {expandedField === "prescribedMedication" && (
                              <CustomAccordion
                                readOnly={true}
                                backgroundColor="var(--scbccolor)"
                                data={prescription.prescribedMedication}
                                formFields={[
                                  { name: "medicationName", placeholder: "Medication Name", label: "Medication" },
                                  { name: "dosage", placeholder: "Dosage", half: true, label: "Dosage" },
                                  { name: "duration", placeholder: "Duration", half: true, label: "Duration" },
                                  { name: "instructions", type: "textarea", placeholder: "Instructions", label: "Instructions" },
                                ]}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            <div
              className="dt-layout-cell dt-layout-start"
              style={{ fontSize: "14px", color: "#555" }}
            >
              <div className="dt-info">
                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredPrescriptions.length)} of {filteredPrescriptions.length} entries
              </div>
            </div>

            <div className="dt-layout-cell dt-layout-end">
              <div className="dt-paging">
                <nav aria-label="pagination" className="d-flex">
                  <button className="dt-paging-button first" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
                  <button className="dt-paging-button previous" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`dt-paging-button none ${currentPage === index + 1 ? "current" : ""}`}
                      type="button"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button className="dt-paging-button next" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
                  <button className="dt-paging-button last" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsTable;