import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaClock,
  FaEnvelopeOpenText,
  FaMoneyBillWave,
  FaInfoCircle,
  FaBell,
  FaExclamationTriangle,
  FaTools,
  FaUserMd,
  FaComments,
  FaFlask,
  FaSyncAlt,
  FaTimesCircle,
  FaTimes
} from "react-icons/fa";
export  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
export const getRandomNumber = ( min = 40, max = 95 ) => {return Math.floor(Math.random() * (max - min + 1)) + min;};
  // === Truncate long titles ===
   export const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
export const getNotificationIcon = (type) => {
 switch (type) {
   case "AppointmentBooked":
     return <FaCalendarCheck style={{ color: "#2ecc71" }} />; // Green

   case "AppointmentCancelledByDoctor":
     return <FaTimesCircle style={{ color: "#e74c3c" }} />; // Red

   case "AppointmentCancelledByPatient":
     return <FaCalendarTimes style={{ color: "#e74c3c" }} />; // Red

   case "AppointmentRescheduled":
     return <FaSyncAlt style={{ color: "#9b59b6" }} />; // Purple

   case "AppointmentReminder24h":
   case "AppointmentReminder1h":
     return <FaClock style={{ color: "#f39c12" }} />; // Orange

   case "PaymentSuccessful":
     return <FaMoneyBillWave style={{ color: "#27ae60" }} />; // Dark Green

   case "PaymentFailed":
     return <FaExclamationTriangle style={{ color: "#c0392b" }} />; // Dark Red

   case "SystemAnnouncement":
     return <FaInfoCircle style={{ color: "#3498db" }} />; // Blue

   case "MaintenanceNotification":
     return <FaTools style={{ color: "#7f8c8d" }} />; // Grey

   case "AccountVerificationReminder":
     return <FaEnvelopeOpenText style={{ color: "#2980b9" }} />; // Blue

   case "NewDoctorAvailableInArea":
     return <FaUserMd style={{ color: "#8e44ad" }} />; // Purple

   case "NewMessage":
     return <FaComments style={{ color: "#16a085" }} />; // Teal

   case "Test":
     return <FaFlask style={{ color: "#8e44ad" }} />; // Purple

   default:
     return <FaBell style={{ color: "#95a5a6" }} />; // Light Grey
 }
};