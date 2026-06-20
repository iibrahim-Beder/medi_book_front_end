// src/components/.../UserMenu.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import "./styleNav.css";
import { useTranslation } from "react-i18next";

import { IoSunnyOutline, IoNotificationsOutline } from "react-icons/io5";
import { CiDark, CiSettings, CiLocationOn, CiLogout, CiBadgeDollar } from "react-icons/ci";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { SlCalender } from "react-icons/sl";
import { BsList, BsStar } from "react-icons/bs";
import { PiClockUserThin, PiUsersThreeLight } from "react-icons/pi";
import { LiaUserCogSolid, LiaUserShieldSolid } from "react-icons/lia";

import DashboardIcon from "../../assets/icons/DashboardIcon";

import { useTheme } from "../../context/ThemeContext";
import NotificationButton from "./Notifications/NotificationButton";
import { useStep1PersonalInfo } from "../doctor-registration/hooks/useStep1BasicInfo";

function UserMenu({ setShowPopupClose }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();

  const { formData, isLoading ,doctorImageSrc} = useStep1PersonalInfo(false);

  const toggleMenu = () => {
    if (window.innerWidth < 992) {
      setMenuOpen((prev) => !prev);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        style={{
          borderRadius: "50%",
          margin: "0px 8px 0px 15px",
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
          <img src={ doctorImageSrc} alt="doctorImage" />
        </figure>

        <div className="dc-username" onClick={toggleMenu}>
          <h4>Dr. {isLoading ? "Loading..." : formData.firstName || ""}</h4>
          <span>{t("userMenu.doctor")}</span>
        </div>

        <BsList className="icon after" onClick={toggleMenu} />

        <nav className="dc-usernav">
          <ul className={`User-sub-menu ${menuOpen ? "show" : ""}`}>
            <li>
              <Link to="/dashboard">
                <i>
                  <DashboardIcon width={20} height={20} className="icon" />
                </i>
                <span>{t("userMenu.insights")}</span>
              </Link>
            </li>

            <li>
              <Link to="/appointments">
                <i>
                  <SlCalender className="icon" />
                </i>
                <span>{t("userMenu.appointmentList")}</span>
              </Link>
            </li>

            <li>
              <Link to="/appointment-location">
                <i>
                  <CiLocationOn className="icon" />
                </i>
                <span>{t("userMenu.appointmentLocation")}</span>
              </Link>
            </li>

            <li>
              <Link to="/Generate-Doctor-Slots">
                <i>
                  <PiClockUserThin className="icon" />
                </i>
                <span>{t("sidebar.makeSlots")}</span>
              </Link>
            </li>

            <li>
              <Link to="/chat">
                <i>
                  <HiOutlineChatBubbleOvalLeft className="icon" />
                </i>
                <span>{t("Chats")}</span>
              </Link>
            </li>

            <li>
              <Link to="/manage-financial">
                <i>
                  <CiBadgeDollar className="icon" />
                </i>
                <span>{t("sidebar.manageFinancial")}</span>
              </Link>
            </li>

            <li>
              <Link to="/reviews">
                <i>
                  <BsStar className="icon" />
                </i>
                <span>{t("Reviews")}</span>
              </Link>
            </li>

            <li>
              <Link to="/patients">
                <i>
                  <PiUsersThreeLight className="icon" />
                </i>
                <span>{t("Patients")}</span>
              </Link>
            </li>

            <li>
              <Link to="/notifications">
                <i>
                  <IoNotificationsOutline className="icon" />
                </i>
                <span>{t("Notifications")}</span>
              </Link>
            </li>

            <li>
              <Link to="/account-information">
                <i>
                  <LiaUserCogSolid className="icon" />
                </i>
                <span>{t("Account Information")}</span>
              </Link>
            </li>

            <li>
              <Link to="/settings">
                <i>
                  <CiSettings className="icon" />
                </i>
                <span>{t("Settings")}</span>
              </Link>
            </li>

            <li onClick={() => setShowPopupClose(true)}>
              <Link>
                <i>
                  <CiLogout className="icon" />
                </i>
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