import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../Patient-management.css";
import CustomAccordion from "../../../shared/CustomAccordion";

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
      notes: [
        { type: "Medical", date: "2025-09-14", content: "Needs blood tests." },
      ],
      treatmentPlan: [
        { type: "Plan A", date: "2025-09-16", content: "Follow-up after results." },
      ],
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
      treatmentPlan: [
        { type: "Plan C", date: "2025-09-19", content: "Reschedule when available." },
      ],
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

  return (
    <div className="shadow-sm mt-4" style={{ border: "none", borderRadius: "12px" }}>
      {/* Header */}
      <div className="dc-tabscontenttitle dc-addnew">
        <h3>Appointments</h3>
        {/* <a href="#">Add Appointment</a> */}
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

                  {/* Procedures */}
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={
                        expandedRow === appt.id && expandedField === "procedures"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => handleViewClick(appt.id, "procedures")}
                      style={{
                        border: "none",
                        width: "70px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      View
                    </Button>
                  </td>

                  {/* Notes */}
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={
                        expandedRow === appt.id && expandedField === "notes"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => handleViewClick(appt.id, "notes")}
                      style={{
                        border: "none",
                        width: "70px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      View
                    </Button>
                  </td>

                  {/* Treatment Plan */}
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant={
                        expandedRow === appt.id && expandedField === "treatmentPlan"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => handleViewClick(appt.id, "treatmentPlan")}
                      style={{
                        border: "none",
                        width: "70px",
                        height: "30px",
                        boxShadow: "none",
                      }}
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
                        // backgroundColor="var(--cardcolor)"
                          // title={expandedField}
                          // addNewLabel={`Add ${expandedField}`}
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
      </div>
    </div>
  );
};

export default AppointmentsTable;
