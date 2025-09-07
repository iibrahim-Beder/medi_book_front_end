import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChevronDown, FaCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next"; 
import UserMenu from "./UserMenu";
import "./styleNav.css";
import { IoSunnyOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { useTheme } from "../../context/ThemeContext";
import NotificationButton from "./NotificationButton";
function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();

  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      id="dc-header"
      className="dc-header dc-haslayout dc-header-dashboard"
      style={{ position: "fixed" }}
    >
      <div className="dc-navigationarea">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              {/* Logo */}
              <strong className="dc-logo">
                <Link to="/">
                  <img src="/images/d-logo.png" alt="user logo" />
                </Link>
              </strong>

              <div className="dc-rightarea">
                {/* Navigation */}
                <nav id="dc-nav" className="dc-nav navbar-expand-lg">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMobileMenu}
                  >
                    <FaBars size={22} />
                  </button>

                  <div
                    className={`collapse navbar-collapse dc-navigation ${
                      mobileMenuOpen ? "show" : ""
                    }`}
                  >
                    <ul className="navbar-nav nav-Js">
                      {/* Health Forum */}
                      <li
                        className={`menu-item-has-children ${
                          openMenu === "health" ? "active" : ""
                        }`}
                        onClick={() => {
                          if (window.innerWidth < 992) {
                            toggleDropdown("health");
                          }
                        }}
                      >
                        <a href="#" className="d-flex">
                          {t("navbar.healthForum")}{" "}
                          <FaChevronDown
                            className={`dropdown-icon ${
                              openMenu === "health" ? "rotate" : ""
                            }`}
                          />
                        </a>

                        <ul
                          className={`sub-menu ${
                            openMenu === "health" && window.innerWidth < 992
                              ? "show"
                              : ""
                          }`}
                        >
                          <li>
                            <Link to="/health-forum">
                              <FaCircle size={6} /> {t("navbar.healthForum")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/health-forum-answer">
                              <FaCircle size={6} /> {t("navbar.healthForumAnswer")}
                            </Link>
                          </li>
                        </ul>
                      </li>

                      {/* How It Works */}
                      <li
                        className={`menu-item-has-children ${
                          openMenu === "how" ? "active" : ""
                        }`}
                        onClick={() => {
                          if (window.innerWidth < 992) {
                            toggleDropdown("how");
                          }
                        }}
                      >
                        <a href="#" className="d-flex">
                          {t("navbar.howItWorks")}{" "}
                          <FaChevronDown
                            className={`dropdown-icon ${
                              openMenu === "how" ? "rotate" : ""
                            }`}
                          />
                        </a>

                        <ul
                          className={`sub-menu ${
                            openMenu === "how" && window.innerWidth < 992
                              ? "show"
                              : ""
                          }`}
                        >
                          <li>
                            <Link to="/how-v1">
                              <FaCircle size={6} /> {t("navbar.howItWorksV1")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/how-v2">
                              <FaCircle size={6} /> {t("navbar.howItWorksV2")}
                            </Link>
                          </li>
                        </ul>
                      </li>

                      {/* Pages */}
                      <li
                        className={`menu-item-has-children ${
                          openMenu === "pages" ? "active" : ""
                        }`}
                        onClick={() => {
                          if (window.innerWidth < 992) {
                            toggleDropdown("pages");
                          }
                        }}
                      >
                        <a href="#" className="d-flex">
                          {t("navbar.pages")}
                          <FaChevronDown
                            className={`dropdown-icon ${
                              openMenu === "pages" ? "rotate" : ""
                            }`}
                          />
                        </a>
                        <ul
                          className={`sub-menu ${
                            openMenu === "pages" && window.innerWidth < 992
                              ? "show"
                              : ""
                          }`}
                        >
                          <li>
                            <Link to="/home-v1">
                              <FaCircle size={6} /> {t("navbar.homeV1")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/home-v2">
                              <FaCircle size={6} /> {t("navbar.homeV2")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/articles">
                              <FaCircle size={6} /> {t("navbar.articles")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/about">
                              <FaCircle size={6} /> {t("navbar.about")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/contact">
                              <FaCircle size={6} /> {t("navbar.contact")}
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <button style={{ /*border: "1px solid var(--themecolor)",*/ borderRadius: "50%", display: "flex", fontSize:"large", color: "var(--terthemecolor)", background:"#F9F9F9" ,border:"1px solid #ddd" }} onClick={toggleDarkMode}>
                        {darkMode ? <CiDark color="var(--themecolor)" /> :  <IoSunnyOutline color="var(--themecolor)" />}
                      </button>
                         <NotificationButton/>

                    </ul>
                  </div>
                </nav>


                {/* User Menu */}
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
