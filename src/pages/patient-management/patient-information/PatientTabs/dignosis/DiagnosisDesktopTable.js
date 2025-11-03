// DiagnosisTable.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import CustomAccordion from "../../../../shareds/CustomAccordion";
import TwoLevelAccordion from "../../../../shareds/TwoLevelAccordion";
import { MdExpandMore } from "react-icons/md";
import Field from "../../../../ui/form-fields/Field";
import ConditionsFilters from "../component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shareds/Pagination";
import "../../../Patient-management.css";

const DiagnosisTable = () => {
  const { t } = useTranslation();

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
        { content: "Patient started on Metformin 500mg twice daily" },
        { content: "Blood sugar levels improving with medication" },
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
  const truncateText = (text, maxLength = 70) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t('DiagnosisTable.table_title')}</h3>
          <h6 className="table-subtitle">{t('DiagnosisTable.table_subtitle')}</h6>
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
                  <th>{t('DiagnosisTable.diagnosis_name')}</th>
                  <th>{t('DiagnosisTable.symptoms_description')}</th>
                  <th>{t('DiagnosisTable.diagnosis_description')}</th>
                  <th>{t('DiagnosisTable.conditions')}</th>
                  <th>{t('DiagnosisTable.notes')}</th>
                  <th>{t('DiagnosisTable.prescription')}</th>
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
                              handleViewClick(
                                disease.id,
                                "symptomsDescription"
                              )
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
                          {t('DiagnosisTable.view')}
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
                          {t('DiagnosisTable.view')}
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
                          {t('DiagnosisTable.view')}
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
                      <tr
                        className="table-active-content"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <td
                          colSpan="6"
                          className="border-0 background-in-hover-none"
                        >
                          <div className="accordion-in-table">
                            {expandedField === "symptomsDescription" && (
                              <div className="description-expanded-section">
                                <Field
                                  label={t('DiagnosisTable.symptoms_description')}
                                  value={disease.symptomsDescription}
                                  disabled
                                />
                              </div>
                            )}

                            {expandedField === "diagnosisDescription" && (
                              <div className="description-expanded-section">
                                <Field
                                  label={t('DiagnosisTable.diagnosis_description')}
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
                                  {
                                    name: "MedicalCondition",
                                    placeholder: t('DiagnosisTable.condition_type'),
                                    half: true,
                                    label: t('DiagnosisTable.medical_condition'),
                                  },
                                  {
                                    name: "Severity",
                                    placeholder: t('DiagnosisTable.severity'),
                                    half: true,
                                    label: t('DiagnosisTable.severity'),
                                  },
                                  {
                                    name: "note",
                                    type: "textarea",
                                    placeholder: t('DiagnosisTable.note_content'),
                                    label: t('DiagnosisTable.note'),
                                  },
                                ]}
                              />
                            )}

                            {expandedField === "notes" && (
                              <CustomAccordion
                                readOnly={true}
                                backgroundColor="var(--scbccolor)"
                                data={disease.notes}
                                formFields={[
                                  {
                                    name: "content",
                                    type: "textarea",
                                    placeholder: t('DiagnosisTable.note_content'),
                                    label: t('DiagnosisTable.note_content'),
                                  },
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
                                  {
                                    name: "title",
                                    type: "text",
                                    placeholder: t('DiagnosisTable.prescription_title'),
                                    half: true,
                                    label: t('DiagnosisTable.prescription_title'),
                                  },
                                  {
                                    name: "status",
                                    placeholder: t('DiagnosisTable.status'),
                                    half: true,
                                    label: t('DiagnosisTable.status'),
                                  },
                                  {
                                    name: "note",
                                    type: "textarea",
                                    placeholder: t('DiagnosisTable.prescription_note'),
                                    label: t('DiagnosisTable.note'),
                                  },
                                ]}
                                formFieldsRecipe={[
                                  {
                                    name: "medication",
                                    placeholder: t('DiagnosisTable.medication'),
                                    label: t('DiagnosisTable.medication'),
                                  },
                                  {
                                    name: "dosage",
                                    placeholder: t('DiagnosisTable.dosage'),
                                    half: true,
                                    label: t('DiagnosisTable.dosage'),
                                  },
                                  {
                                    name: "durationInDays",
                                    type: "number",
                                    placeholder: t('DiagnosisTable.duration_days'),
                                    half: true,
                                    label: t('DiagnosisTable.duration_days'),
                                  },
                                  {
                                    name: "instructions",
                                    placeholder: t('DiagnosisTable.instructions'),
                                    type: "textarea",
                                    label: t('DiagnosisTable.instructions'),
                                  },
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

          <Pagination
            currentPage={currentPage}
            totalItems={filteredDiseases.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTable;