  import React, { useState } from "react";
  import { Table, Button } from "react-bootstrap";
  import "../../Patient-management.css";
  import CustomAccordion from "../../../shared/CustomAccordion";
  import TwoLevelAccordion from "../../../shared/TwoLevelAccordion";
  import { MdExpandMore } from "react-icons/md";
  import Field from "../../../ui/form-fields/Field";
  import ConditionsFilters from "./component/ConditionsFilters";
import { t } from "i18next";

  const DiagnosisTable = () => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedField, setExpandedField] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("all");
    const [currentPage, setCurrentPage] = useState(1); 
    
    // Filters states
    const [filterType, setFilterType] = useState("");       
    const [filterDateFrom, setFilterDateFrom] = useState(null);
    const [filterDateTo, setFilterDateTo] = useState(null);

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
          {  content: "Patient started on Metformin 500mg twice daily" },
          {  content: "Blood sugar levels improving with medication" },
        ],
        prescription: [
          {
            id: "RX001",
            title: "Diabetes Management",
            status:"completed" ,
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
      // other diseases here...
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
    const filteredDiseases = diseasesData
      .filter((disease) => {
        if (!searchTerm) return true; 
        if (searchBy === "all") {
          return Object.values(disease)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else {
          return disease[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase());
        }
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

    const resetFilters = () => {
      setSearchTerm("");
      setFilterType("");
      setFilterDateFrom(null);
      setFilterDateTo(null);
      setCurrentPage(1);
    };

    const rowsPerPage = 5; 
    const totalPages = Math.ceil(filteredDiseases.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = filteredDiseases.slice(startIndex, startIndex + rowsPerPage);

    // Utility: truncate long text
    const truncateText = (text, maxLength = 900) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    return (
      <div className="table-container">
        <div className="table-header">
          <div>
            <h3 className="table-title">Diagnosis list</h3>
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
                conditions={diseasesData}
              />
            </div>

            {/* Data Table */}
            <div style={{ overflow: "auto" }}>
              <Table className="data-table align-middle mb-0 table-hover">
                <thead>
                  <tr>
                    <th>Diagnosis Name</th>
                    <th>Symptoms Description</th>
                    <th>Diagnosis Description</th>
                    <th>Conditions</th>
                    <th>Notes</th>
                    <th>Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((disease) => (
                    <React.Fragment key={disease.id}>
                      <tr>
                        <td>{disease.diagnosisName}</td>

                        {/* Symptoms Description with expand/collapse */}
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {truncateText(disease.symptomsDescription, 70)}
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
                                handleViewClick(disease.id, "symptomsDescription")
                              }
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === disease.id &&
                                    expandedField === "symptomsDescription"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                          </div>
                        </td>

                        {/* Diagnosis Description with expand/collapse */}
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >                         
                              {truncateText(disease.diagnosisDescription, 90)}
                            </span>
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                color: "#278fff",
                                padding: 0,
                                fontSize: "19px",
                                height: "20px",
                              }}
                              className="view-btn ms-2"
                              size="sm"
                              onClick={() =>
                                handleViewClick(
                                  disease.id,
                                  "diagnosisDescription"
                                )
                              }
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === disease.id &&
                                    expandedField === "diagnosisDescription"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                          </div>
                        </td>

                        {/* Diagnosed Conditions - Read Only Accordion */}
                        <td>
                          <Button
                            className="view-btn"
                            size="sm"
                            variant={
                              expandedRow === disease.id &&
                              expandedField === "diagnosedConditions"
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() =>
                              handleViewClick(disease.id, "diagnosedConditions")
                            }
                            disabled={disease.diagnosedConditions.length === 0}
                          >
                            View
                            {disease.diagnosedConditions.length > 0 && (
                              <span
                                className="num-item"
                                style={{
                                  backgroundColor:
                                    expandedRow === disease.id &&
                                    expandedField === "diagnosedConditions"
                                      ? "#f8f9fa"
                                      : "transparent",
                                }}
                              >
                                {disease.diagnosedConditions.length}
                              </span>
                            )}
                          </Button>
                        </td>

                        {/* Notes - Read Only Accordion */}
                        <td>
                          <Button
                            className="view-btn"
                            size="sm"
                            variant={
                              expandedRow === disease.id &&
                              expandedField === "notes"
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() => handleViewClick(disease.id, "notes")}
                            disabled={disease.notes.length === 0}
                          >
                            View
                            {disease.notes.length > 0 && (
                              <span
                                className="num-item"
                                style={{
                                  backgroundColor:
                                    expandedRow === disease.id &&
                                    expandedField === "notes"
                                      ? "#f8f9fa"
                                      : "transparent",
                                }}
                              >
                                {disease.notes.length}
                              </span>
                            )}
                          </Button>
                        </td>

                        {/* Prescription - TwoLevelAccordion (Read Only) */}
                        <td>
                          <Button
                            className="view-btn"
                            size="sm"
                            variant={
                              expandedRow === disease.id &&
                              expandedField === "prescription"
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() =>
                              handleViewClick(disease.id, "prescription")
                            }
                            disabled={disease.prescription.length === 0}
                          >
                            View
                            {disease.prescription.length > 0 && (
                              <span
                                className="num-item"
                                style={{
                                  backgroundColor:
                                    expandedRow === disease.id &&
                                    expandedField === "prescription"
                                      ? "#f8f9fa"
                                      : "transparent",
                                }}
                              >
                                {disease.prescription.length}
                              </span>
                            )}
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded row content (conditionally rendered based on field) */}
                      {expandedRow === disease.id && (
                        <tr className="table-active-content" style={{backgroundColor:"transparent"}}>
                          <td
                            colSpan="6"
                            className="border-0 background-in-hover-none"
                          >
                            <div>
                              {expandedField === "symptomsDescription" && (
                                <div className="description-expanded-section">
                                  <Field
                                    label="Symptoms Description"
                                    value={disease.symptomsDescription}
                                    disabled
                                  />
                                </div>
                              )}

                              {expandedField === "diagnosisDescription" && (
                                <div className="description-expanded-section">
                                  <Field 
                                    label="Diagnosis Description"
                                    value={disease.diagnosisDescription}
                                    disabled
                                  />
                                </div>
                              )}

                              {expandedField === "diagnosedConditions" && (
                                <CustomAccordion
                                  readOnly={true}
                                  backgroundColor="var(--scbccolor)"
                                  data={disease.diagnosedConditions}
                                  formFields={[
                                    { name: "MedicalCondition", placeholder: "Condition Type", half: true },
                                    { name: "Severity", placeholder: "Severity", half: true },
                                    { name: "note", type: "textarea", placeholder: "Note Content" },
                                  ]}
                                />
                              )}

                              {expandedField === "notes" && (
                                <CustomAccordion
                                  readOnly={true}
                                  backgroundColor="var(--scbccolor)"
                                  data={disease.notes}
                                  formFields={[
                                  { name: "content", type: "textarea", placeholder: "Note Content" },
                                  ]}
                                />
                              )}

                              {expandedField === "prescription" && (
                                <TwoLevelAccordion
                                  readOnly={true}
                                  backgroundColor="var(--scbccolor)"
                                  titleBackgroundColor="var(--scbccolor)"
                                  data={disease.prescription}
                                  formFields={[
                                    { name: "title", type: "text", placeholder: "Prescription Title", half: true ,lable:"Prescription Title"},
                                    { name: "status", placeholder: "Status", half: true },
                                    { name: "note", type: "textarea", placeholder: "Prescription note" },
                                  ]}
                                  onAddRecipe={() => {}}
                                  onDeleteRecipe={() => {}}
                                  onUpdateRecipe={() => {}}
                                  onSaveRecipe={() => {}}
                                  formFieldsRecipe={[
                                    { name: "medication", placeholder: "Medication" },
                                    { name: "dosage", placeholder: "dosage", half: true },
                                    { name: "durationInDays", type: "durationInDays", placeholder: "Date", half: true },
                                    { name: "instructions", placeholder: "instructions", type: "textarea" },
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
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredDiseases.length)} of {filteredDiseases.length} entries
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

  export default DiagnosisTable;
