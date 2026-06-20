import React from "react";
import { useTranslation } from "react-i18next";

export default function PatientDetails({ name, phoneNumber, patientAge, isFirstVisit, address, bookingType }) {
  const { t } = useTranslation();

  return (
    <div className="dc-user-grid ml-0">
      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.name")}:</h4>
          <span>{name || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info mt-0">
        <div className="dc-title">
          <h4>{t("phone Number")}:</h4>
          <span>{phoneNumber  || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("age")}:</h4>
          <span>{patientAge  || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("first visit")}:</h4>
          <span>{isFirstVisit? "Yes" : "No" || "—"}</span>
        </div>
      </div>

      <div className="dc-user-info">
        <div className="dc-title">
          <h4>{t("patient.bookingType")}:</h4>
          <span>{bookingType  || "—"}</span>
          <hr className="CustHr CustHrX" />
          <br />
        </div>
      </div>
    </div>
  );
}
