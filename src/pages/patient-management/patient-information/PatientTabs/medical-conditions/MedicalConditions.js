// MedicalConditions.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DiagnosedConditions from "./diagnosed-conditions/DiagnosedConditions";
import OtherMedicalConditions from "./other/OtherMedicalConditions";
import { useDevice } from "../../../../../context/useIsMobile";

export default function MedicalConditions() {
  const [activeTab, setActiveTab] = useState("DiagnosedConditionsTable");
  const { t } = useTranslation();
  const { isMobile } = useDevice();

  const tabs = [
    { key: "DiagnosedConditionsTable", label: t("MedicalConditions.tab_diagnosed_conditions") },
    { key: "OtherMedicalConditions", label: t("MedicalConditions.tab_other") },
  ];

  return (
    <div className="col-12 p-0 two-tabs">
      <div className="div-container-tabs">
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill two-tabs-nav-container">
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
          className={`card-body ${isMobile ? "p-0 pt-2" : ""}`}
          style={{ backgroundColor: "var(--scbccolor)" }}
        >
          {activeTab === "DiagnosedConditionsTable" && (
            <div className="table-responsive">
              <DiagnosedConditions />
            </div>
          )}

          {activeTab === "OtherMedicalConditions" && (
            <div className="table-responsive">
              <OtherMedicalConditions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}