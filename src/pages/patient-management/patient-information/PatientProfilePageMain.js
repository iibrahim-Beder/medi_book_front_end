import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import PatientBasicInfo from "./PatientTabs/PatientBasicInfo";
import PatientNotesComponent from "./PatientTabs/PatientNotes";
import AppointmentsTable from "./PatientTabs/AppointmentsTable";
import AllergyTable from "./PatientTabs/AllergyTable";
import ConditionsTable from "./PatientTabs/ConditionsTable";
import MedicalConditions from "./PatientTabs/medical-conditions/MedicalConditions";
import Medications from "./PatientTabs/Medications";
import PatientReviewsCards from "./PatientTabs/PatientReviewsCards";
import PatientNotificationsCards from "./PatientTabs/PatientNotificationsCards";
import DiagnosisTable from "./PatientTabs/dignosis/DiagnosisTable";
import Prescriptions from "./PatientTabs/prescriptions/prescriptions";
import { useDevice } from "../../../context/useIsMobile";
import AllergyMobileView from "./PatientTabs/AllergyMobileView";
import MedicalHistoryMobileView from "./PatientTabs/MedicalHistoryMobileView";

export default function PatientProfilePageMain() {
  const [activeTab, setActiveTab] = useState("BasicInfo");
  const { t } = useTranslation();
  const {isMobile} = useDevice();
  let padding = activeTab === "Medications" || activeTab === "MedicalConditions";

  const tabs = [
   { key: "BasicInfo", label: t("BasicInfo") },
   { key: "PatientNotificationsCards", label: t("Notifications") },
   { key: "Appointments", label: t("Appointments") },
   { key: "Reviews", label: t("Reviews") },
   { key: "ConditionsTable", label: t("Medical History") },
   { key: "MedicalConditions", label: t("Medical Conditions") },
   { key: "Allergy", label: t("Allergies") },
   { key: "Diagnosis", label: t("Diagnosis") },
   { key: "Medications", label: t("Medications") },
   { key: "PrescriptionsTable", label: t("Prescriptions") },
   { key: "PatientNotesComponent", label: t("Notes") },
   { key: "Files", label: t("Files and Attachments") },
   { key: "PatientAdministrativeSettings", label: t("Patient Administrative Settings") },

  ];

  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace accordion-table ">
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
            className={`dc-tabscontent tab-content table-container-style ${padding ? "tab-content-two-tabs" : ""} `}
            style={{  width: "80%", justifyContent: "center", paddingTop:`${padding? "0" : "" }` }}
          >
            {activeTab === "BasicInfo" && <PatientBasicInfo />}
            {activeTab === "Appointments" && <AppointmentsTable />} 
            {activeTab === "PatientNotesComponent" && <PatientNotesComponent />}
            {activeTab === "ConditionsTable" &&(isMobile ?<MedicalHistoryMobileView /> : <ConditionsTable />  )}
            {activeTab === "Allergy" && (isMobile ? <AllergyMobileView /> : <AllergyTable />)}
            {activeTab === "Diagnosis" && <DiagnosisTable/>}
            {activeTab === "PrescriptionsTable" && <Prescriptions/>}
            {activeTab === "Medications" && <Medications/>}
            {activeTab === "MedicalConditions" && <MedicalConditions/>}
            {activeTab === "Reviews" && <PatientReviewsCards/>}
            {activeTab === "PatientNotificationsCards" && <PatientNotificationsCards/>}
          </div>
        </div>
      </div>
    </div>
  );
}
