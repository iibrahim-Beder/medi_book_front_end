import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MakeSlotsMain from "../../pages/making-slots/MakeSlostMain";


export default function ShaftTabs() {
  const [activeTab, setActiveTab] = useState("morning");
  const { t } = useTranslation();

  const tabs = [
    { key: "morning", label: t("Morning shift") ,time:"8:00 - 12:00"},
    { key: "evening", label: t("Evening shift") ,time:"12:00 - 16:00"},
    { key: "night", label: t("Night shift") ,time:"16:00 - 20:00"},
  ];

  return (
    <div className="col-12 p-0 two-tabs">
        <div>
      <div className="div-container-tabs shift">
        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill two-tabs-nav-container">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <a style={{display: "flex",flexDirection: "column"}}
                href={`#${tab.key}`}
                className={` nav-link ${activeTab === tab.key ? "active" : ""}`}
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
      </div>
      <div className="card m-0 border-0" style={{ boxShadow: "none" }}>
        <MakeSlotsMain/>
      </div>
    </div>
  );
}