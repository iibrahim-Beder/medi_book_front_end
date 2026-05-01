import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import PersonalDetails from "./Profile-card/PersonalDetails";
import ExperienceEducation from "./Profile-card/Education";
import Experience from "./Profile-card/Experience";
import Step3ProfessionalInfo from "../doctor-registration/steps/Step3ProfessionalInfo";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("DoctorBasicInfo");
  const { t } = useTranslation();

  return (
    
    // <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-9">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className="dc-dashboardbox dc-dashboardtabsholder NewShado">
          {/* <div className="dc-dashboardboxtitle">
            <h2>{t("profileSettings.title")}</h2>
          </div> */}
               <div className="divtoconvert">
          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs">
            <ul className="dc-tabstitle nav navbar-nav">
              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "DoctorBasicInfo" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("DoctorBasicInfo");
                  }}
                >
                  {t("profileSettings.basicInfo")}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "ProfileAndSpecialties" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("ProfileAndSpecialties");
                  }}
                >
                  {t("profileSettings.specializations")}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#dc-education"
                  className={`${activeTab === "Education" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("Education");
                  }}
                >
                  {t("profileSettings.education")}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#dc-awards"
                  className={`${activeTab === "Experience" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("Experience");
                  }}
                >
                  {t("profileSettings.experience")}
                </a>
              </li>
            </ul>
          </div>

          {/* Tabs Content */}
          <div className="dc-tabscontent tab-content">
            {activeTab === "DoctorBasicInfo" && <PersonalDetails />}
            {activeTab === "Education" && <ExperienceEducation />}
            {activeTab === "ProfileAndSpecialties" && <Step3ProfessionalInfo insideUi={true} isNew={false} />}
            {activeTab === "Experience" && <Experience />}
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
