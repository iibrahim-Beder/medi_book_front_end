import { useState } from "react";
import "./AlertMessage.scss";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

//this alert message component is used to show alert messages in the dashboard
// it takes the following props:
export default function AlertMessage({
  type = "info", // success, warning, danger, info
  title = "This is neutral message",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  actionText = "Action",
  onActionClick
}) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  // Define styles and icons for each alert type
  const typeStyles = {
    success: { background: "#28a745", icon: <FaCheckCircle style={{ color: "#28a745" }} /> },
    warning: { background: "#ffc107", icon: <FaExclamationTriangle style={{ color: "#ffc107" }} /> },
    danger: { background: "#dc3545", icon: <FaTimesCircle style={{ color: "#dc3545" }} /> },
    info: { background: "#4285f4", icon: <FaInfoCircle style={{ color: "var(--themecolor)" }} /> }
  };

  const { buttonStyle, icon } = typeStyles[type] || typeStyles.info;

  const handleClose = () => {
    setClosing(true); // Start closing animation
    setTimeout(() => setVisible(false), 300); // Hide element after animation
  };

  if (!visible) return null;

  return (
    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
      <div className={`alert-neutral dc-jobalerts ${closing ? "hide" : ""}`}>
      
      
      

        <button className="alert-close" onClick={handleClose}>
          <FaTimes />
        </button>
     
          <div style={{display:"flex" ,gap:"10px"}}>
        <div className="alert-icon">{icon}</div>
          
        <h3 className="alert-title">{title}</h3>
        </div>
        <p className="alert-message">{message}</p>

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
    </div>
  );
}
