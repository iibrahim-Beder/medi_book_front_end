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
    { key: "BasicInfo", label: " Patient basic info"},
    { key: "Appointments", label: "Appointments"},
    { key: "Notes", label: "Nots"},
    // { key: "Files", label: "📎 الملفات والمرفقات", icon: <FaPaperclip /> },
    { key: "TreatmentPlans", label: "Allergies", icon: <FaFileAlt /> },
    { key: "Notifications", label:"Notifications", icon: <FaBell /> },
    { key: "MedicalHistory", label: "Medical History", icon: <FaCog /> },
    // { key: "Statistics", label: "📊 الإحصائيات", icon: <FaChartPie /> },
  ];

  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className="dc-dashboardbox dc-dashboardtabsholder ">
          <div className="dc-dashboardboxtitle">
            <h2>patient profil information </h2>
          </div>

          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs" style={{width:"20%"}}>
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`#${tab.key}`}
         PatientNotes           className={`${activeTab === tab.key ? "active" : ""}`}
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
          <div className="dc-tabscontent tab-content" style={{width:"80%"}}>
            {activeTab === "BasicInfo" && <PatientBasicInfo />}
            {activeTab === "Appointments" && <AppointmentsTable />}
          {activeTab === "Notes" && <PatientNotes />}
              {/* {activeTab === "Files" && <PatientFiles />}
            {activeTab === "TreatmentPlans" && <PatientTreatmentPlans />}
            {activeTab === "Settings" && <PatientSettings />}
            {activeTab === "Statistics" && <PatientStatistics />} */}
            {activeTab === "Notifications" && <AppointmentsTable2 />}
            {activeTab === "MedicalHistory" && <MedicalHistoryTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
