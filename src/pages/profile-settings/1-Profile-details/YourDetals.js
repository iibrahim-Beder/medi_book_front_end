import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import TextAreaField from "../../ui/form-fields/TextAreaField";

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
          <div className="form-group-half form-group">
            <Field
              label={t("yourDetails.firstName")}
              type="text"
              name="firstName"
              className="form-control"
              placeholder={t("yourDetails.firstName")}
            />
          </div>
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.lastName")}
              type="text"
              name="lastName"
              className="form-control"
              placeholder={t("yourDetails.lastName")}
            />
          </div>

          {/* Gender */}
          <div className="form-group-half form-group">
            <SelectField
              label={t("yourDetails.gender")}
              name="gender"
              className="form-control"
              placeholder={t("yourDetails.gender")} 
              options={[ "male", "female", "other"]}          
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.dob")}
              type="text"
              name="dob"
              className="form-control"
              placeholder={t("yourDetails.dob")}
            />
          </div>

          {/* Email & Phone */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.email")}
              type="text"
              name="email"
              className="form-control"
              placeholder={t("yourDetails.email")}
            />
          </div>
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.phone")}
              type="text"
              name="phone"
              className="form-control"
              placeholder={t("yourDetails.phone")}
            />
          </div>

          {/* License Number */}
          <div className="form-group">
            <Field
              label={t("yourDetails.license")}
              type="text"
              name="licenseNumber"
              className="form-control"
              placeholder={t("yourDetails.license")}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <TextAreaField
              label={t("yourDetails.description")}
              name="description"
              className="form-control"
              placeholder={t("yourDetails.description")}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Yourdetails;
