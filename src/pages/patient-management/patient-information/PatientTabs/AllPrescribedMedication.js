import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AppointmentsTable from "./AppointmentsTable";
import DiagnosisTable from "./DiagnosisTable"
import PrescribedMedicationTable from "./Medications";

export default function AllPrescribedMedication() {
  const [activeTab, setActiveTab] = useState("PrescribedMedicationTable");
  const { t } = useTranslation();

  const tabs = [
    { key: "PrescribedMedicationTable", label: t("Prescribed medication") },
    { key: "Appointments", label: t("Ather medications ") },
  ];

  return (
    <div className="col-12 p-0 two-tabs " >
       <div className="two-tabs-nav-container" style={{paddingLeft:"25px", paddingTop:"20px", backgroundColor:"#ffff"}}>
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill padding-right" style={{width:"fit-content", paddingLeft:"40px", paddingRight:"20px", fontFamily: "Poppins, Arial, Helvetica, sans-serif", fontSize: "16px" ,fontWeight:" 400"}}>
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
          {activeTab === "PrescribedMedicationTable" && (
            <div className="table-responsive">
              <PrescribedMedicationTable />
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
