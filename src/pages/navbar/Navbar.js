import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import UserMenu from "./UserMenu";
import "./styleNav.css";
function Navbar({ setShowPopupClose }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

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
    >
      <div className="dc-navigationarea">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-0">
              {/* Logo */}
              <strong className="dc-logo">
                <Link to="/">
                  <img src="/images/newlogo.png" alt="user logo" />
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
                    className={`navbar-collapse dc-navigation collapse  ${
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
                          <HiOutlineChevronDown
                            className={`dropdown-icon ${
                              openMenu === "health" ? "rotate" : ""
                            }`}
                          />
                        </a>

                        <ul
                          className={`sub-menu ${
                            openMenu === "health" && window.innerWidth < 992
                              ? "expand"
                              : "hide"
                          }`}
                        >
                          <li>
                            <Link to="/health-forum">
                              {t("navbar.healthForum")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/health-forum-answer">
                              {t("navbar.healthForumAnswer")}
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
                          <HiOutlineChevronDown
                            className={`dropdown-icon ${
                              openMenu === "how" ? "rotate" : ""
                            }`}
                          />
                        </a>

                        <ul
                          className={`sub-menu ${
                            openMenu === "how" && window.innerWidth < 992
                              ? "expand"
                              : "hide"
                          }`}
                        >
                          <li>
                            <Link to="/how-v1">{t("navbar.howItWorksV1")}</Link>
                          </li>
                          <li>
                            <Link to="/how-v2">{t("navbar.howItWorksV2")}</Link>
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
                          <HiOutlineChevronDown
                            className={`dropdown-icon ${
                              openMenu === "pages" ? "rotate" : ""
                            }`}
                          />
                        </a>
                        <ul
                          className={`sub-menu ${
                            openMenu === "pages" && window.innerWidth < 992
                              ? "expand"
                              : "hide"
                          }`}
                        >
                          <li>
                            <Link to="/home-v1">{t("navbar.homeV1")}</Link>
                          </li>
                          <li>
                            <Link to="/home-v2">{t("navbar.homeV2")}</Link>
                          </li>
                          <li>
                            <Link to="/articles">{t("navbar.articles")}</Link>
                          </li>
                          <li>
                            <Link to="/about">{t("navbar.about")}</Link>
                          </li>
                          <li>
                            <Link to="/contact">{t("navbar.contact")}</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </nav>

                {/* User Menu */}
                <UserMenu setShowPopupClose={setShowPopupClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
