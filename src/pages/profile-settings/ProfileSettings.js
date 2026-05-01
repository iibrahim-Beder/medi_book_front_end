// ProfileSettings.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PersonalDetails from "./Profile-card/PersonalDetails";
import Education from "./Profile-card/Education";
import Experience from "./Profile-card/Experience";
import Step3ProfessionalInfo from "../doctor-registration/steps/Step3ProfessionalInfo";

export default function ProfileSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const defaultTab = "DoctorBasicInfo";
  const activeTab = searchParams.get("tab") || defaultTab;

  const setActiveTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  const tabs = [
    { key: "DoctorBasicInfo", label: t("profileSettings.basicInfo") },
    { key: "ProfileAndSpecialties", label: t("profileSettings.specializations") },
    { key: "Education", label: t("profileSettings.education") },
    { key: "Experience", label: t("profileSettings.experience") },
  ];

  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace accordion-table">
        <div className="dc-dashboardbox dc-dashboardtabsholder setting">

          {/* Tabs */}
          <div className="dc-dashboardtabs" style={{ width: "20%" }}>
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`?tab=${tab.key}`}
                    className={activeTab === tab.key ? "active" : ""}
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

          {/* Content */}
          <div
            className="dc-tabscontent tab-content table-container-style"
            style={{ width: "80%", justifyContent: "center" }}
          >
            {activeTab === "DoctorBasicInfo" && <PersonalDetails />}

            {activeTab === "ProfileAndSpecialties" && (
              <Step3ProfessionalInfo insideUi={true} isNew={false} />
            )}

            {activeTab === "Education" && <Education />}

            {activeTab === "Experience" && <Experience />}
          </div>
        </div>
      </div>
    </div>
  );
}