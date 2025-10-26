// PrescriptionsTable.jsx
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import CustomAccordion from "../../../../shared/CustomAccordion";
import { MdExpandMore } from "react-icons/md";
import ConditionsFilters from "../component/ConditionsFilters";
import TextAreaField from "../../../../ui/form-fields/TextAreaField";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import "../../../Patient-management.css";

const PrescriptionsTable = () => {
  const { t } = useTranslation();

  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

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
      ],
    },
    {
      id: "#RX0010",
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
      ],
    },
    {
      id: "#RX0012",
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
      ],
    },
    {
      id: "#RX0013",
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
      ],
    },
    {
      id: "#RX0014",
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
      ],
    },
    {
      id: "#RX0015",
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
      ],
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
      ],
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
      ],
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
      ],
    },
  ];

  const handleViewClick = (id, field) => {
    if (expandedRow === id && expandedField === field) {
      setExpandedRow(null);
      setExpandedField(null);
    } else {
      setExpandedRow(id);
      setExpandedField(field);
    }
  };

  const filteredPrescriptions = prescriptionsData
    .filter((prescription) => {
      if (!searchTerm) return true;
      if (searchBy === "all") {
        return Object.values(prescription)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return (
          prescription[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    })
    .filter((prescription) => {
      if (filterType && prescription.title !== filterType) return false;
      if (filterDateFrom || filterDateTo) {
        const hasMatchingDate = prescription.prescribedMedication.some((med) => {
          const startDate = new Date(med.startDate);
          const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
          const toDate = filterDateTo ? new Date(filterDateTo) : null;
          if (fromDate && toDate)
            return startDate >= fromDate && startDate <= toDate;
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

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("PrescriptionsTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("PrescriptionsTable.table_subtitle")}</h6>
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
                  <th>{t("PrescriptionsTable.prescription_title")}</th>
                  <th>{t("PrescriptionsTable.note")}</th>
                  <th>{t("PrescriptionsTable.status")}</th>
                  <th>{t("PrescriptionsTable.diagnosis_name")}</th>
                  <th>{t("PrescriptionsTable.medication")}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((prescription) => (
                  <React.Fragment key={prescription.id}>
                    <tr>
                      <td title={prescription.title}>{prescription.title}</td>

                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                            title={prescription.note}
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

                      <td>
                        <span
                          style={{
                            color: getStatusColor(prescription.status),
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {t(`PrescriptionsTable.status_options.${prescription.status}`)}
                        </span>
                      </td>

                      <td title={prescription.diagnosisName}>
                        {prescription.diagnosisName}
                      </td>

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
                          {t("PrescriptionsTable.view")}
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

                    {expandedRow === prescription.id && (
                      <tr
                        className="table-active-content"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <td
                          colSpan="5"
                          className="border-0 background-in-hover-none"
                        >
                          <div>
                            {expandedField === "note" && (
                              <div className="description-expanded-section">
                                <TextAreaField
                                  label={t("PrescriptionsTable.prescription_note")}
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
                                  {
                                    name: "medicationName",
                                    placeholder: t("PrescriptionsTable.medication_name"),
                                    label: t("PrescriptionsTable.medication"),
                                  },
                                  {
                                    name: "dosage",
                                    placeholder: t("PrescriptionsTable.dosage"),
                                    half: true,
                                    label: t("PrescriptionsTable.dosage"),
                                  },
                                  {
                                    name: "duration",
                                    placeholder: t("PrescriptionsTable.duration"),
                                    half: true,
                                    label: t("PrescriptionsTable.duration"),
                                  },
                                  {
                                    name: "instructions",
                                    type: "textarea",
                                    placeholder: t("PrescriptionsTable.instructions"),
                                    label: t("PrescriptionsTable.instructions"),
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
            totalItems={filteredPrescriptions.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsTable;