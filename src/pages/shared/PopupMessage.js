import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
// import "../../MainCss.css";
// component for popup message with icon, title, message, buttons, and close functionality
export default function PopupMessage({
  type = "info", // success, warning, danger, info
  title = "Title here",
  message = "This is a popup message",
  iconOverride,
  buttons = [{ text: "OK", onClick: () => {}, variant: "primary" }],
  onClose
}) {
  const [closing, setClosing] = useState(false);

  const typeStyles = {
    success: { color: "#28a745", icon: <FaCheckCircle /> },
    warning: { color: "#ffc107", icon: <FaExclamationTriangle /> },
    danger: { color: "#dc3545", icon: <FaTimesCircle /> },
    info: { color: "#4285f4", icon: <FaInfoCircle /> },
  };

  const { color, icon } = typeStyles[type] || typeStyles.info;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <div className={`popup-overlay ${closing ? "closing" : ""}`}>
      <div className="popup-card">
        
        <button className="popup-close" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="popup-header" style={{ color }}>
          {iconOverride || icon}
          <h3>{title}</h3>
        </div>

        <div className="popup-body">
          <p>{message}</p>
        </div>

        {buttons?.length > 0 && (
          <div className="popup-footer">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={`popup-btn ${btn.variant || "primary"}`}
                onClick={btn.onClick}
              >
                {btn.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
