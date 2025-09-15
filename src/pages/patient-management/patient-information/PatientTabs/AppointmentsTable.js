import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEye, FaPencilAlt } from "react-icons/fa";

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

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Medical Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editRecord && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Event Type</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.eventType}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, eventType: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.date}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Details</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.details}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, details: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editRecord.notes}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, notes: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light" variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button class="dc-btn"  onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicalHistoryTable;
