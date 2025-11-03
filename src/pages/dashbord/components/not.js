import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes
} from "react-icons/fa";
import "./aaa.scss";
// this is components AlertCard
export default function AlertCard({
  type = "warning", // success, warning, danger, info
  message,
  actionText,
  position = "bottom-right", // "bottom-left" or "bottom-right"
  duration, //time in ms for auto close, optional
  onActionClick
}) {
  const [visible, setVisible] = useState(true);

  // close after duration if duration is provided
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Colors and icons based on type
  const types = {
    success: { color: "#28a745", icon: <FaCheckCircle /> },
    warning: { color: "#ffc107", icon: <FaExclamationTriangle /> },
    danger: { color: "#dc3545", icon: <FaTimesCircle /> },
    info: { color: "#17a2b8", icon: <FaInfoCircle /> }
  };

  const { color, icon } = types[type] || types.info;

  const positionClasses =
    position === "bottom-right" ? "alert-bottom-right" : "alert-bottom-left";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`alert-card ${positionClasses}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon */}
          <div className="alert-icon" style={{ backgroundColor: color }}>
            {icon}
          </div>

          {/* Text and Action */}
          <div className="alert-content">
            <p>{message}</p>
            {actionText && (
              <button
                className="alert-action"
                style={{ backgroundColor: color }}
                onClick={onActionClick}
              >
                {actionText}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button className="alert-close" onClick={() => setVisible(false)}>
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
