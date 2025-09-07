import { useState } from "react";
import { Link } from "react-router-dom";
import "./styleNav.css";
import { useTranslation } from "react-i18next";

function UserMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    if (window.innerWidth < 992) {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div
      className="dc-userlogedin"
      onMouseEnter={() => {
        if (window.innerWidth >= 992) setMenuOpen(true);
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 992) setMenuOpen(false);
      }}
    >
      <figure className="dc-userimg">
        <img src="/images/user-login.jpg" alt="user" />
      </figure>

      <div className="dc-username" onClick={toggleMenu}>
        <h4>Dr. Micheal</h4>
        <span>{t("userMenu.doctor")}</span>
      </div>
      <i className="after fas fa-angle-down" onClick={toggleMenu}></i>

      <nav className="dc-usernav">
        <ul className={`User-sub-menu ${menuOpen ? "show" : ""}`}>
          <li>
            <Link to="/dashboard-insights">
              <i className="ti-dashboard"></i>
              <span>{t("userMenu.insights")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-appointmentlist">
              <i className="ti-align-justify"></i>
              <span>{t("userMenu.appointmentList")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-appointmentsetting">
              <i className="ti-settings"></i>
              <span>{t("userMenu.appointmentSetting")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-appointmentlocation">
              <i className="ti-location-arrow"></i>
              <span>{t("userMenu.appointmentLocation")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-manageservices">
              <i className="ti-shopping-cart"></i>
              <span>{t("userMenu.manageServices")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-manageteam">
              <i className="ti-user"></i>
              <span>{t("userMenu.manageTeam")}</span>
            </Link>
          </li>
          <li className="menu-item-has-children">
            <Link to="/dashboard-messages">
              <i className="ti-email"></i>
              <span>{t("userMenu.messages")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/messages/inbox">{t("userMenu.inbox")}</Link>
              </li>
              <li>
                <Link to="/messages/send">{t("userMenu.send")}</Link>
              </li>
              <li>
                <Link to="/messages/trash">{t("userMenu.trash")}</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/dashboard-managearticle">
              <i className="ti-bookmark"></i>
              <span>{t("userMenu.manageArticles")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-accountsettings">
              <i className="ti-settings"></i>
              <span>{t("userMenu.accountSettings")}</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-securitysettings">
              <i className="ti-shield"></i>
              <span>{t("userMenu.securitySettings")}</span>
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <i className="ti-shift-right"></i>
              <span>{t("userMenu.logout")}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default UserMenu;
