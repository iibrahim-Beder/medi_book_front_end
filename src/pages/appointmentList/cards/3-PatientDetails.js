import React from "react";
import { useTranslation } from "react-i18next";

export default function PatientDetails({ patient }) {
  const { t } = useTranslation();

  return (
    <div className="dc-user-grid ml-0">
      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.name")}:</h4>
          <span>{patient.name}</span>
        </div>
      </div>

      <div className="dc-user-info mt-0">
        <div className="dc-title">
          <h4>{t("patient.idNumber")}:</h4>
          <span>{patient.id}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.contact")}:</h4>
          <span>{patient.contact}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.notes")}:</h4>
          <span>{patient.notes || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.bookingType")}:</h4>
          <span>{patient.bookingType}</span>
          <hr className="CustHr CustHrX" />
          <br />
        </div>
      </div>
    </div>
  );
}
