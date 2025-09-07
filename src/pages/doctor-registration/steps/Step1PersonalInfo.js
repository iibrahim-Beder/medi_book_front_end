import React from "react";
import SectionTitle from "../../shared/SectionTitle";
import Field from "../../ui/form-fields/Field";
import { FaUserMd, FaEnvelope, FaPhone, FaIdCard, FaLock } from "react-icons/fa";
import { t } from "i18next";
import { CiUser } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa6";

const Step1PersonalInfo = ({ formData, handleInputChange, errors, forceShowError }) => {
  return (
    <>
      <SectionTitle
        icon={<FaRegUser />}
        title={t("personalInfo.title")}
      />
      <div className="form-grid">
        <Field
          label={t("personalInfo.fullName.label")}
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder={t("personalInfo.fullName.placeholder")}
          icon={<FaRegUser />}
          error={errors.fullName}
          forceShowError={forceShowError}   
        />
        <Field
          label={t("personalInfo.email.label")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t("personalInfo.email.placeholder")}
          icon={<FaEnvelope />}
          error={errors.email}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.phone.label")}
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder={t("personalInfo.phone.placeholder")}
          icon={<FaPhone />}
          error={errors.phone}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.nationalId.label")}
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          placeholder={t("personalInfo.nationalId.placeholder")}
          icon={<FaIdCard />}
          error={errors.nationalId}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.password.label")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder={t("personalInfo.password.placeholder")}
          icon={<FaLock />}
          error={errors.password}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.confirmPassword.label")}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder={t("personalInfo.confirmPassword.placeholder")}
          icon={<FaLock />}
          error={errors.confirmPassword}
          forceShowError={forceShowError}  
        />
      </div>
    </>
  );
};

export default Step1PersonalInfo;
