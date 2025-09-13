import React from "react";
import { Table, Button } from "react-bootstrap";
import { PiCalendarLight } from "react-icons/pi";
import "../../Patient-management.css";

const AppointmentsTable = () => {
  const appointmentsData = [
    {
      id: "#AP001",
      date: "15 Sep 2025",
      time: "10:30 AM",
      sessionType: "Clinic Visit",
      status: "Confirmed",
      procedures: "Basic procedures",
      notes: "The patient responded well",
      treatmentPlan: "Follow-up session after one week",
    },
    {
      id: "#AP002",
      date: "16 Sep 2025",
      time: "01:00 PM",
      sessionType: "Video Call",
      status: "Confirmed",
      procedures: "General examination",
      notes: "Needs blood tests",
      treatmentPlan: "Follow-up after results",
    },
    {
      id: "#AP003",
      date: "18 Sep 2025",
      time: "11:15 AM",
      sessionType: "Routine Checkup",
      status: "Cancelled",
      procedures: "Not performed",
      notes: "Patient cancelled the appointment",
      treatmentPlan: "Reschedule",
    },
    {
      id: "#AP004",
      date: "20 Sep 2025",
      time: "09:00 AM",
      sessionType: "Clinic Visit",
      status: "Postponed",
      procedures: "Initial consultation",
      notes: "Doctor requested to delay",
      treatmentPlan: "Reschedule after doctor availability",
    },
  ];

  return (
    <div
      className="shadow-sm mt-4"
      style={{ border: "none", borderRadius: "12px" }}
    >
      <div className="p-3">
        <div className="d-flex justify-content-between mb-3">
          <h3>
            <PiCalendarLight /> Appointments List
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <Table
            className="align-middle mb-0 table-hover"
            style={{ whiteSpace: "nowrap" }}
          >
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
                <tr key={appt.id}>
                  <td className="border-0">{appt.date}</td>
                  <td className="border-0">{appt.time}</td>
                  <td className="border-0">{appt.sessionType}</td>
                  <td className="border-0">{appt.status}</td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        width: "60px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      visit
                    </Button>
                  </td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        width: "60px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      View
                    </Button>
                  </td>
                  <td className="border-0">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        width: "60px",
                        height: "30px",
                        boxShadow: "none",
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      
    </div>
  );
};

export default AppointmentsTable;
