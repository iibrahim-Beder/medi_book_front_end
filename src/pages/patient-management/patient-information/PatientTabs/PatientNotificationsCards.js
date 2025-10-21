import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlineArrowForward } from "react-icons/md";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaFlask,
  FaMoneyBillWave,
  FaEnvelopeOpenText,
  FaBell,
  FaSyncAlt,
} from "react-icons/fa";

import { LiaCheckDoubleSolid } from "react-icons/lia";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";

const notificationsData = [
  {
    id: "#NT001",
    type: "appointment",
    title: "Appointment Confirmed",
    message:
      "Your appointment with Dr. Ahmed has been confirmed for 20 Oct, 3:00 PM.",
    date: "16 Oct 2025",
    status: "unread",
  },
  {
    id: "#NT002",
    type: "lab",
    title: "Lab Result Ready",
    message:
      "Your new blood test results are available to view in your patient dashboard.",
    date: "15 Oct 2025",
    status: "read",
  },
  {
    id: "#NT003",
    type: "invoice",
    title: "Payment Received",
    message:
      "Your payment for invoice #INV-045 has been successfully processed.",
    date: "14 Oct 2025",
    status: "read",
  },
  {
    id: "#NT004",
    type: "cancel",
    title: "Appointment Canceled",
    message:
      "Your appointment with Dr. Eman on 13 Oct has been canceled by the clinic.",
    date: "13 Oct 2025",
    status: "unread",
  },
  {
    id: "#NT005",
    type: "message",
    title: "New Message from Clinic",
    message:
      "Dr. Mariam sent you a new message regarding your recent checkup.",
    date: "12 Oct 2025",
    status: "unread",
  },
  {
    id: "#NT006",
    type: "reminder",
    title: "Medication Reminder",
    message: "Don't forget to take your blood pressure medicine at 9:00 PM.",
    date: "11 Oct 2025",
    status: "read",
  },
  {
    id: "#NT007",
    type: "update",
    title: "Profile Updated",
    message: "Your contact information was successfully updated.",
    date: "10 Oct 2025",
    status: "read",
  },
  {
    id: "#NT007",
    type: "update",
    title: "Profile Updated",
    message: "Your contact information was successfully updated.",
    date: "10 Oct 2025",
    status: "read",
  },
  {
    id: "#NT007",
    type: "update",
    title: "Profile Updated",
    message: "Your contact information was successfully updated.",
    date: "10 Oct 2025",
    status: "read",
  },
  {
    id: "#NT007",
    type: "update",
    title: "Profile Updated",
    message: "Your contact information was successfully updated.",
    date: "10 Oct 2025",
    status: "read",
  },
];


const PatientNotificationsCards = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(notificationsData.length / itemsPerPage);

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const paginatedNotifications = notificationsData.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const startIndex = page * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, notificationsData.length);

const typeStyles = {
  appointment: { icon: <FaCalendarCheck style={{ color: "#007bff" }} /> },
  cancel: { icon: <FaCalendarTimes style={{ color: "#dc3545" }} /> },
  lab: { icon: <FaFlask style={{ color: "#6f42c1" }} /> },
  invoice: { icon: <FaMoneyBillWave style={{ color: "#28a745" }} /> },
  message: { icon: <FaEnvelopeOpenText style={{ color: "#17a2b8" }} /> },
  reminder: { icon: <FaBell style={{ color: "#fd7e14" }} /> },
  update: { icon: <FaSyncAlt style={{ color: "#6c757d" }} /> },
  success: { icon: <FaCheckCircle style={{ color: "#28a745" }} /> },
  warning: { icon: <FaExclamationTriangle style={{ color: "#ffc107" }} /> },
  danger: { icon: <FaTimesCircle style={{ color: "#dc3545" }} /> },
  info: { icon: <FaInfoCircle style={{ color: "var(--themecolor)" }} /> },
};


  return (
    <div className="comments-list notifications-list">
      <div className=" filters-container-search ">
      {/* Header */}
      <div className="table-header">
        <div>
          <h3 className="table-title">Patient Notifications</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>
      </div>

      {/* Filters */}
      <div className="review-filters">
        <FilterDropdown small />
        <DateRangePicker />
      </div>
</div>
      {/* Notifications list */}
      <div className="table-card ">
      
      
      {paginatedNotifications.map((note) => {
        const { icon } = typeStyles[note.type] || typeStyles.info;

        return (
          <Card key={note.id} className="mb-2 border-0 noneshadow ">
          
          
            <div className="notification-card">
            <div className="icon-content">
              <div className="alert-icon">
                {icon}
              </div>
              <div>  
                <span className="mb-3">{note.message}</span>
                <p className="mb-0 d-flex " style={{gap:'4px', alignItems:"flex-end"}}>{note.date}    <LiaCheckDoubleSolid
                    style={{
                      color: note.status === "read" ? "#0b81ff" : "#c2c9d6",
                      fontSize: "large",
                      // float:"inline-end"
                    }}
                  /> </p>
              </div>
              </div>
            </div>
          </Card>
        );
      })}
      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
        <div
          className="dt-layout-cell dt-layout-start"
          style={{ fontSize: "14px", color: "#555" }}
        >
          <div className="dt-info">
            Showing {startIndex + 1} to {endIndex} of{" "}
            {notificationsData.length} entries
          </div>
        </div>

        <div className="dt-layout-cell dt-layout-end">
          <div className="dt-paging">
            <nav aria-label="pagination" className="d-flex">
              <button
                className="dt-paging-button first"
                type="button"
                disabled={page === 0}
                onClick={() => setPage(0)}
              >
                «
              </button>

              <button
                className="dt-paging-button previous"
                type="button"
                disabled={page === 0}
                onClick={handlePrevPage}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`dt-paging-button none ${
                    page === index ? "current" : ""
                  }`}
                  type="button"
                  onClick={() => setPage(index)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="dt-paging-button next"
                type="button"
                disabled={page === totalPages - 1}
                onClick={handleNextPage}
              >
                Next
              </button>

              <button
                className="dt-paging-button last"
                type="button"
                disabled={page === totalPages - 1}
                onClick={() => setPage(totalPages - 1)}
              >
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

export default PatientNotificationsCards;
