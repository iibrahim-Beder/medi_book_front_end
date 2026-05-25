import FileField from "./../../ui/form-fields/FileField";
import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import SectionTitle from "../../shared/SectionTitle";
import Field from "../../ui/form-fields/Field";
import { FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useStep1PersonalInfo } from "../hooks/useStep1BasicInfo";
import SelectField from "../../ui/form-fields/SelectField";
import ErrorLoading from "../../shared/ErrorLoading";
import Loader from "../../shared/Loader";

const Step1PersonalInfo = forwardRef(
  ({isNew, doctorId,  onChange = () => {}, forceShowError = true }, ref) => {
    const { t } = useTranslation();

    const {
      formData,
      errors,
      handleInputChange,
      handleSubmit,
      isLoading,
      error,
      refetch,
    } = useStep1PersonalInfo(isNew  , doctorId);

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    useEffect(() => {
      onChange(formData);
    }, [formData, onChange]);
   
     if (error) {
      return (
       <ErrorLoading error={error} refetch={refetch} />
      );
    }
    

    return (
      <>
        <SectionTitle icon={<FaRegUser />} title={t("personalInfo.title")} />

        <div className="table-card" style={{position: "relative"}}>
          {isLoading  && Loader("form-loader")}
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
              forceShowError={forceShowError}
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
              forceShowError={forceShowError}
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
              forceShowError={forceShowError}
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
                  ? "Male"
                  : formData.gender === 1
                    ? "Female"
                    : ""
              }
              onChange={handleInputChange}
              error={errors.gender}
              className="form-control"
              options={[
                { label: t("Male"), value: "Male" },
                { label: t("Female"), value: "Female" },
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
              forceShowError={forceShowError}
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
              <FileField
                label={t("Select your image")}
                name="licenseImage"
                accept="image/*"
                onChange={handleInputChange}
                hint={t("personalInfo.licenseImage.hint")}
                error={errors?.licenseImage}
                forceShowError={forceShowError}
              />
        </fieldset>
      </form>
        </div>
      </>
    );
  }
);

export default Step1PersonalInfo;
