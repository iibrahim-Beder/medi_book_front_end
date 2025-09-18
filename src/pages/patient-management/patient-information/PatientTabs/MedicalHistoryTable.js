import React, { useState } from "react"; 
import { Table, Button, InputGroup, Form } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal"; 
import "../../Patient-management.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const MedicalHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const rowsPerPage = 5;

  const medicalHistory = [
    {
      id: "MH001",
      date: "2025-08-10",
      eventType: "Surgery",
      description: "Appendectomy performed successfully.",
      notes: "No complications. Fast recovery expected.",
    },
    {
      id: "MH002",
      date: "2025-07-05",
      eventType: "Lab Test",
      description: "Blood test for routine check.",
      notes: "Cholesterol slightly elevated.",
    },
    {
      id: "MH003",
      date: "2025-06-20",
      eventType: "Clinic Visit",
      description: "Follow-up for diabetes.",
      notes: "Medication adjusted.",
    },
    {
      id: "MH004",
      date: "2025-05-15",
      eventType: "Imaging",
      description: "X-ray for chest pain.",
      notes: "Normal results.",
    },
    {
      id: "MH005",
      date: "2025-04-10",
      eventType: "Vaccination",
      description: "Flu shot administered.",
      notes: "No side effects.",
    },
    {
      id: "MH006",
      date: "2025-03-22",
      eventType: "Emergency Visit",
      description: "Shortness of breath.",
      notes: "Treated and discharged.",
    },
  ];

  // تعريف الحقول اللي هتظهر في DynamicEditModal
  const fields = [
    { name: "id", label: "ID", type: "text", placeholder: "Enter ID" },
    { name: "date", label: "Date", type: "date" },
    { name: "eventType", label: "Event Type", type: "text", placeholder: "Enter event type" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter notes" },
  ];

  const handleView = (id) => alert(`View details of ${id}`);

  const handleEdit = (entry) => {
    setSelectedRecord(entry);   // حفظ البيانات الحالية في الاستيت
    setShowModal(true);         // فتح المودال
  };

  const handleSave = () => {
    console.log("Saved record:", selectedRecord);
    setShowModal(false);
  };

  const filteredData = medicalHistory.filter((entry) => {
    if (!searchTerm) return true;

    const lowerTerm = searchTerm.toLowerCase();
    if (searchBy === "all") {
      return (
        entry.id.toLowerCase().includes(lowerTerm) ||
        entry.date.toLowerCase().includes(lowerTerm) ||
        entry.eventType.toLowerCase().includes(lowerTerm) ||
        entry.description.toLowerCase().includes(lowerTerm) ||
        entry.notes.toLowerCase().includes(lowerTerm)
      );
    } else {
      return entry[searchBy]?.toLowerCase().includes(lowerTerm);
    }
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="table-container MedicalHistoryTable">
      <div className="table-header">
        <h3 className="table-title">Medical History</h3>
        <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
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
              <option value="eventType">Event Type</option>
              <option value="description">Description</option>
              <option value="notes">Notes</option>
            </Form.Select>
          </InputGroup>

          {/* Table */}
          <div className="scrol" style={{overflow:"auto"}}> 
            <Table className="data-table align-middle  table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Event Type</th>
                  <th>Description</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.date}</td>
                    <td>{entry.eventType}</td>
                    <td>{entry.description}</td>
                    <td>{entry.notes}</td>
                    <td>
                      <Button
                    
                        variant="outline-primary"
                        size="lg"
                        className="me-2"
                        onClick={() => handleView(entry.id)}
                      >
                      <MdOutlineRemoveRedEye/>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={() => handleEdit(entry)}
                        >
                        <FaRegEdit/>
                      </Button>
                    </td>
                  </tr>
                ))}

                {currentData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination & Info */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="info-bar">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>

            <div className="pagination-buttons">
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
            </div>
          </div>
        </div>
      </div>

      {/* مودال التعديل */}
      {selectedRecord && (
        <DynamicEditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          record={selectedRecord}
          setRecord={setSelectedRecord}
          fields={fields}
          title="Edit Medical History"
        />
      )}
    </div>
  );
};

export default MedicalHistoryTable;
