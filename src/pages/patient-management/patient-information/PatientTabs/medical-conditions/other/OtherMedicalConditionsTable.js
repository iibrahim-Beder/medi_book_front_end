import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
// import "../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { t } from "i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";

const OtherMedicalConditions = () => {
  const [expandedRow, setExpandedRow] = useState(null);
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
  // Handle expand/collapse for notes
  const handleNotesClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

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

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">Other Medical Conditions</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
      </div>

      <div className="">
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
              conditions={conditionsData}
            />
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Medical Condition Name</th>
                  <th>Severity</th>
                  <th>Diagnosed Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((condition) => {
                  const statusInfo = getStatusInfo(condition.isActive);
                  return (
                    <React.Fragment key={condition.id}>
                      <tr>
                        <td title={condition.medicalConditionName}>
                          {condition.medicalConditionName}
                        </td>
                        <td>
                          <span 
                            style={{ 
                              color: getSeverityColor(condition.severity),
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            {condition.severity}
                          </span>
                        </td>
                        <td>{formatDate(condition.diagnosedDate)}</td>
                        <td>
                          <span 
                            style={{ 
                              color: statusInfo.color,
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td title={condition.notes}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              {truncateText(condition.notes, 80)}
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
                              onClick={() => handleNotesClick(condition.id)}
                            >
                              <MdExpandMore
                                style={{
                                  transform:
                                    expandedRow === condition.id
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for Notes */}
                      {expandedRow === condition.id && (
                        <tr className="table-active-content" style={{backgroundColor:"transparent"}}>
                          <td
                            colSpan="6"
                            className="border-0 background-in-hover-none"
                          >
                            <div className="description-expanded-section">
                              <TextAreaField
                                label="Notes"
                                value={condition.notes}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
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
                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredConditions.length)} of {filteredConditions.length} entries
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

export default OtherMedicalConditions;