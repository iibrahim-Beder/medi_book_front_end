import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import DynamicEditModal from "../../../shared/DynamicEditModal"; // ← المسار حسب مكانه

const MedicalHistoryTable = () => {
  const [historyData, setHistoryData] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const handleView = (record) => {
    alert(`Viewing record:\n${JSON.stringify(record, null, 2)}`);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setShowModal(true);
  };

  const handleSave = () => {
    setHistoryData((prev) =>
      prev.map((item) => (item.id === editRecord.id ? editRecord : item))
    );
    setShowModal(false);
  };

  const fields = [
    { name: "eventType", label: "Event Type", type: "text" },
    { name: "date", label: "Date", type: "text" },
    { name: "details", label: "Details", type: "textarea" ,fullWidth: true},
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true }, 

  ];

  return (
    <div className="shadow-sm mt-4" style={{ borderRadius: "12px" }}>
      <div className="dc-tabscontenttitle dc-addnew">
        <h3>Medical History</h3>
        <a href="#">Add Record</a>
      </div>

      <div className="p-3">
        <Table className="align-middle mb-0 table-hover" style={{ whiteSpace: "nowrap" }}>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Event Type</th>
              <th>Date</th>
              <th>Details</th>
              <th>Notes</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.eventType}</td>
                <td>{record.date}</td>
                <td>{record.details}</td>
                <td>{record.notes}</td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleView(record)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleEdit(record)}
                  >
                    <FaPencilAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Reusable Modal */}
      <DynamicEditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        record={editRecord}
        setRecord={setEditRecord}
        fields={fields}
        title="Edit Medical Record"
      />
    </div>
  );
};

export default MedicalHistoryTable;
