import React, { useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "../../Patient-management.css";
import CustomAccordion from "../../../shared/CustomAccordion";

const AppointmentsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // كلمة البحث
  const [searchBy, setSearchBy] = useState("all"); // البحث بأي خانة

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

  // ✅ فلترة حسب SearchBy
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

  return (
    <div className="shadow-sm mt-4" style={{ border: "none", borderRadius: "12px" }}>
      <div>
        <h3 color="#333333">List Appointments</h3>
      </div>

      <div className="p-3">
        <div
          style={{
            padding: "30px",
            border: "1px solid #f0f0f0",
            marginTop: "40px",
            backgroundColor: "#fff",
            boxShadow: "0px 0px 8px 3px #dddddd26",
            borderRadius: "6px",
          }}
        >
          {/* ✅ Search with select */}
          <InputGroup className="mb-3">
            <Form.Control
              style={{ borderRadius: "6px" }}
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              style={{ maxWidth: "300px", borderRadius: "6px" }}
            >
              <option value="all">All</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="sessionType">Session Type</option>
              <option value="status">Status</option>
            </Form.Select>
          </InputGroup>

          <Table className="align-middle mb-0 table-hover" style={{ whiteSpace: "nowrap" }}>
            <thead className="table-light">
              <tr>
                <th className="border-0">Date</th>
                <th className="border-0">Time</th>
                <th className="border-0">Session Type</th>
                <th className="border-0">Status</th>
                <th className="border-0">Procedures</th>
                <th className="border-0">Notes</th>
                <th className="border-0">Treatment Plan</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <React.Fragment key={appt.id}>
                  <tr>
                    <td className="border-0">{appt.date}</td>
                    <td className="border-0">{appt.time}</td>
                    <td className="border-0">{appt.sessionType}</td>
                    <td className="border-0">{appt.status}</td>

                    {/* Procedures */}
                    <td className="border-0">
                      <Button
                        style={{ backgroundColor: "none", border: "none", boxShadow: "none" }}
                        size="sm"
                        variant={
                          expandedRow === appt.id && expandedField === "procedures"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleViewClick(appt.id, "procedures")}
                      >
                        View
                      </Button>
                    </td>

                    {/* Notes */}
                    <td className="border-0">
                      <Button
                        style={{ backgroundColor: "none", border: "none", boxShadow: "none" }}
                        size="sm"
                        variant={
                          expandedRow === appt.id && expandedField === "notes"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleViewClick(appt.id, "notes")}
                      >
                        View
                      </Button>
                    </td>

                    {/* Treatment Plan */}
                    <td className="border-0">
                      <Button
                        style={{ backgroundColor: "none", border: "none", boxShadow: "none" }}
                        size="sm"
                        variant={
                          expandedRow === appt.id && expandedField === "treatmentPlan"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleViewClick(appt.id, "treatmentPlan")}
                      >
                        View
                      </Button>
                    </td>
                  </tr>

                  {/* الصف اللي فيه CustomAccordion */}
                  {expandedRow === appt.id && (
                    <tr>
                      <td colSpan="7" className="border-0 bg-light">
                        <div className="p-3">
                          <CustomAccordion
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
                              { name: "date", type: "date", placeholder: "Date", half: true },
                              { name: "content", type: "textarea", placeholder: "Content" },
                            ]}
                            onAdd={() => alert(`Add ${expandedField}`)}
                            onDelete={(index) => alert(`Delete ${expandedField} ${index}`)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>

          {/* ✅ Pagination Section */}
          <div className="dt-layout-cell dt-layout-end mt-3">
            <div className="dt-paging">
              <nav aria-label="pagination">
                <button
                  className="dt-paging-button disabled first"
                  type="button"
                  aria-label="First"
                  aria-disabled="true"
                  tabIndex="-1"
                >
                  «
                </button>
                <button
                  className="dt-paging-button disabled previous"
                  type="button"
                  aria-label="Previous"
                  aria-disabled="true"
                  tabIndex="-1"
                >
                  Previous
                </button>
                <button
                  className="dt-paging-button current"
                  type="button"
                  aria-current="page"
                >
                  1
                </button>
                <button className="dt-paging-button next" type="button" aria-label="Next">
                  Next
                </button>
                <button className="dt-paging-button last" type="button" aria-label="Last">
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTable;
