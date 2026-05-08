import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import { useStep1PersonalInfo } from "../../doctor-registration/hooks/useStep1BasicInfo";
import Loader from "../../shared/Loader";

const Yourdetails = ({ isNew = false }) => {
  const { t } = useTranslation();

  const { formData, errors, isLoading, handleInputChange, handleSubmit } =useStep1PersonalInfo(isNew);

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) {
      console.log("Saved successfully");
    }
  };

  return (
    <div className="dc-yourdetails dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("yourDetails.title")}</h3>
      </div>

      <form className="dc-formtheme dc-userform">
        <fieldset>
          {isLoading && Loader("form-loader")}

          {/* First Name */}
          <div className="form-group-half form-group">
            <Field
              label={t("yourDetails.firstName")}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              className="form-control"
              placeholder={t("yourDetails.firstName")}
            />
          </div>

          {/* Last Name */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.lastName")}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              className="form-control"
              placeholder={t("yourDetails.lastName")}
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.dob")}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              error={errors.dateOfBirth}
              className="form-control"
            />
          </div>

          {/* Gender */}
          <div className="form-group-half form-group">
            <SelectField
              label={t("yourDetails.gender")}
              name="gender"
              value={
                formData.gender === 0
                  ? "male"
                  : formData.gender === 1
                    ? "female"
                    : ""
              }
              onChange={handleInputChange}
              error={errors.gender}
              className="form-control"
              options={[
                { label: t("male"), value: "male" },
                { label: t("female"), value: "female" },
              ]}
            />
          </div>

          {/* License Number */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.license")}
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              error={errors.licenseNumber}
              className="form-control"
              placeholder={t("yourDetails.license")}
            />
          </div>

          {/* Phone Number */}
          <div className="form-group form-group-half">
            <Field
              label={t("yourDetails.phone")}
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              className="form-control"
              placeholder={t("yourDetails.phone")}
            />
          </div>
        </fieldset>

          <button
            style={{ float: "inline-end" }}
            type="button"
            className="second-btn mt-3"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("save")}
          </button>
      </form>
    </div>
  );
};

export default Yourdetails;
