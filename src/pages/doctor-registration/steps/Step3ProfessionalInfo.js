import React from "react";
import SectionTitle from "../../shared/SectionTitle";
import SelectField from "../../ui/form-fields/SelectField";
import Field from "../../ui/form-fields/Field";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import FileField from "../../ui/form-fields/FileField";
import FullWidth from "../../shared/FullWidth";
import { getSpecialtyOptions } from "../../../constants/formOptions";
import { GrLanguage } from "react-icons/gr";
import { MdOutlineFolderSpecial } from "react-icons/md";

import {
  FaStethoscope,
  FaClipboardCheck,
  FaCloudUploadAlt,
  FaUpload,
} from "react-icons/fa";
import { t } from "i18next";
import EditableList from "../../shared/EditableList";

const Step2ProfessionalInfo = ({ formData, handleInputChange, errors, forceShowError }) => {
  return (
    <>
      <SectionTitle
        icon={<MdOutlineFolderSpecial />}
        title={t("professionalInfo.title")}
      />
      <div className="form-grid">
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
          initialItems={["English"]}
          minItems={0}
        />
        </FullWidth>

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
          initialItems={[]}
          minItems={0}
        />
        </FullWidth>
      </div>
    </>
  );
};

export default Step2ProfessionalInfo;
