import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEye, FaPencilAlt } from "react-icons/fa";

const MedicalHistoryTable = () => {
  const historyData = [
    {
      id: "H001",
      eventType: "Surgery",
      date: "12 Jan 2023",
      details: "Appendix removal",
      notes: "Successful operation, no complications",
    },
    {
      id: "H002",
      eventType: "Hospitalization",
      date: "03 Mar 2024",
      details: "Admitted for pneumonia",
      notes: "Required 5 days stay, antibiotics prescribed",
    },
    {
      id: "H003",
      eventType: "Checkup",
      date: "25 Aug 2025",
      details: "Routine annual check",
      notes: "Blood pressure slightly high",
    },
  ];

  const handleView = (record) => {
    alert(`Viewing record:\n${JSON.stringify(record, null, 2)}`);
  };

  const handleEdit = (record) => {
    alert(`Editing record:\n${JSON.stringify(record, null, 2)}`);
  };

  return (
    <div
      className="shadow-sm mt-4"
      style={{ border: "none", borderRadius: "12px" }}
    >
      {/* Header */}
      <div className="dc-tabscontenttitle dc-addnew">
        <h3>Medical History</h3>
        <a href="#">Add Record</a>
      </div>

      <div className="p-3">
        <Table
          className="align-middle mb-0 table-hover"
          style={{ whiteSpace: "nowrap" }}
        >
          <thead className="table-light">
            <tr>
              <th className="border-0">ID</th>
              <th className="border-0">Event Type</th>
              <th className="border-0">Date</th>
              <th className="border-0">Details</th>
              <th className="border-0">Notes</th>
              <th className="border-0 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record) => (
              <tr key={record.id}>
                <td className="border-0">{record.id}</td>
                <td className="border-0">{record.eventType}</td>
                <td className="border-0">{record.date}</td>
                <td className="border-0">{record.details}</td>
                <td className="border-0">{record.notes}</td>
                <td className="border-0 text-center">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleView(record)}
                    style={{ border: "none", boxShadow: "none" }}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleEdit(record)}
                    style={{ border: "none", boxShadow: "none" }}
                  >
                    <FaPencilAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MedicalHistoryTable;
