import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LocationField from "./carts/LocationField";
import ShiftsManager from "../shift-settings/ShiftsManager";
import '../MainCss.css'

export default function LocationMain() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("AddLocation");

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className="dc-dashboardbox dc-dashboardtabsholder NewShado">
          <div className="dc-dashboardboxtitle">
            <h2>{t("locationSettings")}</h2>
          </div>
          <div className="divtoconvert">
          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs">
            <ul className="dc-tabstitle nav navbar-nav">
              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "AddLocation" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("AddLocation");
                  }}
                >
                  {t("addLocation")}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "shifts" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("shifts");
                  }}
                >
                  {t("locationAndWorkingHours")}
                </a>
              </li>
            </ul>
          </div>

          {/* Tabs Content */}
          <div className="dc-tabscontent tab-content">
            {activeTab === "AddLocation" && <LocationField />}
            {activeTab === "shifts" && <ShiftsManager />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
