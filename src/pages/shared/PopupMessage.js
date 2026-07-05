import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { LiaTimesCircle } from "react-icons/lia";
import { IoCloseCircle } from "react-icons/io5";
import { MdClose } from "react-icons/md";

// import "../../MainCss.css";
// component for popup message with icon, title, message, buttons, and close functionality
export default function PopupMessage({
  type = "info", // success, warning, danger, info
  title = "Title here",
  message = "This is a popup message",
  iconOverride,
  buttons = [{ text: "OK", onClick: () => {}, variant: "primary" ,disabled: false }],
  onClose,
  children
}) {
  const [closing, setClosing] = useState(false);

  const typeStyles = {
    success: { color: "#28a745", icon: <FaCheckCircle /> },
    warning: { color: "#ffc107", icon: <FaExclamationTriangle /> },
    danger: { clssName:"danger-Pbtn", icon: <MdClose /> },
    info: { color: "#4285f4", icon: <FaInfoCircle /> },
  };

  const {clssName, color, icon ,border , bakgroundColor } = typeStyles[type] || typeStyles.info;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

   useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);
  return (
    <div className={`popup-overlay ${closing ? "closing" : ""}`}>
      <div className="popup-card">
{/*         
        <button className="popup-close" onClick={handleClose}>
          <LiaTimesCircle />
        </button> */}

        <div className="popup-header" >
          <div className={clssName} style={{ color, border , bakgroundColor }}>
             {iconOverride || icon}
            </div>
          <h3>{title}</h3>
        </div>

        <div className="popup-body">
          {children}
          <p>{message}</p>
        </div>

        {buttons?.length > 0 && (
          <div className="popup-footer">
            {buttons.map((btn, index) => (
              <button
              disabled={btn.disabled}
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
