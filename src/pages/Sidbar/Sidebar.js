import { useState } from "react";
import { Link } from "react-router-dom";



// import icons 
import DashboardIcon from "../../assets/icons/DashboardIcon";
import { RiFileList3Line } from "react-icons/ri";
import { LiaTachometerAltSolid } from "react-icons/lia";
import { BsList } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { PiShoppingCartLight } from "react-icons/pi";
import { PiUsersThreeLight } from "react-icons/pi";
import { LiaFacebookMessenger } from "react-icons/lia";
import { LiaUserCogSolid } from "react-icons/lia";
import { LiaUserShieldSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";

import InfomationIcon from "../../assets/icons/InfomationIcon";
import { 
  FaTachometerAlt,
  FaListAlt,
  FaCog,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUser,
  FaEnvelope,
  FaBookmark,
  FaShieldAlt,  
  FaSignOutAlt,
  FaArrowLeft,
  FaClone
} from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import './Sidebar.scss';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
let iconSize=20;
  return (
    <div id="dc-sidebarwrapper" className={`dc-sidebarwrapper ${isCollapsed ? "collapsed" : ""}`}>
      <div style={{position:"fixed"}} id="dc-btnmenutoggle" className="dc-btnmenutoggle" onClick={toggleSidebar}>
        <FaArrowLeft className={`icon ${isCollapsed ? "rotate-180" : ""}`} />
      </div>
      <div id="dc-verticalscrollbar" className="dc-verticalscrollbar">
        {/* Profile Section */}
        <div className="dc-companysdetails dc-usersidebar">
          <figure className="dc-companysimg">
            <img src="/images/sidebar/img-01.jpg" alt="Profile" />
          </figure>
          <div className="dc-companysinfo">
            <figure>
              <img src="/images/sidebar/img-02.jpg" alt="Badge" />
            </figure>
            <div className="dc-title">
              <h2>
                <Link to="#">Dr. Michael Mattioli</Link>
              </h2>
              <span>@michael20769 <FaClone className="clone-icon" /></span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav id="dc-navdashboard" className="dc-navdashboard">
          <ul>
            <li>
              <Link to="/dashboard">
{/* <<<<<<< HEAD
                <LiaTachometerAltSolid className="icon" />
=======
               {/* <MyIcon   fill="red" /> */}
                {/* <DashboardIcon width={iconSize} height={iconSize} className="icon" /> */} 
{/* >>>>>>> patient-management-ui */}
                <span>{t("sidebar.insights")}</span>
              </Link>
            </li>
            <li className="dc-notificationicon">
              <Link to="/appointment-list">
                <BsList className="icon" />
                <span>{t("sidebar.appointmentList")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-setting">
                <CiSettings className="icon" />
                <span>{t("sidebar.appointmentSetting")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-location">
                <CiLocationOn className="icon" />
                <span>{t("sidebar.appointmentLocation")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-services">
                <PiShoppingCartLight className="icon" />
                <span>{t("sidebar.manageServices")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-team">
                <PiUsersThreeLight className="icon" />
{/* <<<<<<< HEAD
=======
                <span>{t("sidebar.manageTeam")}</span>
              </Link>
            </li>
             <li>
              <Link to="/pationt-information">
                <InfomationIcon width={iconSize} height={iconSize} className="icon" />
>>>>>>> patient-management-ui */}
                <span>{t("sidebar.manageTeam")}</span>
              </Link>
            </li>
            <li>
              <Link to="Messages">
                <LiaFacebookMessenger className="icon" />
                <span>{t("sidebar.messages")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-articles">
                <CiBadgeDollar className="icon" />
                <span>{t("sidebar.manageArticles")}</span>
              </Link>
            </li>
            <li>
              <Link to="/account-settings">
                <LiaUserCogSolid className="icon" />
                <span>{t("sidebar.accountSettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/security-settings">
                <LiaUserShieldSolid className="icon" />
                <span>{t("sidebar.securitySettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <CiLogout className="icon" />
                <span>{t("sidebar.logout")}</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="dc-navdashboard-footer">
          <span>
            <Link to="#">DocListeo.</Link> © {new Date().getFullYear()} {t("sidebar.allRightsReserved")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;