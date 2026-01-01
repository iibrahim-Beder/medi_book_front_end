// src/components/profile/ProfilePhoto.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProfilePhoto = () => {
  const { t } = useTranslation();

  return (
    <div className="dc-profilephoto dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("profilePhoto.title")}</h3>
      </div>
      <div className="dc-profilephotocontent">
        <div className="dc-description">
          <p>{t("profilePhoto.description")}</p>
        </div>
        <form className="dc-formtheme dc-formprojectinfo dc-formcategory">
          <fieldset>
            <div className="form-group form-group-label">
              <div className="dc-labelgroup">
                <label htmlFor="filep">
                  <span className="dc-btn">{t("profilePhoto.selectFiles")}</span>
                  <input type="file" name="file" id="filep" />
                </label>
                <span className="dc-uploadinfo">{t("profilePhoto.dropFiles")}</span>
                <em className="dc-fileuploading">
                  {t("profilePhoto.uploading")} <i className="fa fa-spinner fa-spin"></i>
                </em>
              </div>
            </div>
            <div className="form-group">
              <ul className="dc-attachfile dc-attachfilevtwo">
                <li className="dc-uploadingholder dc-companyimg-uploading">
                  <div className="dc-uploadingbox">
                    <figure>
                      <img src="images/company/img-07.jpg" alt="Profile" />
                    </figure>
                    <div className="dc-uploadingbar dc-uploading">
                      <span className="uploadprogressbar"></span>
                      <span>{t("profilePhoto.fileName")}</span>
                      <em>
                        {t("profilePhoto.fileSize")}{" "}
                        <a href="#">
                          <FaTimes />
                        </a>
                      </em>
                    </div>
                  </div>
                </li>

                <li className="dc-uploadingholder dc-companyimg-user">
                  <div className="dc-uploadingbox">
                    <figure>
                      <img src="images/company/img-08.jpg" alt="Profile" />
                    </figure>
                    <div className="dc-uploadingbar dc-uploading">
                      <span className="uploadprogressbar"></span>
                      <span>{t("profilePhoto.fileName")}</span>
                      <em>
                        {t("profilePhoto.fileSize")}{" "}
                        <a href="#">
                          <FaTimes />
                        </a>
                      </em>
                    </div>
                  </div>
                </li>

                <li className="dc-uploadingholder">
                  <div className="dc-uploadingbox">
                    <div className="dc-designimg">
                      <input
                        id="demoz"
                        type="radio"
                        name="employees"
                        value="company"
                        defaultChecked
                      />
                      <label htmlFor="demoz">
                        <img src="images/company/img-09.jpg" alt="Profile" />
                        <i className="fa fa-check"></i>
                      </label>
                    </div>
                    <div className="dc-uploadingbar dc-uploading">
                      <span className="uploadprogressbar"></span>
                      <span>{t("profilePhoto.fileName")}</span>
                      <em>
                        {t("profilePhoto.fileSize")}{" "}
                        <a href="#">
                          <FaTimes />
                        </a>
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

export default ProfilePhoto;
