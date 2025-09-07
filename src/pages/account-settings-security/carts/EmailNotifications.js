import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";

export default function EmailNotifications({ onChange }) {
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    weeklyNewsletter: false,
    forwardMessages: false,
    bonusPromos: true,
    securityAlerts: true,
  });

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    if (typeof onChange === "function") onChange(updated);
  };

  return (
    <div className="dc-emailnotiholder" id="dc-emailnoti">
      <div className="dc-emailnoti">
        <div className="dc-tabscontenttitle">
          <h3>{t("emailNotifications.title")}</h3>
        </div>

        <div className="dc-settingscontent dc-sidepadding">
          <div className="dc-description">
            <p>{t("emailNotifications.description")}</p>
          </div>

          <form className="dc-formtheme dc-userform">
            <fieldset>
              <div className="form-group form-disabeld" style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  value="youremail@domainurl.com"
                  disabled
                />
                <FaLock
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                  }}
                />
              </div>
            </fieldset>
          </form>

          <ul className="dc-accountinfo">
            <li>
              <div className="dc-on-off">
                <input
                  type="checkbox"
                  id="weeklyNewsletter"
                  checked={settings.weeklyNewsletter}
                  onChange={() => handleToggle("weeklyNewsletter")}
                />
                <label htmlFor="weeklyNewsletter"><i></i></label>
              </div>
              <span>{t("emailNotifications.weeklyNewsletter")}</span>
            </li>

            <li>
              <div className="dc-on-off pull-right">
                <input
                  type="checkbox"
                  id="forwardMessages"
                  checked={settings.forwardMessages}
                  onChange={() => handleToggle("forwardMessages")}
                />
                <label htmlFor="forwardMessages"><i></i></label>
              </div>
              <span>{t("emailNotifications.forwardMessages")}</span>
            </li>

            <li>
              <div className="dc-on-off pull-right">
                <input
                  type="checkbox"
                  id="bonusPromos"
                  checked={settings.bonusPromos}
                  onChange={() => handleToggle("bonusPromos")}
                />
                <label htmlFor="bonusPromos"><i></i></label>
              </div>
              <span>{t("emailNotifications.bonusPromos")}</span>
            </li>

            <li>
              <div className="dc-on-off pull-right">
                <input
                  type="checkbox"
                  id="securityAlerts"
                  checked={settings.securityAlerts}
                  onChange={() => handleToggle("securityAlerts")}
                />
                <label htmlFor="securityAlerts"><i></i></label>
              </div>
              <span>{t("emailNotifications.securityAlerts")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
