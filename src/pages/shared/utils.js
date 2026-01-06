import { t } from "i18next";
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

  export const formatTime = (dateString) => {
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

  export function formatTime12(dateString) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
export function formatDay(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
}
export function isSameDay(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}



export function formatChatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const sameYear =
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,   // ✅ 12-hour
  });

  if (sameDay) {
    // 09:30 AM
    return time;
  }

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();

  if (sameYear) {
    // Jun 28, 09:30 AM
    return `${month} ${day}, ${time}`;
  }

  // Jun 28, 2017 09:30 AM
  return `${month} ${day}, ${date.getFullYear()} ${time}`;
}

  export const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
