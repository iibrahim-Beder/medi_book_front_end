// Othermedications.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import ConditionsFilters from "./component/ConditionsFilters";
import { MdExpandMore } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import Pagination from "../../../shared/Pagination";
import "../../Patient-management.css";

const Othermedications = () => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters states
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing prescriptions
  const prescriptionsData = [
    {
      id: "#RX001",
      medication: "Metformin",
      dosage: "500mg twice daily",
      duration: "30 days",
      instructions:
        "Take one tablet with breakfast and one with dinner. Always take with food to minimize gastrointestinal side effects. If you experience significant stomach upset, consult your doctor. Monitor your blood sugar levels regularly and report any unusual readings.",
      status: "active",
    },
    {
      id: "#RX002",
      medication: "Glucose Test Strips",
      dosage: "As needed",
      duration: "90 days",
      instructions:
        "Check blood sugar levels: 1) First thing in the morning (fasting), 2) Before each main meal, 3) Two hours after meals, and 4) At bedtime. Record all readings in your logbook. Bring the logbook to your next appointment. Contact your doctor if fasting readings are consistently above 130 mg/dL or post-meal readings above 180 mg/dL.",
      status: "active",
    },
    {
      id: "#RX003",
      medication: "Lisinopril",
      dosage: "10mg once daily",
      duration: "90 days",
      instructions:
        "Take one tablet every morning at the same time, with or without food. Do not skip doses. Monitor your blood pressure twice daily - morning and evening. Report any persistent dry cough, dizziness, or swelling. Avoid sudden position changes to prevent dizziness. Regular blood tests will be needed to monitor kidney function.",
      status: "completed",
    },
    {
      id: "#RX004",
      medication: "Sumatriptan",
      dosage: "50mg as needed",
      duration: "30 days",
      instructions:
        "Take at the first sign of migraine headache. Swallow tablet whole with water. Maximum dose is 2 tablets in 24 hours. Do not take if you have heart disease, uncontrolled hypertension, or history of stroke. Wait at least 2 hours between doses. Avoid driving or operating machinery until you know how this medication affects you.",
      status: "cancelled",
    },
    {
      id: "#RX005",
      medication: "Vitamin D3",
      dosage: "1000 IU once daily",
      duration: "60 days",
      instructions:
        "Take one capsule daily with your largest meal that contains healthy fats (such as avocado, nuts, or olive oil) for optimal absorption. Best taken in the morning. Do not exceed the recommended dose. Store in a cool, dry place away from direct sunlight. Follow up with blood test after 8 weeks to check vitamin D levels.",
      status: "expired",
    },
    {
      id: "#RX006",
      medication: "Salbutamol Inhaler",
      dosage: "2 puffs every 4-6 hours",
      duration: "180 days",
      instructions:
        "Shake well before each use. Breathe out fully, place mouthpiece between lips, and inhale deeply while pressing down on canister. Hold breath for 10 seconds if possible. Wait one minute between puffs. Rinse mouth after use to prevent oral thrush. Use as needed for shortness of breath, wheezing, or chest tightness. Do not exceed 8 puffs in 24 hours. Seek emergency care if no improvement after 4 puffs.",
      status: "active",
    },
  ];

  // Handle expand/collapse for instructions
  const handleInstructionsClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
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
        return prescription[searchBy]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    })
    .filter((prescription) => {
      if (filterType && prescription.medication !== filterType) return false;
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
  const currentData = filteredPrescriptions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Get status color
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

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("Othermedications.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
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
                  <th>{t("Othermedications.medication")}</th>
                  <th>{t("Othermedications.dosage")}</th>
                  <th>{t("Othermedications.duration")}</th>
                  <th>{t("Othermedications.instructions")}</th>
                  <th>{t("Othermedications.status")}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((prescription) => (
                  <React.Fragment key={prescription.id}>
                    <tr>
                      <td title={prescription.medication}>
                        {prescription.medication}
                      </td>
                      <td title={prescription.dosage}>{prescription.dosage}</td>
                      <td title={prescription.duration}>
                        {prescription.duration}
                      </td>

                      <td title={prescription.instructions}>
                        <div className="d-flex align-items-center">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "250px" }}
                          >
                            {truncateText(prescription.instructions, 80)}
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
                              handleInstructionsClick(prescription.id)
                            }
                          >
                            <MdExpandMore
                              style={{
                                transform:
                                  expandedRow === prescription.id
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </Button>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            color: getStatusColor(prescription.status),
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {t(`Common.status_options.${prescription.status}`)}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded row for Instructions */}
                    {expandedRow === prescription.id && (
                      <tr
                        className="table-active-content"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <td
                          colSpan="7"
                          className="border-0 background-in-hover-none"
                        >
                          <div className="description-expanded-section">
                            <TextAreaField
                              label={t("Othermedications.instructions")}
                              value={prescription.instructions}
                              disabled={true}
                            />
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
            totalItems={filteredPrescriptions.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Othermedications;