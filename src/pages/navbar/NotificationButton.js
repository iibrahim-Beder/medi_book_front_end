import React, { useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { Bell } from "lucide-react";
import "../patient-management/patient-information/PatientTabs/component/DateRangePicker.css";
import "./NotificationButton.css"
import { 
  useGetDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation
} from "../../api/doctorNotificationsApi";
import { t } from "i18next";
const NotificationDropdown = () => {
    const { 
    data: notificationsResponse, 
    isLoading, 
    refetch 
  } = useGetDoctorNotificationsQuery({
    pageNumber: 1,
    pageSize: 20,
    filter: { isRead: false } // Show only unread by default
  });
  const notifications = notificationsResponse?.data || [];
console.log("notifications", notifications);
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('Just now');
    if (diffMins < 60) return `${diffMins} ${t('min ago')}`;
    if (diffHours < 24) return `${diffHours} ${t('hour ago')}`;
    if (diffDays < 7) return `${diffDays} ${t('day ago')}`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dropdown align="end" className="notifications">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-notifications"
        className="position-relative noti-nav active-dot active-dot-danger rounded-circle"
        style={{
          borderRadius: "50%",
          fontSize: "large",
          color: "#6B7280",
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
        className="dropdown-menu-end notifications shadow list-date-option open"
        style={{
          minWidth: "350px",
          backgroundColor: "var(--cardcolor)",
          border: "1px solid #ccc",
          marginTop: "10px",
          maxHeight: "0",
          opacity: "0",
          overflow: "hidden",
          display: "block",
          transform: "translate(3px, 267.2222px)",
        }}
      >
        <div className="topnav-dropdown-header p-2 border-bottom">
          <span className="fw-bold" style={{ color: "var(--terthemecolor)" }}>
            Notifications
          </span>
        </div>
        <div
          className="noti-content"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
            {isLoading ? (
            <div className="text-center p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">{t('Loading notifications...')}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
              <p className="text-muted mb-0">{t('No notifications')}</p>
            </div>
          ) : (
          <ul className="list-unstyled m-0">
            {notifications.map((n) => (
              <li key={n.id} className="notification-message border-bottom">
                <a
                  href="#"
                  className="d-flex align-items-start p-2 text-decoration-none text-dark"
                  style={{ gap: "10px" }}
                >
                  <span className="avatar me-2"style={{minWidth:"40px"}}>
                    <img
                      src="/images/user-login.jpg"
                      alt={n.name}
                      className="rounded-circle"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </span>
                  <div className="media-body">
                    <h6 className="mb-1 d-flex justify-content-between">
                      {n.title}
                      <span className="text-muted small" style={{whiteSpace:"nowrap"}}>  {formatTime(n.createdAt)}</span>
                    </h6>
                    <p className="mb-0 small text-ellipsis" style={{direction:"inherit",maxWidth: "230px"}}>
                      {n.message}{" "}
                      {n.doctor && <span className="fw-bold">{n.doctor}</span>}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>)}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
