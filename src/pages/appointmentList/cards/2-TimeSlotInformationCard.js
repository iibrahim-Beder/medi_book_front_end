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
  completed: "#66BB6A", // Green
  cancelled: "#EF5350", // Red
  Scheduled: "#4FC3F7", // Light Blue
  Booked: "#4FC3F7",    // Light Blue
  Available: "#999",    // Light Blue
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
