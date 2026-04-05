import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AppointmentInformation from "./tabs/AppointmentInformation";
import DiagnosisMobileViewWithCRUD from "./tabs/DiagnosisTab";
export default function PatientProfilePageMain() {
  const [activeTab, setActiveTab] = useState("AppointmentInformation");
  const { t } = useTranslation();

  const tabs = [
    { key: "AppointmentInformation", label: t("Appointment information") },
   { key: "Diagnoses", label: t("Diagnoses") },
  ];

  return (
    <div className="">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className="dc-dashboardbox dc-dashboardtabsholder setting">
          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs" style={{ width: "20%" }}>
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`#${tab.key}`}
                    PatientNotes
                    className={`${activeTab === tab.key ? "active" : ""}`}
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

          {/* Tabs Content */}
          <div
            className={`dc-tabscontent tab-content ${activeTab === "Diagnoses" ? "dignoses-active" : ""}`} 
            style={{ width: "80%", display: "flex", justifyContent: "center", paddingTop:"30px" }}
          >
            {activeTab === "Diagnoses"  &&<DiagnosisMobileViewWithCRUD />}
            {activeTab === "AppointmentInformation" && <AppointmentInformation />}
       
          </div>
        </div>
      </div>
    </div>
  );
}
