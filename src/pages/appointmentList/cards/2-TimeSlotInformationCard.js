import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import { formatDate } from "../../shared/utils";

const TimeSlotInformationCard = ({
  status,
  startTime,
  endTime,
  duration,
  shiftName,
  slotDate,
  location,
  price,
  showLine=true
}) => {
  const { t } = useTranslation();

  // border color based on status
  const Color =
  {
    Available: "#0d6efd", // Blue
    Pending: "#fd7e14",   // Orange
    Completed: "#198754", // Green
    Cancelled: "#dc3545", // Red
    Empty: "#6c757d",     // Gray
  }[status] || "#000";

  return (
    <div className="dc-user-grid ml-0">
      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.status")}:</h4>
          <span style={{ color: Color }}>
            {t(`${status || "—"}`)}
          </span>
        </div>
      </div>

      <div className="dc-user-info mt-0">
        <div className="dc-title">
          <h4>{t("slot.bookingDate")}:</h4>
          <span>{formatDate(slotDate) || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.startTime")}:</h4>
          <span>{startTime || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.endTime")}:</h4>
          <span>{endTime || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.duration")}:</h4>
          <span>{duration || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.shiftName")}:</h4>
          <span>{shiftName || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.location")}:</h4>
          <span>{location || "—"}</span>  
        </div>
      </div>

      <div className="dc-user-info" style={{ marginBottom: "40px" }}>
        <div className="dc-title">
          <h4>{t("slot.price")}:</h4>
          <span className="mb-10">{price}</span>
       {showLine &&<hr className="CustHr " style={{ marginTop: "35px" }} />}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotInformationCard;
