import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { PiEyeThin, PiUsersThreeLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import PatientsFilters from "./PatientsFilters";
import { MdOutlineArrowForward } from "react-icons/md";
import MainSearch from "../../../shared/MainSearch";
import DateRangePicker from "../../patient-information/PatientTabs/component/DateRangePicker";
import FilterDropdown from "../../patient-information/PatientTabs/component/FilterDropdown";
import { CiSearch } from "react-icons/ci";

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
      avatar: "/images/avt/patient-avt.png",
    },
    {
      patientId: "#PT002",
      name: "Travis Trimble",
      age: 23,
      address: "4026 Fantages Way, Brunswick, Maine",
      phone: "2077299974",
      lastVisit: "22 Oct 2023",
      paid: 200,
      avatar: "/images/avt/patient-avt.png",
    },
    {
      patientId: "#PT003",
      name: "Carl Kelly",
      age: 29,
      address: "2037 Pearcy Avenue, Decatur, Indiana",
      phone: "2607247769",
      lastVisit: "21 Oct 2023",
      paid: 250,
      avatar: "/images/avt/patient-avt.png",
    },
    {
      patientId: "#PT004",
      name: "Michelle Fairfax",
      age: 25,
      address: "2037 Pearcy Avenue, Decatur, Indiana",
      phone: "5043686874",
      lastVisit: "21 Sep 2023",
      paid: 150,
      avatar: "/images/avt/patient-avt.png",
      
 },
    {
      patientId: "#PT005",
      name: "John Doe",
      age: 35,
      address: "123 Main Street, New York, NY",
      phone: "5551234567",
      lastVisit: "15 Oct 2023",
      paid: 300,
      avatar: "/images/avt/patient-avt.png",
    },
    {
      patientId: "#PT006",
      name: "Jane Smith",
      age: 28,
      address: "456 Oak Avenue, Los Angeles, CA",
      phone: "5557654321",
      lastVisit: "18 Oct 2023",
      paid: 180,
      avatar: "/images/avt/patient-avt.png",
    },
  ];

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const patientsPerPage = 5;

  // Filter
  const filteredPatients = patientsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
    setCurrentPage(1); 
  };

  return (
    <div>
         
      <div
      className=""
      style={{ border: "none", borderRadius: "12px" }}
    >
      
     
      <div className="table-card">
        <div className="d-flex justify-content-between ">
          <h3 className="table-title"  >
            <PiUsersThreeLight /> {t("patientsList")}
          </h3>
        </div>
        
         <div 
         className="filters-container-search" 
         >
         {/* <MainSearch /> */}
         <div style={{ position: "relative" }}>
            <input
              className="form-control small-search normal-search"
              type="text"
              placeholder={t("search for patient")}
              style={{height:"100px"}}
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") handleSearch();
              // }}
            />
            <CiSearch
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000",
                fontSize: "23px",
              }}
            />
          </div>
             <div className=" review-filters ">
             
             <FilterDropdown small/>
             <DateRangePicker className={"right"}/>
          </div>
       </div>

        {/* Scrollable Table Wrapper */}
        <div style={{ overflowX: "auto" }}>
          <Table
            className="align-middle mb-0 table-hover"
            style={{ whiteSpace: "nowrap" }}
          >
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
                      variant="outline-primary"
                      size="sm"
                      className="d-flex align-items-center view-btn ms-2"
                    >
                   {  t("View profile") }<MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
          <div
            className="dt-layout-cell dt-layout-start"
            style={{ fontSize: "14px", color: "#555" }}
          >
            <div className="dt-info">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredPatients.length)} of{" "}
              {filteredPatients.length} entries
            </div>
          </div>

          <div className="dt-layout-cell dt-layout-end">
            <div className="dt-paging">
              <nav aria-label="pagination" className="d-flex">
                {/* Go to first page */}
                <button
                  className="dt-paging-button first"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  «
                </button>

                {/* Go to previous page */}
                <button
                  className="dt-paging-button previous"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </button>

                {/* Page number buttons */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`dt-paging-button none ${
                      currentPage === index + 1 ? "current" : ""
                    }`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Go to next page */}
                <button
                  className="dt-paging-button next"
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </button>

                {/* Go to last page */}
                <button
                  className="dt-paging-button last"
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default PatientsTable;