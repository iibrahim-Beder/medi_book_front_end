import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function SecuritySettings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const lang = e.target.value;
    if (lang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div className="dc-securityhold tab-pane active fade show" id="dc-security">
      {/* Account Security & Settings */}
      <div className="dc-securitysettings dc-tabsinfo">
        <div className="dc-tabscontenttitle">
          <h3>{t("accountSecurity.title")}</h3>
        </div>``
        <div className="dc-settingscontent dc-sidepadding">
          <div className="dc-description">
            <p>{t("accountSecurity.description")}</p>
          </div>
          <ul className="dc-accountinfo">
            <li>
              <div className="dc-on-off">
                <input type="checkbox" id="hide-on" />
                <label htmlFor="hide-on">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.publicProfile")}</span>
            </li>
            <li>
              <div className="dc-on-off pull-right">
                <input type="checkbox" id="hide-onone" />
                <label htmlFor="hide-onone">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.searchableProfile")}</span>
            </li>
            <li>
              <div className="dc-on-off pull-right">
                <input type="checkbox" id="hide-onthree" defaultChecked />
                <label htmlFor="hide-onthree">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.sharePhoto")}</span>
            </li>
            <li>
              <div className="dc-on-off pull-right">
                <input type="checkbox" id="hide-onfour" defaultChecked />
                <label htmlFor="hide-onfour">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.disableAccount")}</span>
            </li>
            <li>
              <div className="dc-on-off pull-right">
                <input type="checkbox" id="hide-onfive" />
                <label htmlFor="hide-onfive">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.showFeedback")}</span>
            </li>
            <li>
              <div className="dc-on-off pull-right">
                <input type="checkbox" id="hide-onsix" />
                <label htmlFor="hide-onsix">
                  <i></i>
                </label>
              </div>
              <span>{t("accountSecurity.enableDisable")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Language & Currency */}
      <div className="dc-location dc-tabsinfo">
        <div className="dc-tabscontenttitle">
          <h3>{t("languageCurrency.title")}</h3>
        </div>
        <form className="dc-formtheme dc-userform">
          <fieldset>
            <div className="form-group form-group-half">
              <span className="dc-select">
                <select value={i18n.language} onChange={handleChange}>
                  <option value="">{t("languageCurrency.selectLanguage")}</option>
                  <option value="en">{t("languageCurrency.english")}</option>
                  <option value="ar">{t("languageCurrency.arabic")}</option>
                </select>
              </span>
            </div>
            <div className="form-group form-group-half">
              <span className="dc-select">
                <select>
                  <option value="">{t("languageCurrency.selectCurrency")}</option>
                  <option value="">{t("languageCurrency.real")}</option>
                  <option value="">{t("languageCurrency.usd")}</option>
                  <option value="">{t("languageCurrency.yuan")}</option>
                  <option value="">{t("languageCurrency.peso")}</option>
                  <option value="">{t("languageCurrency.euro")}</option>
                  <option value="">{t("languageCurrency.hkd")}</option>
                </select>
              </span>
            </div>
          </fieldset>
        </form>
      </div>

      {/* Dashboard Color Settings */}
      <div className="dc-tabcompanyinfo">
        <div className="dc-tabscontenttitle">
          <h3>{t("dashboardColor.title")}</h3>
        </div>
        <div className="dc-settingscontent dc-sidepadding">
          <div className="dc-description">
            <p>{t("dashboardColor.description")}</p>
          </div>
          <ul className="dc-accountinfo">
            <li>
              <div className="dc-on-off">
                <input
                  type="checkbox"
                  id="dashboard-darkmode"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <label htmlFor="dashboard-darkmode">
                  <i></i>
                </label>
              </div>
              <span>{t("dashboardColor.useDarkMode")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
