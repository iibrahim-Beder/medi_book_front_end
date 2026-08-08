import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PiClockUserThin } from "react-icons/pi";
import { useSelector } from "react-redux";
import { ProgressSide } from "../dashbord/DashboardUnCompleteRegistration";
import './Sidebar.scss';



// import icons 
import { SlCalender } from "react-icons/sl";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import { BsList, BsStar } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { PiUsersThreeLight } from "react-icons/pi";
import { LiaUserCogSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";

import InfomationIcon from "../../assets/icons/InfomationIcon";
import { 
  FaArrowLeft,
  FaClone,
  FaBars
} from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDoctorRegistration } from "../doctor-registration/hooks/useDoctorRegistration";
import { useStep1PersonalInfo } from "../doctor-registration/hooks/useStep1BasicInfo";


const Sidebar = ({setOpenStepRegister,setShowPopupClose}) => {
const {stepCompleted}=useDoctorRegistration();
    const {
      formData,
      isLoading,
      doctorImageSrc
    } = useStep1PersonalInfo(false);
      const email = useSelector((state) => state.auth.email);
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const menuItems = [
  {
    to: "/dashboard",
    label: t("sidebar.insights"),
    icon: <DashboardIcon width={iconSize} height={iconSize} className="icon" />,
  },
  {
    to: "/time-slots",
    label: t("sidebar.appointmentList"),
    icon: <BsList className="icon" />,
    access: ["Shifts"],
    className: "dc-notificationicon",
  },
  {
    to: "/appointment-location",
    label: t("Locations"),
    icon: <CiLocationOn className="icon" />,
    access: ["Locations"],
  },
  {
    to: "/Generate-Doctor-Slots",
    label: t("sidebar.makeSlots"),
    icon: <PiClockUserThin className="icon" />,
    access: ["Shifts"],
  },
  {
    to: "/patients",
    label: t("sidebar.managePatients"),
    icon: <PiUsersThreeLight className="icon" />,
    access: ["All"],
  },
  {
    to: "/chat",
    label: t("sidebar.messages"),
    icon: <HiOutlineChatBubbleOvalLeft className="icon" />,
    access: ["All"],
  },
  {
    to: "/manage-financial",
    label: t("sidebar.manageFinancial"),
    icon: <CiBadgeDollar className="icon" />,
    access: ["All"],
  },
  {
    to: "/reviews",
    label: t("Reviews"),
    icon: <BsStar className="icon" />,
    access: ["All"],
  },
  {
    to: "/account-information",
    label: t("Account Information"),
    icon: <LiaUserCogSolid className="icon" />,
    access: ["Experience"],
  },
  {
    to: "/shifts-management",
    label: t("Shifts Management"),
    icon: <SlCalender className="icon" />,
    access: ["Shifts"],
  },
  {
    to: "/settings",
    label: t("Settings"),
    icon: <CiSettings className="icon" />,
  },
  {
    to: "/notifications",
    label: t("Notifications"),
    icon: <IoNotificationsOutline className="icon" />,
  },
];
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
              <img src={doctorImageSrc} style={{minHeight:"90px"}} alt="Profile" onError={(e) => (e.target.src = "/images/avt/doctor-imge-avt.png")} />
            </figure>
            <div className="dc-title">
              <h2>
                <Link to="#">Dr. {isLoading ? "Loading..." : formData.firstName || ""}</Link>
              </h2>
              <span>{email} <FaClone className="clone-icon" /></span>
              {/* <a>@michael20769 <FaClone className="clone-icon" /></a> */}
              {!stepCompleted.All && <ProgressSide setOpenStepRegister={setOpenStepRegister}/>}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav id="dc-navdashboard" className="dc-navdashboard">
       <ul onClick={() => setIsCollapsed(true)}>
  {menuItems.map(
    ({
      to,
      label,
      icon,
      access = [],
      className = "",
    }) => (
      <li key={to} className={className}>
        <Link to={to} {...getLinkProps(access)}>
          {icon}
          <span>{label}</span>
        </Link>
      </li>
    )
  )}

  <li onClick={() => setShowPopupClose(true)}>
    <Link>
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