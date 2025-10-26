// Medications.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Othermedications from "./Othermedications";
import PrescribedMedicationTable from "./PrescribedMedicationTable";
import { useDevice } from "../../../../context/useIsMobile";
import PrescribedMedicationMobileView from "./PrescribedMedicationMobileView";
import OtherMedicationMobileView from "./OtherMedicationMobileView";

export default function Medications() {
  const [activeTab, setActiveTab] = useState("PrescribedMedicationTable");
  const { t } = useTranslation();
  const { isMobile } = useDevice();

  const tabs = [
    { key: "PrescribedMedicationTable", label: t("Medications.prescribed_medication") },
    { key: "Othermedications", label: t("Medications.other_medications") },
  ];

  return (
    <div className="col-12 p-0 two-tabs">
      <div className="div-container-tabs">
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill padding-right two-tabs-nav-container">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <a
                href={`#${tab.key}`}
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.key);
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="card m-0 border-0" style={{ boxShadow: "none" }}>
        {/* Tabs Content */}
        <div
          className={`card-body ${isMobile ? "p-0 pt-2 " : ""}`}
          style={{ backgroundColor: "var(--scbccolor)" }}
        >
          {activeTab === "PrescribedMedicationTable" && (
            <div className="table-responsive">
              {isMobile ? <PrescribedMedicationMobileView /> : <PrescribedMedicationTable />}
            </div>
          )}

          {activeTab === "Othermedications" && (
            <div className="table-responsive">
              {isMobile ? <OtherMedicationMobileView /> : <Othermedications />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}