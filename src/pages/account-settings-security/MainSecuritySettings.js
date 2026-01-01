import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SecuritySettings from "./carts/SecuritySettings";
import PasswordSettings from "./carts/PasswordSettings";
import EmailNotifications from "./carts/EmailNotifications";
import DeleteAccount from "./carts/DeleteAccount";

export default function MainSecuritySettings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("SecuritySettings");

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className="dc-dashboardbox dc-dashboardtabsholder NewShado setting ">
          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs">
            <ul className="dc-tabstitle nav navbar-nav">
              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "SecuritySettings" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("SecuritySettings");
                  }}
                >
                  {t("securitySettings.securityTab")}
                </a>
              </li>

              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "PasswordSettings" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("PasswordSettings");
                  }}
                >
                  {t("securitySettings.passwordTab")}
                </a>
              </li>

              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "EmailNotifications" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("EmailNotifications");
                  }}
                >
                  {t("securitySettings.emailTab")}
                </a>
              </li>

              <li className="nav-item">
                <a
                  href="#dc-skills"
                  className={`${activeTab === "DeleteAccount" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("DeleteAccount");
                  }}
                >
                  {t("securitySettings.deleteTab")}
                </a>
              </li>
            </ul>
          </div>

          {/* Tabs Content */}
          <div className="dc-tabscontent tab-content ">
            {activeTab === "SecuritySettings" && <SecuritySettings />}
            {activeTab === "PasswordSettings" && <PasswordSettings />}
            {activeTab === "EmailNotifications" && <EmailNotifications />}
            {activeTab === "DeleteAccount" && <DeleteAccount />}
          </div>
        </div>
      </div>
    </div>
  );
}
