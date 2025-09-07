import { useState } from "react";
import { Link } from "react-router-dom";
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
                <FaTachometerAlt className="icon" />
                <span>{t("sidebar.insights")}</span>
              </Link>
            </li>
            <li className="dc-notificationicon">
              <Link to="/appointment-list">
                <FaListAlt className="icon" />
                <span>{t("sidebar.appointmentList")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-setting">
                <FaCog className="icon" />
                <span>{t("sidebar.appointmentSetting")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-location">
                <FaMapMarkerAlt className="icon" />
                <span>{t("sidebar.appointmentLocation")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-services">
                <FaShoppingCart className="icon" />
                <span>{t("sidebar.manageServices")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-team">
                <FaUser className="icon" />
                <span>{t("sidebar.manageTeam")}</span>
              </Link>
            </li>
            <li>
              <Link to="Messages">
                <FaEnvelope className="icon" />
                <span>{t("sidebar.messages")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-articles">
                <FaBookmark className="icon" />
                <span>{t("sidebar.manageArticles")}</span>
              </Link>
            </li>
            <li>
              <Link to="/account-settings">
                <FaCog className="icon" />
                <span>{t("sidebar.accountSettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/security-settings">
                <FaShieldAlt className="icon" />
                <span>{t("sidebar.securitySettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <FaSignOutAlt className="icon" />
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
