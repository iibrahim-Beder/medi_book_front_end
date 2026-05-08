import { useState } from "react";
import { Link } from "react-router-dom";
import "./styleNav.css";
import { useTranslation } from "react-i18next";
import { IoSunnyOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { useTheme } from "../../context/ThemeContext";
import NotificationButton from "./Notifications/NotificationButton";
import { useStep1PersonalInfo } from "../doctor-registration/hooks/useStep1BasicInfo";
function UserMenu({setShowPopupClose}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    if (window.innerWidth < 992) {
      setMenuOpen(!menuOpen);
    }
    console.log( "menuOpen", menuOpen);
  };
  const { darkMode, toggleDarkMode } = useTheme();

      const {
      formData,
      isLoading,
    } = useStep1PersonalInfo(false);
  return (

      <div style={{display:"flex",  alignItems:"center" }}>   
       <button
          style={{
            /*border: "1px solid var(--themecolor)",*/ borderRadius: "50%",
            margin:"0px 8px 0px 15px",
            display: "flex",
            fontSize: "large",
            color: "var(--terthemecolor)",
            background: "#F9F9F9",
            border: "1px solid #ddd",
          }}
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <CiDark color="var(--themecolor)" />
          ) : (
            <IoSunnyOutline color="var(--themecolor)" />
          )}
        </button>
        
        <NotificationButton />

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
        <img src="/images/avt/doctor-imge-avt.png" alt="user" />
      </figure>

      <div className="dc-username" onClick={toggleMenu}>
        <h4>Dr. {isLoading ? "Loading..." : formData.firstName || "doctor"}</h4>
        <span>{t("userMenu.doctor")}</span>
      </div>
      <i className="after fas fa-angle-down" onClick={toggleMenu}></i>

      <nav className="dc-usernav">
        <ul className={`User-sub-menu ${menuOpen ? "show" : ""}`}>
          <li>
            <Link to="/dashboard">
              <i className="ti-dashboard"></i>
              <span>{t("userMenu.insights")}</span>
            </Link>
          </li>
          <li>
            <Link to="/appointments">
              <i className="ti-align-justify"></i>
              <span>{t("userMenu.appointmentList")}</span>
            </Link>
          </li>
          {/* <li>
            <Link to="/dashboard-appointmentsetting">
              <i className="ti-settings"></i>
              <span>{t("userMenu.appointmentSetting")}</span>
            </Link>
          </li> */}
          <li>
            <Link to="/appointment-location">
              <i className="ti-location-arrow"></i>
              <span>{t("userMenu.appointmentLocation")}</span>
            </Link>
          </li>
          <li>
            <Link to="/Generate-Doctor-Slots">
              <i className="ti-shopping-cart"></i>
              <span>{t("sidebar.makeSlots")}</span>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <i className="ti-shopping-cart"></i>
              <span>{t("chats")}</span>
            </Link>
          </li>
          <li>
            <Link to="/manage-financial">
              <i className="ti-bookmark"></i>
              <span>{t("sidebar.manageFinancial")}</span>
            </Link>
          </li>
          <li>
            <Link to="/account-settings">
              <i className="ti-settings"></i>
              <span>{t("userMenu.accountSettings")}</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="ti-shield"></i>
              <span>{t("Settings")}</span>
            </Link>
          </li>
          <li onClick={() => setShowPopupClose(true)}>
            <Link>
              <i className="ti-shift-right"></i>
              <span>{t("userMenu.logout")}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    </div>
  );
}

export default UserMenu;
