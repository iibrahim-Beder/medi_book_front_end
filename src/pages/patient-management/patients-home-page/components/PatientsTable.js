import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { PiEyeThin, PiUsersThreeLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import PatientsFilters from "./PatientsFilters";

const PatientsTable = () => {
  const { t } = useTranslation();

  const patientsData = [
    {
      patientId: "#PT001",
      name: "Charlene Reed",
      age: 29,
      address: "4417 Goosetown Drive, Taylorsville, NC",
      phone: "8286329170",
      lastVisit: "20 Oct 2023",
      paid: 100,
      avatar: "/images/user-login.jpg",
    },
    {
      patientId: "#PT002",
      name: "Travis Trimble",
      age: 23,
      address: "4026 Fantages Way, Brunswick, Maine",
      phone: "2077299974",
      lastVisit: "22 Oct 2023",
      paid: 200,
      avatar: "/images/user-login.jpg",
    },
    {
      patientId: "#PT003",
      name: "Carl Kelly",
      age: 29,
      address: "2037 Pearcy Avenue, Decatur, Indiana",
      phone: "2607247769",
      lastVisit: "21 Oct 2023",
      paid: 250,
      avatar: "/images/user-login.jpg",
    },
    {
      patientId: "#PT004",
      name: "Michelle Fairfax",
      age: 25,
      address: "2037 Pearcy Avenue, Decatur, Indiana",
      phone: "5043686874",
      lastVisit: "21 Sep 2023",
      paid: 150,
      avatar: "/images/user-login.jpg",
    },
  ];

  const [search, setSearch] = useState("");
  const [currentPage] = useState(1);
  const patientsPerPage = 5;

  // Filter
  const filteredPatients = patientsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  // Search filters
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");

  const handleExportCsv = () => {
    console.log("Export CSV clicked ✅");
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setGender("");
  };

  return (
    <div className="shadow-sm mt-4 " style={{ border: "none", borderRadius: "12px" }}>
      <PatientsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        gender={gender}
        setGender={setGender}
        onExportCsv={handleExportCsv}
        onReset={handleReset}
      />
      <div className="p-3 PatientsTable">
        <div className="d-flex justify-content-between mb-3">
          <h3>
            <PiUsersThreeLight /> {t("patientsList")}
          </h3>
        </div>

        {/* Scrollable Table Wrapper */}
        <div style={{ overflowX: "auto" }}>
          <Table className="align-middle mb-0 table-hover" style={{ whiteSpace: "nowrap" }}>
            <thead className="table-light">
              <tr>
                <th className="border-0">{t("patientId")}</th>
                <th className="border-0">{t("name")}</th>
                <th className="border-0">{t("age")}</th>
                <th className="border-0">{t("address")}</th>
                <th className="border-0">{t("phone")}</th>
                <th className="border-0">{t("lastVisit")}</th>
                <th className="border-0">{t("paid")}</th>
                <th className="border-0">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.patientId}>
                  <td className="border-0">{patient.patientId}</td>
                  <td className="border-0">
                    <div className="d-flex align-items-center justify-content-start cont-img-name">
                      <img
                        src={patient.avatar}
                        alt="avatar"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span>{patient.name}</span>
                    </div>
                  </td>
                  <td className="border-0">{patient.age}</td>
                  <td className="border-0">{patient.address}</td>
                  <td className="border-0">{patient.phone}</td>
                  <td className="border-0">{patient.lastVisit}</td>
                  <td className="border-0 fw-bold text-success">
                    ${patient.paid}
                  </td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        width: "35px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      <PiEyeThin style={{ fontSize: "20px" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between mt-3">
          <span>
            {t("showing")} {indexOfFirst + 1} - {Math.min(indexOfLast, filteredPatients.length)}{" "}
            {t("of")} {filteredPatients.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;
