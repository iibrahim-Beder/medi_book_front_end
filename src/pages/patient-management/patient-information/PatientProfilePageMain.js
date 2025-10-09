import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import PatientBasicInfo from "./PatientTabs/PatientBasicInfo";
import PatientNotes from "./PatientTabs/PatientNotes";
import AppointmentsTable from "./PatientTabs/AppointmentsTable";
import AllergyTable from "./PatientTabs/AllergyTable";
import MedicalHistoryTable from "./PatientTabs/MedicalHistoryTable";
import ConditionsTable from "./PatientTabs/ConditionsTable";
import AllAllergy from "./PatientTabs/AllAllergy";

export default function PatientProfilePageMain() {
  const [activeTab, setActiveTab] = useState("AllAllergy");
  const { t } = useTranslation();

  const tabs = [
   { key: "BasicInfo", label: t("BasicInfo") },
   { key: "Notifications", label: t("Notifications") },
   { key: "Appointments", label: t("Appointments") },
   { key: "ConditionsTable", label: t("Medical History") },
   { key: "AllAllergy", label: t("Allergies") },
   { key: "Diseases", label: t("Diseases") },
   { key: "Medications", label: t("Medications") },
   { key: "Prescriptions", label: t("Prescriptions") },
   { key: "Notes", label: t("Notes") },
   { key: "Files", label: t("Files and Attachments") },
   { key: "TreatmentPlans", label: t("TreatmentPlans") },
   { key: "PatientAdministrativeSettings", label: t("Patient Administrative Settings") },
  //  { key: "MedicalHistory", label: t("MedicalHistory") },
  //  { key: "Statistics", label: t("Statistics") },
  //  { key: "AllergyTable", label: t("Patient Allergy") },

  ];

  return (
    <div className="col-12">
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
            className="dc-tabscontent tab-content"
            style={{ width: "80%", display: "flex", justifyContent: "center", padding:`${activeTab=== "AllAllergy" ? "0" : "" }` }}
          >
            {activeTab === "BasicInfo" && <PatientBasicInfo />}
            {activeTab === "Appointments" && <AppointmentsTable />}
            {activeTab === "Notes" && <PatientNotes />}
            {activeTab === "AllergyTable" && <AllergyTable/>}
            {activeTab === "MedicalHistory" && <MedicalHistoryTable />}
            {activeTab === "ConditionsTable" && <ConditionsTable />}
            {activeTab === "AllAllergy" && <AllAllergy/>}
          </div>
        </div>
      </div>
    </div>
  );
}
