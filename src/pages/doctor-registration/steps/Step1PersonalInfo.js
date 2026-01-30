import React, { useState, useEffect } from "react";
import SectionTitle from "../../shared/SectionTitle";
import Field from "../../ui/form-fields/Field";
import { FaEnvelope, FaPhone, FaIdCard, FaLock } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { t } from "i18next";

export default function Step1PersonalInfo({
  errors = {},
  forceShowError = true,
  initialData = {},
  onChange = () => {},
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
    ...initialData,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <SectionTitle icon={<FaRegUser />} title={t("personalInfo.title")} />
      <div className="table-card">
      <div className="form-grid">
        <Field
          label={t("personalInfo.fullName.label")}
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder={t("personalInfo.fullName.placeholder")}
          icon={<FaRegUser />}
          error={errors?.fullName}
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
          error={errors?.email}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.phone.label")}
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder={t("personalInfo.phone.placeholder")}
          icon={<FaPhone />}
          error={errors?.phone}
          forceShowError={forceShowError}
        />
        <Field
          label={t("personalInfo.nationalId.label")}
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          placeholder={t("personalInfo.nationalId.placeholder")}
          icon={<FaIdCard />}
          error={errors?.nationalId}
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
          error={errors?.password}
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
          error={errors?.confirmPassword}
          forceShowError={forceShowError}
        />
      </div>
      </div>

    </>
  );
}