import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Notifications from "./Notifications";
export default function NotificationsPageMain() {
  const [activeTab, setActiveTab] = useState("PatientNotificationsCards");
  const { t } = useTranslation();

  const tabs = [
   { key: "PatientNotificationsCards", label: t("Notifications") },
//    { key: "Settings", label: t("Notifications Settings") },

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
            className={`dc-tabscontent tab-content table-container-style  `}
            style={{  width: "80%", justifyContent: "center" }}
            >
              {activeTab === "PatientNotificationsCards" && <Notifications/>} 
          </div>
        </div>
      </div>
    </div>
  );
}
