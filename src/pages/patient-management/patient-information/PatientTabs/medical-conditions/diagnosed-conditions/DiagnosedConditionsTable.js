// DiagnosedConditionsTable.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../../../Patient-management.css";
import ConditionsFilters from "../../component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../../../ui/form-fields/TextAreaField";
import Pagination from "../../../../../shareds/Pagination";

const DiagnosedConditionsTable = () => {
  const { t } = useTranslation();
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
      diagnosisName: "Seropositive Rheumatoid Arthritis",
      diagnosedDate: "2022-08-12",
      isActive: true,
      notes:
        "Patient presents with symmetric polyarthritis affecting small joints of hands and feet. Morning stiffness lasting over 2 hours. Elevated CRP and ESR levels. Rheumatoid factor positive. Started on Methotrexate and Prednisone taper. Requires regular monitoring of liver function and blood counts.",
    },
    {
      id: "#DC002",
      medicalConditionName: "Chronic Kidney Disease",
      severity: "Moderate",
      diagnosisName: "CKD Stage 3",
      diagnosedDate: "2023-03-18",
      isActive: true,
      notes:
        "Estimated GFR 45 mL/min/1.73m². Secondary to long-standing hypertension. Proteinuria 450 mg/24h. Blood pressure well-controlled on ACE inhibitors. Advised renal protective diet: low sodium, moderate protein. Avoid NSAIDs and nephrotoxic agents. Regular monitoring of renal function every 3 months.",
    },
    {
      id: "#DC003",
      medicalConditionName: "Generalized Anxiety Disorder",
      severity: "Moderate",
      diagnosisName: "GAD with Panic Attacks",
      diagnosedDate: "2021-11-05",
      isActive: true,
      notes:
        "Patient reports persistent worry, restlessness, muscle tension, and sleep disturbance. Experiencing panic attacks 2-3 times monthly. Started on SSRI and referred for cognitive behavioral therapy. Good response to treatment with reduced anxiety symptoms. Continuing medication and therapy sessions.",
    },
    {
      id: "#DC004",
      medicalConditionName: "Osteoporosis",
      severity: "Mild",
      diagnosisName: "Postmenopausal Osteoporosis",
      diagnosedDate: "2020-09-22",
      isActive: true,
      notes:
        "T-score -2.5 at lumbar spine. No previous fractures. Patient educated about fall prevention and importance of weight-bearing exercises. Started on calcium and vitamin D supplementation. Bisphosphonates initiated. Bone density scan scheduled in 2 years. Good adherence to treatment plan.",
    },
    {
      id: "#DC005",
      medicalConditionName: "Psoriasis",
      severity: "Moderate",
      diagnosisName: "Plaque Psoriasis",
      diagnosedDate: "2019-12-10",
      isActive: false,
      notes:
        "Extensive plaques covering approximately 15% of body surface area, primarily on elbows, knees, and scalp. Previously treated with topical corticosteroids and phototherapy. Condition resolved with biologic therapy. Patient currently in remission with clear skin. Monitoring for potential recurrence.",
    },
    {
      id: "#DC006",
      medicalConditionName: "Hypothyroidism",
      severity: "Mild",
      diagnosisName: "Primary Hypothyroidism",
      diagnosedDate: "2018-06-30",
      isActive: true,
      notes:
        "TSH elevated at 8.5 mIU/L, free T4 low normal. Positive anti-TPO antibodies. Started on Levothyroxine 50 mcg daily. Symptoms of fatigue and weight gain improved with treatment. TSH now stable at 2.1 mIU/L on current dose. Requires lifelong thyroid replacement therapy with annual TSH monitoring.",
    },
    {
      id: "#DC007",
      medicalConditionName: "Coronary Artery Disease",
      severity: "Severe",
      diagnosisName: "Multi-vessel CAD",
      diagnosedDate: "2023-01-15",
      isActive: true,
      notes:
        "Significant stenosis in LAD, RCA, and LCx arteries. Status post CABG x3. EF 45%. On optimal medical therapy including beta-blocker, statin, aspirin, and ACE inhibitor. No current angina symptoms. Strict lipid control with LDL target <70 mg/dL. Cardiac rehab completed.",
    },
    {
      id: "#DC008",
      medicalConditionName: "Chronic Obstructive Pulmonary Disease",
      severity: "Moderate",
      diagnosisName: "COPD GOLD Stage 2",
      diagnosedDate: "2022-04-08",
      isActive: true,
      notes:
        "FEV1/FVC 60%, FEV1 65% predicted. Former smoker, quit 5 years ago. Symptoms include dyspnea on exertion and chronic cough. On LAMA/LABA inhaler therapy. Pulmonary rehab referral provided. Annual influenza vaccination and pneumococcal vaccine up to date. No recent exacerbations.",
    },
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
        return condition[searchBy]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    })
    .filter((condition) => {
      if (filterType && condition.medicalConditionName !== filterType)
        return false;
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
  const currentData = filteredConditions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "#4BAE78"; // Green
      case "moderate":
        return "#FFA500"; // Orange
      case "severe":
        return "#D66A6A"; // Red
      default:
        return "#6C757D"; // Gray
    }
  };

  // Get status color and text
  const getStatusInfo = (isActive) => {
    return {
      color: isActive ? "#3fabf3" : "#7A8B97",
      text: t(`Common.status_options.${isActive ? "active" : "inactive"}`),
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosedConditionsTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
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
                  <th>{t("DiagnosedConditionsTable.medical_condition_name")}</th>
                  <th>{t("DiagnosedConditionsTable.severity")}</th>
                  <th>{t("DiagnosedConditionsTable.diagnosis_name")}</th>
                  <th>{t("DiagnosedConditionsTable.diagnosed_date")}</th>
                  <th>{t("DiagnosedConditionsTable.status")}</th>
                  <th>{t("DiagnosedConditionsTable.notes")}</th>
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
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {t(`OtherMedicalConditionsMobileView.severity_options.${condition.severity.toLowerCase()}`)}
                          </span>
                        </td>
                        <td title={condition.diagnosisName}>
                          {condition.diagnosisName}
                        </td>
                        <td>{formatDate(condition.diagnosedDate)}</td>
                        <td>
                          <span
                            style={{
                              color: statusInfo.color,
                              fontWeight: "600",
                              fontSize: "14px",
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
                        <tr
                          className="table-active-content"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <td
                            colSpan="6"
                            className="border-0 background-in-hover-none"
                          >
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("DiagnosedConditionsTable.notes")}
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

          <Pagination
            currentPage={currentPage}
            totalItems={filteredConditions.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagnosedConditionsTable;