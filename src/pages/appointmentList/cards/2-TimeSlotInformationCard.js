import { useTranslation } from "react-i18next";
import "../../MainCss.css";

const TimeSlotInformationCard = ({ slot }) => {
  const { t } = useTranslation();

  // border color based on status
  const borderColor = {
    Completed: "#28a745",
    Cancelled: "#dc3545",
    Empty: "#6c757d",
    Pending: "#ffc107",
  }[slot.status] || "#000";

  return (
    <div className="dc-user-grid ml-0">
      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.status")}:</h4>
          <span style={{ color: borderColor }}>
            {t(`slotStatuses.${slot.status}`)}
          </span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.bookingDate")}:</h4>
          <span>{slot.bookingDate}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.startTime")}:</h4>
          <span>{slot.startTime}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.endTime")}:</h4>
          <span>{slot.endTime}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.duration")}:</h4>
          <span>{slot.duration}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.shiftName")}:</h4>
          <span>{slot.shiftName}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("slot.location")}:</h4>
          <span>{slot.location}</span>
        </div>
      </div>

      <div className="dc-user-info" style={{ marginBottom: "40px" }}>
        <div className="dc-title">
          <h4>{t("slot.price")}:</h4>
          <span className="mb-10">{slot.price}</span>
          <hr className="CustHr" />
        </div>
      </div>
    </div>
  );
};

export default TimeSlotInformationCard;
