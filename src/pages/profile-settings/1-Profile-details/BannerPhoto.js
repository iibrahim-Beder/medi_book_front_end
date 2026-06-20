import React from "react";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const BannerPhoto = () => {
  const { t } = useTranslation();

  return (
    <div className="dc-bannerphoto dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("bannerPhoto.title")}</h3>
      </div>
      <div className="dc-profilephotocontent">
        <form className="dc-formtheme dc-formprojectinfo dc-formcategory">
          <fieldset>
            <div className="form-group">
              <ul className="dc-attachfile dc-attachfilevtwo">
                <li className="dc-uploadingholder">
                  <div className="dc-uploadingbox">
                    <div className="dc-designimg">
                      <input
                        id="demoq"
                        type="radio"
                        name="employees"
                        value="company"
                        defaultChecked
                      />
                      <label htmlFor="demoq">
                        <img
                          src="/images/card-icon/img-01.jpg"
                          alt={t("bannerPhoto.alt")}
                        />
                        <i className="fa fa-check"></i>
                      </label>
                    </div>
                    <div className="dc-uploadingbar">
                      <span className="uploadprogressbar"></span>
                      <span>{t("bannerPhoto.fileName")}</span>
                      <em>
                        {t("bannerPhoto.fileSize")}{" "}
                        {/* <a href="#">
                          <FaTimes />
                        </a> */}
                      </em>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default BannerPhoto;
