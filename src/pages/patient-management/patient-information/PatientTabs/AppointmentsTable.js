import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../Patient-management.css";

const AppointmentsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedField, setExpandedField] = useState(null);

  const appointmentsData = [
    {
      id: "#AP001",
      date: "15 Sep 2025",
      time: "10:30 AM",
      sessionType: "Clinic Visit",
      status: "Confirmed",
      procedures: "Basic procedures",
      notes: [
        { date: "15 Sep 2025", type: "Observation", text: "Patient responded well" },
        { date: "15 Sep 2025", type: "Follow-up", text: "Check vitals again" }
      ],
      treatmentPlan: [
        { step: 1, description: "Follow-up session after one week" },
        { step: 2, description: "Take prescribed medications" }
      ],
    },
    {
      id: "#AP002",
      date: "16 Sep 2025",
      time: "01:00 PM",
      sessionType: "Video Call",
      status: "Confirmed",
      procedures: "General examination",
      notes: [
        { date: "16 Sep 2025", type: "Observation", text: "Needs blood tests" }
      ],
      treatmentPlan: [
        { step: 1, description: "Follow-up after results" }
      ],
    },
    {
      id: "#AP003",
      date: "18 Sep 2025",
      time: "11:15 AM",
      sessionType: "Routine Checkup",
      status: "Cancelled",
      procedures: "Not performed",
      notes: [
        { date: "18 Sep 2025", type: "Cancellation", text: "Patient cancelled the appointment" }
      ],
      treatmentPlan: [
        { step: 1, description: "Reschedule" }
      ],
    },
    {
      id: "#AP004",
      date: "20 Sep 2025",
      time: "09:00 AM",
      sessionType: "Clinic Visit",
      status: "Postponed",
      procedures: "Initial consultation",
      notes: [
        { date: "20 Sep 2025", type: "Delay", text: "Doctor requested to delay" }
      ],
      treatmentPlan: [
        { step: 1, description: "Reschedule after doctor availability" }
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

  return (
    <div className="shadow-sm mt-4" style={{ border: "none", borderRadius: "12px" }}>
      {/* Header */}
      <div className="dc-tabscontenttitle dc-addnew">
        <h3>Appointments</h3>
        <a href="#">Add Appointment</a>
      </div>

      <div className="p-3">
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
            {appointmentsData.map((appt) => (
              <React.Fragment key={appt.id}>
                <tr>
                  <td className="border-0">{appt.date}</td>
                  <td className="border-0">{appt.time}</td>
                  <td className="border-0">{appt.sessionType}</td>
                  <td className="border-0">{appt.status}</td>

                  {/* Buttons */}
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={expandedRow === appt.id && expandedField === "procedures" ? "primary" : "outline-primary"}
                      onClick={() => handleViewClick(appt.id, "procedures")}
                      style={{ border: "none", width: "70px", height: "30px", boxShadow: "none" }}
                    >
                      View
                    </Button>
                  </td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={expandedRow === appt.id && expandedField === "notes" ? "primary" : "outline-primary"}
                      onClick={() => handleViewClick(appt.id, "notes")}
                      style={{ border: "none", width: "70px", height: "30px", boxShadow: "none", fontWeight:"normal" }}
                    >
                      View
                    </Button>
                  </td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={expandedRow === appt.id && expandedField === "treatmentPlan" ? "primary" : "outline-primary"}
                      onClick={() => handleViewClick(appt.id, "treatmentPlan")}
                      style={{ border: "none", width: "70px", height: "30px", boxShadow: "none" }}
                    >
                      View
                    </Button>
                  </td>
                </tr>

                {/* Expanded row */}
                {expandedRow === appt.id && (
                  <tr>
                    <td colSpan="7" className="border-0 bg-light">
                      <div className="p-3">
                        {expandedField === "notes" && (
                          <div>
                             <div className="dc-tabscontenttitle dc-addnew"
                             style={{backgroundColor:"white"}}
                             >
                                <h3>nots</h3>
                               <a href="#">Visit all nots</a>
                              </div>
                            {/* <strong>Notes:</strong> */}
                            <table className="table table-sm table-bordered mt-2">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Type</th>
                                  <th>Text</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appt.notes.map((note, index) => (
                                  <tr key={index}>
                                    <td>{note.date}</td>
                                    <td>{note.type}</td>
                                    <td>{note.text}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {expandedField === "treatmentPlan" && (
                          <div>
                            <strong>Treatment Plan:</strong>
                            <ul className="mt-2">
                              {appt.treatmentPlan.map((step) => (
                                <li key={step.step}>
                                  <strong>Step {step.step}:</strong> {step.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {expandedField === "procedures" && (
                          <div>
                            <strong>Procedures:</strong> {appt.procedures}
                          </div>
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
    </div>
  );
};

export default AppointmentsTable;
