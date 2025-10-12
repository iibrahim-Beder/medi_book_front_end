import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import PatientBasicInfo from "./PatientTabs/PatientBasicInfo";
import PatientNotes from "./PatientTabs/PatientNotes";
import AppointmentsTable from "./PatientTabs/AppointmentsTable";
import AllergyTable from "./PatientTabs/AllergyTable";
import MedicalHistoryTable from "./PatientTabs/MedicalHistoryTable";
import ConditionsTable from "./PatientTabs/ConditionsTable";
import DiseasesTable from "./PatientTabs/DiagnosisTable";
import PrescriptionsTable from "./PatientTabs/PrescriptionsTable";
import AllPrescribedMedication from "./PatientTabs/AllPrescribedMedication";
import MedicalConditions from "./PatientTabs/MedicalConditions";

export default function PatientProfilePageMain() {
  const [activeTab, setActiveTab] = useState("Medications");
  const { t } = useTranslation();
  
  let padding = activeTab === "Medications" || activeTab === "MedicalConditions";

  const tabs = [
   { key: "BasicInfo", label: t("BasicInfo") },
   { key: "Notifications", label: t("Notifications") },
   { key: "Appointments", label: t("Appointments") },
   { key: "Reviews", label: t("Reviews") },
   { key: "ConditionsTable", label: t("Medical History") },
   { key: "MedicalConditions", label: t("Medical Conditions") },
   { key: "Allergy", label: t("Allergies") },
   { key: "Diagnosis", label: t("Diagnosis") },
   { key: "Medications", label: t("Medications") },
   { key: "PrescriptionsTable", label: t("Prescriptions") },
   { key: "Notes", label: t("Notes") },
   { key: "Files", label: t("Files and Attachments") },
   { key: "PatientAdministrativeSettings", label: t("Patient Administrative Settings") },

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
            style={{ width: "80%", display: "flex", justifyContent: "center", padding:`${padding? "0" : "" }` }}
          >
            {activeTab === "BasicInfo" && <PatientBasicInfo />}
            {activeTab === "Appointments" && <AppointmentsTable />} 
            {activeTab === "Notes" && <PatientNotes />}
            {activeTab === "AllergyTable" && <AllergyTable/>}
            {activeTab === "MedicalHistory" && <MedicalHistoryTable />}
            {activeTab === "ConditionsTable" && <ConditionsTable />}
            {activeTab === "Allergy" && <AllergyTable/>}
            {activeTab === "Diagnosis" && <DiseasesTable/>}
            {activeTab === "PrescriptionsTable" && <PrescriptionsTable/>}
            {activeTab === "Medications" && <AllPrescribedMedication/>}
            {activeTab === "MedicalConditions" && <MedicalConditions/>}
          </div>
        </div>
      </div>
    </div>
  );
}
