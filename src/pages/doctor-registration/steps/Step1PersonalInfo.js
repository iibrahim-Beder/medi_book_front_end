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
          <div className="form-grid">
            <Field
              label={t("personalInfo.firstName.label")}
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t("personalInfo.firstName.placeholder")}
              icon={<FaRegUser />}
              error={errors?.firstName}
              forceShowError={forceShowError}
            />

            <Field
              label={t("personalInfo.lastName.label")}
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t("personalInfo.lastName.placeholder")}
              icon={<FaRegUser />}
              error={errors?.lastName}
              forceShowError={forceShowError}
            />

            <Field
              label={t("personalInfo.dateOfBirth.label")}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder={t("personalInfo.dateOfBirth.placeholder")}
              icon={<FaEnvelope />}
              error={errors?.dateOfBirth}
              forceShowError={forceShowError}
            />

            <SelectField
              label={t("gender")}
              name="gender"
              value={
                formData.gender === 0
                  ? "male"
                  : formData.gender === 1
                  ? "female"
                  : ""
              }
              onChange={handleInputChange}
              placeholder={t("personalInfo.gender.placeholder")}
              icon={<FaPhone />}
              error={errors?.gender}
              forceShowError={forceShowError}
              options={[
                { value: "", label: t("Select your gender") },
                { value: "male", label: t("male") },
                { value: "female", label: t("female") },
              ]}
            />

            <Field
              label={t("personalInfo.licenseNumber.label")}
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              placeholder={t("personalInfo.licenseNumber.placeholder")}
              icon={<FaIdCard />}
              error={errors?.licenseNumber}
              forceShowError={forceShowError}
            />

            <Field
              label={t("personalInfo.phoneNumber.label")}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder={t("personalInfo.phoneNumber.placeholder")}
              icon={<FaIdCard />}
              error={errors?.phoneNumber}
              forceShowError={forceShowError}
            />

            <div style={{ gridColumn: "span 2" }}>
              <FileField
                label={t("personalInfo.licenseImage.label")}
                name="licenseImage"
                accept="image/*"
                onChange={handleInputChange}
                hint={t("personalInfo.licenseImage.hint")}
                error={errors?.licenseImage}
                forceShowError={forceShowError}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Step1PersonalInfo;
