import React, { useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "../../Patient-management.css";
import CustomAccordion from "../../../shareds/CustomAccordion";

const AppointmentsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  const rowsPerPage = 5; 

  const appointmentsData = [
    {
      id: "#AP001",
      date: "15 Sep 2025",
      time: "10:30 AM",
      sessionType: "Clinic Visit",
      status: "Confirmed",
      procedures: [
        { type: "Check-up", date: "2025-09-10", content: "General check done." },
        { type: "Blood Test", date: "2025-09-11", content: "Blood sample collected." },
      ],
      notes: [
        { type: "Medical", date: "2025-09-12", content: "Patient responded well." },
        { type: "Follow-up", date: "2025-09-13", content: "Needs follow-up in 1 week." },
      ],
      treatmentPlan: [
        { type: "Plan A", date: "2025-09-15", content: "Medication 2x daily." },
        { type: "Plan B", date: "2025-09-20", content: "Physical therapy scheduled." },
      ],
    },
    {
      id: "#AP002",
      date: "16 Sep 2025",
      time: "01:00 PM",
      sessionType: "Video Call",
      status: "Confirmed",
      procedures: [
        { type: "Consultation", date: "2025-09-14", content: "General examination." },
      ],
      notes: [{ type: "Medical", date: "2025-09-14", content: "Needs blood tests." }],
      treatmentPlan: [{ type: "Plan A", date: "2025-09-16", content: "Follow-up after results." }],
    },
    {
      id: "#AP003",
      date: "18 Sep 2025",
      time: "11:15 AM",
      sessionType: "Routine Checkup",
      status: "Cancelled",
      procedures: [],
      notes: [
        { type: "Administrative", date: "2025-09-17", content: "Patient cancelled the appointment." },
      ],
      treatmentPlan: [{ type: "Plan C", date: "2025-09-19", content: "Reschedule when available." }],
    },
    {
      id: "#AP004",
      date: "20 Sep 2025",
      time: "09:00 AM",
      sessionType: "Clinic Visit",
      status: "Postponed",
      procedures: [
        { type: "Consultation", date: "2025-09-18", content: "Doctor requested to delay." },
      ],
      notes: [
        { type: "Communication", date: "2025-09-18", content: "Called patient to inform about delay." },
      ],
      treatmentPlan: [
        { type: "Plan D", date: "2025-09-21", content: "Reschedule after doctor availability." },
      ],
    },
    {
      id: "#AP005",
      date: "21 Sep 2025",
      time: "10:00 AM",
      sessionType: "Clinic Visit",
      status: "Confirmed",
      procedures: [],
      notes: [],
      treatmentPlan: [],
    },
    {
      id: "#AP006",
      date: "22 Sep 2025",
      time: "02:00 PM",
      sessionType: "Video Call",
      status: "Confirmed",
      procedures: [],
      notes: [],
      treatmentPlan: [],
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

  //  SearchBy
  const filteredAppointments = appointmentsData.filter((appt) => {
    if (!searchTerm) return true;

    if (searchBy === "all") {
      return Object.values(appt)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return appt[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  //  Pagination
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredAppointments.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
        <h3 className="table-title">List Appointments</h3>
        <h6 className="table-subtitle">Ahmed Mohamed Ali </h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Search */}
          <InputGroup className="mb-3">
            <Form.Control
              className="search-input"
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              className="search-select"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">All</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="sessionType">Session Type</option>
              <option value="status">Status</option>
            </Form.Select>
          </InputGroup>

          {/* Table */}
          <Table className="data-table align-middle mb-0 table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Session Type</th>
                <th>Status</th>
                <th>Procedures</th>
                <th>Notes</th>
                <th>Treatment Plan</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((appt) => (
                <React.Fragment key={appt.id}>
                  <tr>
                    <td>{appt.date}</td>
                    <td>{appt.time}</td>
                    <td>{appt.sessionType}</td>
                    <td>{appt.status}</td>

                    <td>
                      <Button
                        className="view-btn"
                        size="sm"
                        variant={
                          expandedRow === appt.id &&
                          expandedField === "procedures"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleViewClick(appt.id, "procedures")}
                        disabled={appt.procedures.length === 0}
                      >
                        Manage
                        {appt.procedures.length > 0 && (
                          <span
                            className="num-item"
                            style={{
                              backgroundColor:
                                expandedRow === appt.id &&
                                expandedField === "procedures"
                                  ? "#f8f9fa"
                                  : "transparent",
                            }}
                          >
                            {" "}
                            {appt.procedures.length}
                          </span>
                        )}
                      </Button>
                    </td>

                    <td>
                      <Button
                        className="view-btn"
                        size="sm"
                        variant={
                          expandedRow === appt.id && expandedField === "notes"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleViewClick(appt.id, "notes")}
                        disabled={appt.notes.length === 0}
                      >
                        Manage
                        {appt.notes.length > 0 && (
                          <span
                            className="num-item"
                            style={{
                              backgroundColor:
                                expandedRow === appt.id &&
                                expandedField === "notes"
                                  ? "#f8f9fa"
                                  : "transparent",
                            }}
                          >
                            {" "}
                            {appt.notes.length}
                          </span>
                        )}
                      </Button>
                    </td>

                    <td>
                      <Button
                        className="view-btn"
                        size="sm"
                        variant={
                          expandedRow === appt.id &&
                          expandedField === "treatmentPlan"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() =>
                          handleViewClick(appt.id, "treatmentPlan")
                        }
                        disabled={appt.treatmentPlan.length === 0}
                      >
                        Manage
                        {appt.treatmentPlan.length > 0 && (
                          <span className="num-item"   style=
                            {{
                              backgroundColor:
                                expandedRow === appt.id &&
                                expandedField === "treatmentPlan"
                                  ? "#f8f9fa"
                                  : "transparent",
                            }}>
                            {" "}
                            {appt.treatmentPlan.length}
                          
                          </span>
                        )}
                      </Button>
                    </td>
                  </tr>

                  {expandedRow === appt.id && (
                    <tr>
                      <td
                        colSpan="7"
                        className="border-0 background-in-hover-none"
                      >
                        <div className="p-3">
                          <CustomAccordion
                            backgroundColor="var(--scbccolor)"
                            data={appt[expandedField]}
                            formFields={[
                              {
                                name: "type",
                                type: "select",
                                options: [
                                  "Medical",
                                  "Follow-up",
                                  "Behavioral",
                                  "Communication",
                                  "Administrative",
                                  "Urgent",
                                ],
                                placeholder: "Select Type",
                                half: true,
                              },
                              {
                                name: "date",
                                type: "date",
                                placeholder: "Date",
                                half: true,
                              },
                              {
                                name: "content",
                                type: "textarea",
                                placeholder: "Content",
                              },
                            ]}
                            onAdd={() => alert(`Add ${expandedField}`)}
                            onDelete={(index) =>
                              alert(`Delete ${expandedField} ${index}`)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>

          {/*  Pagination & Info Section */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            {/*  Info Bar */}
            <div
              className="dt-layout-cell dt-layout-start"
              style={{ fontSize: "14px", color: "#555" }}
            >
              <div
                className="dt-info"
                aria-live="polite"
                id="DataTables_Table_0_info"
                role="status"
              >
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + rowsPerPage,
                  filteredAppointments.length
                )}{" "}
                of {filteredAppointments.length} entries
              </div>
            </div>

            {/*  Pagination */}
            <div className="dt-layout-cell dt-layout-end  ">
              <div className="dt-paging">
                <nav aria-label="pagination" className="d-flex">
                  <button
                    className="dt-paging-button first"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    «
                  </button>
                  <button
                    className="dt-paging-button previous"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`dt-paging-button none ${
                        currentPage === index + 1 ? "current" : ""
                      }`}
                      type="button"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="dt-paging-button next"
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
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

export default AppointmentsTable;
