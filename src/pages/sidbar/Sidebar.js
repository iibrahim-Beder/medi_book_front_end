import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PiClockUserThin } from "react-icons/pi";



// import icons 
import { SlCalender } from "react-icons/sl";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import { BsList } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { PiUsersThreeLight } from "react-icons/pi";
import { LiaUserCogSolid } from "react-icons/lia";
import { LiaUserShieldSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";

import InfomationIcon from "../../assets/icons/InfomationIcon";
import { 
  FaArrowLeft,
  FaClone,
  FaBars
} from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import './Sidebar.scss';
import { IoNotificationsOutline } from "react-icons/io5";


const Sidebar = () => {
  const stepCompleted = {
      personal: true,
      education: true,
      profile: true,
      location: true,
      shift: false,
      experience: true,
  };

  const canAccess = (requiredSteps = []) => {
    return requiredSteps.every((step) => stepCompleted[step]);
  };

    // 🔒 reusable props
  const getLinkProps = (steps) => ({
    className: !canAccess(steps) ? "disabled-link" : "",
    onClick: (e) => {
      if (!canAccess(steps)) e.preventDefault();
    },
  });

  
    ({...getLinkProps(["personal", "shift"])})?console.log("trueeeeeeeeee"):console.log("falseeeeeeeeee")
  
  console.log("canAccess",({...getLinkProps(["personal"])}));


  const [isCollapsed, setIsCollapsed] = useState(true);
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
let iconSize=20;

  const sidebarRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 75) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };   
    console.log("scrolled", + scrolled, "scrolled" + window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div ref={sidebarRef} id="dc-sidebarwrapper" className={` ${scrolled ? "scrolled-sidebar" : ""}  dc-sidebarwrapper ${isCollapsed ? "collapsed" : ""}`}>
      <div style={{position:"fixed"}} id="dc-btnmenutoggle" className="dc-btnmenutoggle" onClick={toggleSidebar}>
        {/* <FaArrowLeft className={`icon ${isCollapsed ? "rotate-180" : ""}`} /> */}
         <FaArrowLeft className={`icon desktop ${isCollapsed ? "rotate-180" : ""}`} />
        <FaBars className="icon mobile" />
      </div>
      <div id="dc-verticalscrollbar" className="dc-verticalscrollbar">
        {/* Profile Section */}
        <div className="dc-companysdetails dc-usersidebar">
          <figure className="dc-companysimg">
            <img src="/images/card-icon/img-01.jpg" alt="Profile" />
          </figure>
          <div className="dc-companysinfo">
            <figure>
              <img src="/images/avt/doctor-imge-avt.png" alt="Badge" />
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
          <ul onClick={()=>{setIsCollapsed(true)}} >
            <li>
              <Link to="/dashboard">
                <DashboardIcon width={iconSize} height={iconSize} className="icon" /> 
                <span>{t("sidebar.insights")}</span>
              </Link>
            </li>
            <li className="dc-notificationicon">
              <Link to="/appointments">
                <BsList className="icon" />
                <span>{t("sidebar.appointmentList")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-management">
                <CiSettings className="icon" />
                <span>{t("sidebar.appointmentManagement")}</span>
              </Link>
            </li>
            <li>
              <Link to="/appointment-location">
                <CiLocationOn className="icon" />
                <span>{t("Locations")}</span>
              </Link>
            </li>
            <li>
              <Link to="/Generate-Doctor-Slots">
                <PiClockUserThin className="icon" />
                <span>{t("sidebar.makeSlots")}</span>
              </Link>
            </li>
            <li>
              <Link to="/patients">
                <PiUsersThreeLight className="icon" />
                <span>{t("sidebar.managePatients")}</span>
              </Link>
            </li>
             <li>
              <Link to="/pationt-information">
                <InfomationIcon width={iconSize} height={iconSize} className="icon" />
                <span>{t("sidebar.pationtInformation")}</span>
              </Link>
            </li>
            <li>
              <Link to="Messages">
                <HiOutlineChatBubbleOvalLeft className="icon" />
                <span>{t("sidebar.messages")}</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-financial">
                <CiBadgeDollar className="icon" />
                <span>{t("sidebar.manageFinancial")}</span>
              </Link>
            </li>
            <li>
              <Link to="/account-settings">
                <LiaUserCogSolid className="icon" />
                <span>{t("sidebar.accountSettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/shifts-management" {...getLinkProps(["personal", "shift"])}>
                <SlCalender className="icon" />
                <span>{t("Shifts Management")}</span>
              </Link>
            </li>
            <li>
              <Link to="/security-settings">
                <LiaUserShieldSolid className="icon" />
                <span>{t("sidebar.securitySettings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <IoNotificationsOutline className="icon" />
                <span>{t("sidebar.notifications")}</span>
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