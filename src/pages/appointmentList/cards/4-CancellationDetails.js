import React from "react";
import { useTranslation } from "react-i18next";

export default function CancellationDetails({ cancellation }) {
  const { t } = useTranslation();

  return (
    <div className="dc-user-grid ml-0">
      <div className="dc-user-info" style={{ float: "none" }}>
        <div className="dc-title">
          <h4>{t("cancellation.time")}:</h4>
          <span>{cancellation.time}</span>
        </div>
      </div>

      <div className="dc-user-info mt-0">
        <div className="dc-title">
          <h4>{t("cancellation.by")}:</h4>
          <span>{cancellation.cancelledBy}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("cancellation.financialStatus")}:</h4>
          <span>{cancellation.financialStatus}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("cancellation.reason")}:</h4>
          <span>{cancellation.reason || "—"}</span>
        </div>
      </div>
    </div>
  );
}
