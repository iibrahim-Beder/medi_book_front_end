// Medications.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Othermedications from "./other/OthermedicationsTable";
import PrescribedMedicationTable from "./prescribed-medication/PrescribedMedicationTable";
import { useDevice } from "../../../../../context/useIsMobile";
import PrescribedMedicationMobileView from "./prescribed-medication/PrescribedMedicationMobileView";
import OtherMedicationMobileView from "./other/OthermedicationsMobileView";

export default function Medications({patientId}) {
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
            <div className="">
              {isMobile ? <PrescribedMedicationMobileView patientId={patientId} /> : <PrescribedMedicationTable patientId={patientId}/>}
            </div>
          )}

          {activeTab === "Othermedications" && (
            <div className="">
              {isMobile ? <OtherMedicationMobileView patientId={patientId} /> : <Othermedications patientId={patientId}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}