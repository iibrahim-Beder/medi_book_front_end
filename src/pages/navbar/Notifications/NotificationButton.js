import React, { useState, useEffect, useMemo } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { Bell } from "lucide-react";
import "../../patient-management/patient-information/PatientTabs/component/DateRangePicker.css";
import "../NotificationButton.css";
import { t } from "i18next";
import { Link } from "react-router-dom";
import {
  formatTime,
  getNotificationIcon,
  truncateTitle,
} from "../../shared/utils";
import { IoCheckmarkOutline } from "react-icons/io5";
import { isNewNotification, useNotifications } from "./useNotifications";
import Loader from "../../shared/Loader";

const NotificationDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loadMore,
    markAllAsRead,
    handleNotificationClick,
    isFetching,
    isConnected,
    isLoading,
    refetch,
    hasMore,
  } = useNotifications(1);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isBottom) {
      loadMore();
    }
  };

  return (
    <>
      <Dropdown
        show={isDropdownOpen}
        align="end"
        className="notifications"
        onToggle={(isOpen) => {
          setIsDropdownOpen(isOpen);
          if (isOpen) {
            if (!isConnected||!notifications) {
              refetch();
            }
          }
        }}
      >
        <Dropdown.Toggle
          variant="light"
          id="dropdown-notifications"
          className="position-relative noti-nav active-dot rounded-circle"
          style={{
            borderRadius: "50%",
            fontSize: "large",
            color: "#6B7280",
            background: "rgb(249, 249, 249)",
            boxShadow: "none",
            display: "flex",
            border: "1px solid #ddd",
            padding: "6px",
            position: "relative",
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge
              pill
              bg="danger"
              className="position-absolute"
              style={{
                backgroundColor: "red",
                color: "white",
                top: "-5px",
                right: "-5px",
                fontSize: "0.7rem",
                minWidth: "fit-content",
                height: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
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

            {notifications.filter((n) => !n.isRead).length > 0 && (
              <div className="d-flex align-items-center gap-2">
                <button onClick={markAllAsRead} className="add-btn">
                  {t("Mark all as read")}
                  <IoCheckmarkOutline />
                </button>
              </div>
            )}
          </div>

          <div
            className="noti-content"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div
                className=""
                style={{
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                  {Loader("loading-in-side")}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-4">
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  🔔
                </div>
                <p className="text-muted mb-0">{t("No notifications")}</p>
              </div>
            ) : (
              <ul className="list-unstyled m-0">
                {notifications.map((n, index) => (
                  <li
                    key={n.id || `realtime-${index}`}
                    className="notification-message border-bottom"
                    onClick={() => handleNotificationClick(n.id)}
                    style={{
                      cursor: n.isRead ? "default" : "pointer",
                      position: "relative",
                    }}
                  >
                    <div
                      className="  d-flex align-items-start p-2 text-decoration-none text-dark"
                      style={{
                        gap: "10px",
                      }}
                    >
                      <span
                        className="avatar me-2"
                        style={{ minWidth: "40px" }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            color: "white",
                            backgroundColor: "#e6e8ee57",
                          }}
                        >
                          {getNotificationIcon(n.relatedEntityType)}
                        </div>
                      </span>
                      <div className="media-body">
                        <h6 className="mb-1 d-flex justify-content-between">
                          <span className="text-ellipsis" title={n.title}>
                            {n.title}
                          </span>
                          <span
                            className="text-muted small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {formatTime(n.createdAt)}
                          </span>
                        </h6>
                        <p
                          title={n.message}
                          className="mb-0 small text-ellipsis"
                          style={{ direction: "inherit", maxWidth: "230px" }}
                        >
                          {n.message}
                        </p>
                      </div>

                      {!n.isRead && (
                        <span className="ms-auto">
                          <div
                            className="rounded-circle"
                            title={
                              isNewNotification(n.createdAt) ? t("New") : ""
                            }
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: isNewNotification(n.createdAt)
                                ? "#28a745"
                                : "#dc3545",
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              {hasMore &&  <li
                  style={{
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isFetching ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {Loader("loading-in-side")}
                </li>}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="topnav-dropdown-footer border-top p-2 text-center">
              <Link to="/notifications">
                <button
                  className="text-primary text-decoration-none"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View all notifications
                </button>
              </Link>
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;
