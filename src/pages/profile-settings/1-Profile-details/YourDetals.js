import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";

const Yourdetails = () => {
  const { t } = useTranslation();

  return (
    <div className="dc-yourdetails dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("yourDetails.title")}</h3>
      </div>
      <form className="dc-formtheme dc-userform">
        <fieldset>
          {/* First & Last Name */}
          <div className="form-group form-group-half">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder={t("yourDetails.firstName")}
            />
          </div>
          <div className="form-group form-group-half">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder={t("yourDetails.lastName")}
            />
          </div>

          {/* Gender */}
          <div className="form-group form-group-half">
            <span className="dc-select">
              <div className="custom-select-wrapper">
                <select className="form-control Select1">
                  <option value="">{t("yourDetails.selectGender")}</option>
                  <option value="male">{t("yourDetails.male")}</option>
                  <option value="female">{t("yourDetails.female")}</option>
                </select>
                <span className="custom-arrow">
                  <FaChevronDown />
                </span>
              </div>
            </span>
          </div>

          {/* Date of Birth */}
          <div className="form-group form-group-half">
            <input
              type="text"
              name="dob"
              className="form-control"
              placeholder={t("yourDetails.dob")}
            />
          </div>

          {/* Email & Phone */}
          <div className="form-group form-group-half">
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder={t("yourDetails.email")}
            />
          </div>
          <div className="form-group form-group-half">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder={t("yourDetails.phone")}
            />
          </div>

          {/* License Number */}
          <div className="form-group">
            <input
              type="text"
              name="licenseNumber"
              className="form-control"
              placeholder={t("yourDetails.license")}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <textarea
              name="description"
              className="form-control"
              placeholder={t("yourDetails.description")}
            ></textarea>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Yourdetails;
