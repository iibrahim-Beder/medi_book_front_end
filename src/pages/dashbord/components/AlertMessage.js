import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import "./AlertMessage.scss";
import { Row } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";

// Import the API hook and the icon utility
import { useLazyGetDoctorNotificationsQuery, useMarkNotificationAsReadwithoutInvalidateMutation } from "../../../api/notifications/doctorNotificationsApi";
import { getNotificationIcon } from "../../shared/utils";
import toast from "react-hot-toast";
import { t } from "i18next";

export function AlertMessage({
  type = "info",
  title = "This is neutral message",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  actionText = "Action",
  onActionClick,
  onClose,
  icon: customIcon, // 👈 new optional prop to override the default icon
}) {
  const typeStyles = {
    success: { background: "#28a745", icon: <FaCheckCircle style={{ color: "#28a745" }} /> },
    warning: { background: "#ffc107", icon: <FaExclamationTriangle style={{ color: "#ffc107" }} /> },
    danger: { background: "#dc3545", icon: <FaTimesCircle style={{ color: "#dc3545" }} /> },
    info: { background: "#4285f4", icon: <FaInfoCircle style={{ color: "var(--themecolor)" }} /> },
  };

  const { buttonStyle, icon: defaultIcon } = typeStyles[type] || typeStyles.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, height: 0 }}
      animate={{ opacity: 1, scale: 1, height: "auto" }}
      exit={{
        opacity: 0,
        scale: 0.95,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{ overflow: "hidden" }}
      className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
    >
      <div className="table-card alert-neutral dc-jobalerts p-3 mb-3">
        <button className="alert-close" onClick={onClose}>
          <RiCloseLargeLine />
        </button>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Use custom icon if provided, otherwise fall back to the default one */}
          <div className="alert-icon">{customIcon || defaultIcon}</div>
          <h3 className="alert-title">{title}</h3>
        </div>

        <p className="alert-message text-ellipsis">{message}</p>

        {/* <div className="alert-actions">
          <button
            className="alert-button"
            style={buttonStyle}
            onClick={onActionClick}
          >
            {actionText}
          </button>
        </div> */}
      </div>
    </motion.div>
  );
}

export default function AlertMessages() {
  const [alerts, setAlerts] = useState([]);

  // Lazy query to fetch the last 4 unread notifications – called only once on mount
  const [trigger, { data, isLoading }] = useLazyGetDoctorNotificationsQuery();

  useEffect(() => {
    trigger({
      filter: { 
        // isRead: false,
        relatedEntityType:"System"
      }, // only unread
      pageNumber: 1,
      pageSize: 4,               
    });
  }, [trigger]);
    const [markAsRead] = useMarkNotificationAsReadwithoutInvalidateMutation();
  

  // When data arrives, transform it into the format expected by AlertMessage
  useEffect(() => {
    if (data?.data) {
      const transformed = data.data.map((note) => ({
        id: note.id,
        // Map backend notification type to the AlertMessage "type" prop
        type: mapNotificationType(note.type),
        title: note.title,
        message: note.message,
        // Use the same icon utility as the main notifications page
        icon: getNotificationIcon(note.relatedEntityType),
        actionText: "Take Action",   // kept exactly as in the original hardcoded example
        onActionClick: () => {},     // no additional behaviour – stays as before
      }));
      setAlerts(transformed);
    }
  }, [data]);

  // const removeAlert = (id) => {
  //   setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  // };
    const handleMarkAsRead = useCallback(async (notificationId) => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== notificationId));
          try {
            await markAsRead(notificationId).unwrap();
          } catch (err) {
            toast.error(t("Failed to mark as read"));
            console.error("Failed to mark as read", err);
          }
        }, [markAsRead]);
        

  // While loading, render nothing – just like the original component did before fetching
  if (isLoading && alerts.length === 0) {
    return null;
  }

  return (
    <div className="dc-haslayout dc-jobalertsdashboard">
      <Row>
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <AlertMessage
              key={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              actionText={alert.actionText}
              onActionClick={alert.onActionClick}
              onClose={() => handleMarkAsRead(alert.id)}
              icon={alert.icon} // 👈 the custom icon from getNotificationIcon
            />
          ))}
        </AnimatePresence>
      </Row>
    </div>
  );
}

// Simple mapper to keep the original behaviour of the AlertMessage component
function mapNotificationType(backendType) {
  switch (backendType) {
    case "Info":
      return "info";
    case "Warning":
      return "warning";
    case "Alert":
      return "danger";
    case "Reminder":
      return "info"; // neutral, but you can change to "warning" if preferred
    default:
      return "info";
  }
}