import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import "./AlertMessage.scss";

export default function AlertMessage({
  type = "info",
  title = "This is neutral message",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  actionText = "Action",
  onActionClick,
  onClose, 
}) {
  const typeStyles = {
    success: { background: "#28a745", icon: <FaCheckCircle style={{ color: "#28a745" }} /> },
    warning: { background: "#ffc107", icon: <FaExclamationTriangle style={{ color: "#ffc107" }} /> },
    danger: { background: "#dc3545", icon: <FaTimesCircle style={{ color: "#dc3545" }} /> },
    info: { background: "#4285f4", icon: <FaInfoCircle style={{ color: "var(--themecolor)" }} /> },
  };

  const { buttonStyle, icon } = typeStyles[type] || typeStyles.info;

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
        paddingBottom: 0 
      }}
      transition={{ 
        duration: 0.35, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      style={{ overflow: "hidden" }}
      className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
    >
      <div className="table-card alert-neutral dc-jobalerts p-3 mb-2">
        <button className="alert-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="alert-icon">{icon}</div>
          <h3 className="alert-title">{title}</h3>
        </div>

        <p className="alert-message text-ellipsis">{message}</p>

        <div className="alert-actions">
          <button
            className="alert-button"
            style={buttonStyle}
            onClick={onActionClick}
          >
            {actionText}
          </button>
        </div>
      </div>
    </motion.div>
  );
}