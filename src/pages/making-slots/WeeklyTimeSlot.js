  import React, { useState } from "react";
  import { useTranslation } from "react-i18next";
  import ShaftTabs from "./ShaftTabs";

  export default function WeeklyTimeSlots() {
    const [activeTab, setActiveTab] = useState("Sunday");
    const { t } = useTranslation();

  const tabs = [
    { key: "Sunday", label: t("Sunday") },
    { key: "Monday", label: t("Monday") },
    { key: "Tuesday", label: t("Tuesday") },
    { key: "Wednesday", label: t("Wednesday") },
    { key: "Thursday", label: t("Thursday") },
    { key: "Friday", label: t("Friday") },
    { key: "Saturday", label: t("Saturday") },
  ];


    return (
      <div className="col-12">
        <div className="dc-haslayout dc-dbsectionspace accordion-table ">
          <div className="dc-dashboardbox dc-dashboardtabsholder setting">
            {/* Tabs Navigation */}
            <div className="dc-dashboardtabs" style={{ width: "20%" }}>
              {/* <div className="tab-titil" style={{ height: "94px",borderBottom: "1px solid #ddd" }} >
                Make Slots
              </div> */}
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
              className={`p-0 dc-tabscontent tab-content table-container-style  tab-content-two-tabs `}
              style={{ width: "80%", justifyContent: "center" }}
            >
            <div>
            <h3 style={{width: "fit-content", margin:" 20px 0 0 40px"}} className="table-title">Slots Saturday</h3>
          </div>
              <ShaftTabs/>
            </div>
          </div>
        </div>
      </div>
    );
  }
