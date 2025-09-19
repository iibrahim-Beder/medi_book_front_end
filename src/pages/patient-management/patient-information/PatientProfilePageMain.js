import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFileAlt, FaCalendarAlt, FaNotesMedical, FaPaperclip, FaBell, FaCog, FaChartPie, FaUser } from "react-icons/fa";

import PatientBasicInfo from "./PatientTabs/PatientBasicInfo";
// import PatientAppointments from "./PatientTabs/PatientAppointments";
import PatientNotes from "./PatientTabs/PatientNotes";
import AppointmentsTable from "./PatientTabs/AppointmentsTable";
import AppointmentsTable2 from "./PatientTabs/AppointmentsTable2";
// import PatientFiles from "./PatientTabs/PatientFiles";
// import PatientTreatmentPlans from "./PatientTabs/PatientTreatmentPlans";
// import PatientNotifications from "./PatientTabs/PatientNotifications";
// import PatientSettings from "./PatientTabs/PatientSettings";
// import PatientStatistics from "./PatientTabs/PatientStatistics";
import PatientStatistics from "./PatientTabs/MedicalHistoryTable";
import MedicalHistoryTable from "./PatientTabs/MedicalHistoryTable";

export default function PatientProfilePageMain() {
  const [activeTab, setActiveTab] = useState("BasicInfo");
  const { t } = useTranslation();

  const tabs = [
   { key: "BasicInfo", label: t("BasicInfo") },
{ key: "Appointments", label: t("Appointments") },
{ key: "Notes", label: t("Notes") },
// { key: "Files", label: t("Files"), icon: <FaPaperclip /> },
{ key: "TreatmentPlans", label: t("TreatmentPlans") },
{ key: "Notifications", label: t("Notifications") },
{ key: "MedicalHistory", label: t("MedicalHistory") },
{ key: "Statistics", label: t("Statistics") },

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
            style={{ width: "80%", display: "flex", justifyContent: "center" }}
          >
            {activeTab === "BasicInfo" && <PatientBasicInfo />}
            {activeTab === "Appointments" && <AppointmentsTable2 />}
            {activeTab === "Notes" && <PatientNotes />}
            {/* {activeTab === "Files" && <PatientFiles />}
            {activeTab === "TreatmentPlans" && <PatientTreatmentPlans />}
            {activeTab === "Settings" && <PatientSettings />}
            {activeTab === "Statistics" && <PatientStatistics />} */}
            {activeTab === "Notifications" && <AppointmentsTable />}
            {activeTab === "MedicalHistory" && <MedicalHistoryTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
