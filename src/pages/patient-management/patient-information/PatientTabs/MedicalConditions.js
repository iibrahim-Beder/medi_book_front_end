import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import DiagnosedConditions from "./DiagnosedConditions";
import AppointmentsTable from "./AppointmentsTable";

export default function MedicalConditions() {
  const [activeTab, setActiveTab] = useState("DiagnosedConditions");
  const { t } = useTranslation();

  const tabs = [
    { key: "DiagnosedConditions", label: t("Diagnosed Conditions") },
    { key: "Appointments", label: t("Other Medical Conditions") },
  ];

  return (
    <div className="col-12 p-0 two-tabs " >
       <div className="two-tabs-nav-container" style={{paddingLeft:"25px", paddingTop:"20px", backgroundColor:"#ffff"}}>
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill" style={{width:"fit-content", paddingLeft:"40px", paddingRight:"520px", fontFamily: "Poppins, Arial, Helvetica, sans-serif", fontSize: "16px" ,fontWeight:" 400"}}>
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
      <div className="card m-0 border-0" style={{boxShadow:"none"}}>

        {/* Tabs Content */}
        <div className="card-body" style={{backgroundColor:"var(--scbccolor)"}}>
          {activeTab === "DiagnosedConditions" && (
            <div className="table-responsive">
              {/* <DiagnosedConditions /> */}
            </div>
          )}

          {activeTab === "Appointments" && (
            <div className="table-responsive">
              <AppointmentsTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
