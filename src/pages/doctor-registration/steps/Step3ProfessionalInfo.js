import React, { useState, useEffect } from "react";
import SectionTitle from "../../shared/SectionTitle";
import SelectField from "../../ui/form-fields/SelectField";
import Field from "../../ui/form-fields/Field";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import FileField from "../../ui/form-fields/FileField";
import FullWidth from "../../shared/FullWidth";
import { getSpecialtyOptions } from "../../../constants/formOptions";
import { GrLanguage } from "react-icons/gr";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { FaStethoscope, FaClipboardCheck, FaCloudUploadAlt, FaUpload } from "react-icons/fa";
import { t } from "i18next";
import EditableList from "../../shared/EditableList";

export default function Step2ProfessionalInfo({
  errors = {},
  forceShowError = true,
  initialData = {},     // ← Comes from Redux or parent
  onChange = () => {},  // ← Send updates back to parent
}) {
  // Local state for form data
  const [formData, setFormData] = useState({
    specialty: "",
    yearsOfExperience: "",
    licenseNumber: "",
    bio: "",
    licenseFile: null,
    languages: ["English"],
    specializations: [],
    ...initialData, // Merge any data passed from parent
  });

  // Whenever formData changes, send it back to parent
  useEffect(() => {
    onChange(formData);
  }, [formData]);

  // Handle input fields change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <>
      <SectionTitle
        icon={<MdOutlineFolderSpecial />}
        title={t("professionalInfo.title")}
      />

      <div className="form-grid">
        {/* Specialty */}
        <SelectField
          label={t("professionalInfo.specialty.label")}
          name="specialty"
          value={formData.specialty}
          onChange={handleInputChange}
          options={getSpecialtyOptions(t)}
          icon={<FaStethoscope />}
          error={errors?.specialty}
          forceShowError={forceShowError}
        />

        {/* Years of Experience */}
        <Field
          label={t("professionalInfo.YearsOfExperience.label")}
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
          placeholder={t("professionalInfo.YearsOfExperience.placeholder")}
          icon={<FaStethoscope />}
          error={errors?.yearsOfExperience}
          forceShowError={forceShowError}
        />

        {/* License Number */}
        <Field
          label={t("professionalInfo.licenseNumber.label")}
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleInputChange}
          placeholder={t("professionalInfo.licenseNumber.placeholder")}
          icon={<FaClipboardCheck />}
          error={errors?.licenseNumber}
          forceShowError={forceShowError}
        />

        {/* Bio */}
        <TextAreaField
          label={t("professionalInfo.Bio.label")}
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder={t("professionalInfo.Bio.placeholder")}
          icon={<GrLanguage />}
          error={errors?.bio}
          forceShowError={forceShowError}
        />

        {/* Languages List */}
        <FullWidth>
          <EditableList
            headerComponent={
              <SectionTitle
                icon={<GrLanguage />}
                title={t("professionalInfo.languages.title")}
              />
            }
            title={t("professionalInfo.languages.title")}
            placeholder={t("professionalInfo.languages.placeholder")}
            addBtnText={t("professionalInfo.languages.addBtnText")}
            initialItems={formData.languages}
            minItems={0}
            onChange={(items) =>
              setFormData((prev) => ({ ...prev, languages: items }))
            }
          />
        </FullWidth>

        {/* License File Upload */}
        <FullWidth>
          <FileField
            label={t("professionalInfo.licenseFile.label")}
            name="licenseFile"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleInputChange}
            icon={<FaCloudUploadAlt />}
            buttonIcon={<FaUpload />}
            hint={t("professionalInfo.licenseFile.hint")}
            error={errors?.licenseFile}
            forceShowError={forceShowError}
          />
        </FullWidth>

        {/* Specializations List */}
        <FullWidth>
          <EditableList
            headerComponent={
              <SectionTitle
                icon={<FaStethoscope />}
                title={t("professionalInfo.Specializations.title")}
              />
            }
            title={t("professionalInfo.Specializations.title")}
            placeholder={t("professionalInfo.Specializations.placeholder")}
            addBtnText={t("professionalInfo.Specializations.addBtnText")}
            initialItems={formData.specializations}
            minItems={0}
            onChange={(items) =>
              setFormData((prev) => ({ ...prev, specializations: items }))
            }
          />
        </FullWidth>
      </div>
    </>
  );
}
