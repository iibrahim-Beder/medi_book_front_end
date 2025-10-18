import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Othermedications from "./Othermedications";
import PrescribedMedicationTable from "./PrescribedMedicationTable";

export default function Medications() {
  const [activeTab, setActiveTab] = useState("PrescribedMedicationTable");
  const { t } = useTranslation();

  const tabs = [
    { key: "PrescribedMedicationTable", label: t("Prescribed medication") },
    { key: "Othermedications", label: t("Other medications") },
  ];

  return (
    <div className="col-12 p-0 two-tabs " >
       <div className="" style={{paddingLeft:"25px", paddingTop:"20px", backgroundColor:"var(--cardcolor)"}}>
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill padding-right two-tabs-nav-container" 
        // style={{width:"fit-content", paddingLeft:"40px", paddingRight:"20px", fontFamily: "Poppins, Arial, Helvetica, sans-serif", fontSize: "16px" ,fontWeight:" 400"}}
        >
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
      <div className="card m-0 border-0" style={{boxShadow:"none" }}>

        {/* Tabs Content */}
        <div className="card-body" style={{backgroundColor:"var(--scbccolor)"}}>
          {activeTab === "PrescribedMedicationTable" && (
            <div className="table-responsive">
              <PrescribedMedicationTable />
            </div>
          )}

          {activeTab === "Othermedications" && (
            <div className="table-responsive">
              <Othermedications />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
