import React, { useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { Bell } from "lucide-react";
import "./NotificationButton.css"
const NotificationDropdown = () => {
  const [notifications] = useState([
    {
      id: 1,
      name: "Travis Tremble",
      time: "18.30 PM",
      message: "Sent a amount of $210 for his Appointment",
      doctor: "Dr. Ruby perin",
      avatar: "assets/img/clients/client-01.jpg",
    },
    {
      id: 2,
      name: "Travis Tremble",
      time: "12 Min Ago",
      message: "has booked her appointment to",
      doctor: "Dr. Hendry Watt",
      avatar: "assets/img/clients/client-02.jpg",
    },
    {
      id: 3,
      name: "Travis Tremble",
      time: "6 Min Ago",
      message: "Sent a amount  $210 for his Appointment",
      doctor: "Dr. Maria Dyen",
      avatar: "assets/img/clients/client-03.jpg",
    },
    {
      id: 4,
      name: "Travis Tremble",
      time: "8.30 AM",
      message: "Send a message to his doctor",
      doctor: "",
      avatar: "assets/img/clients/client-04.jpg",
    },
  ]);

  return (
    <Dropdown align="end" className="notifications">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-notifications"
        className="position-relative noti-nav active-dot active-dot-danger rounded-circle"
        style={{
          borderRadius: "50%",
          fontSize: "large",
          color: "var(--terthemecolor)",
          background: "rgb(249, 249, 249)",
          boxShadow: "none",
          display: "flex",
          border: "1px solid #ddd",
          padding: "6px",
        }}
      >
        <Bell size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="dropdown-menu-end shadow"
        style={{ minWidth: "350px" }}
      >
        <div className="topnav-dropdown-header p-2 border-bottom">
          <span className="fw-bold">Notifications</span>
        </div>
        <div
          className="noti-content"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <ul className="list-unstyled m-0">
            {notifications.map((n) => (
              <li key={n.id} className="notification-message border-bottom">
                <a
                  href="#"
                  className="d-flex align-items-start p-2 text-decoration-none text-dark"
                style={{ gap: "10px" }}
                >
                  <span className="avatar me-2">
                    <img
                      src="/images/user-login.jpg"
                      alt={n.name}
                      className="rounded-circle"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </span>
                  <div className="media-body">
                    <h6 className="mb-1 d-flex justify-content-between">
                      {n.name}{" "}
                      <span className="text-muted small">{n.time}</span>
                    </h6>
                    <p className="mb-0 small">
                      {n.message}{" "}
                      {n.doctor && <span className="fw-bold">{n.doctor}</span>}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
