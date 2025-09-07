import React from "react";   
import Field from "./Field";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ExperienceField = ({ exp, index, onChange, onRemove ,errors, forceShowError }) => {
  const { t } = useTranslation();

  const handleFieldChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <div className="experience-item">
      <Field
        label={t("experience.companyName")}
        name={`companyName-${index}`}
        value={exp.companyName}
        onChange={(e) => handleFieldChange("companyName", e.target.value)}
        placeholder={t("experience.companyName")}
        icon={<FaBriefcase />}
error={errors[`experience_${index}_companyName`]}
        forceShowError={forceShowError}
      />
      <Field
        type="date"
        label={t("experience.startDate")}
        name={`startDate-${index}`}
        value={exp.startDate}
        onChange={(e) => handleFieldChange("startDate", e.target.value)}
        icon={<FaCalendarAlt />}
        error={errors[`experience_${index}_startDate`]}
        forceShowError={forceShowError}
      />
      {!exp.stillWorking && (
        <Field
          type="date"
          label={t("experience.endDate")}
          name={`endDate-${index}`}
          value={exp.endDate}
          onChange={(e) => handleFieldChange("endDate", e.target.value)}
          icon={<FaCalendarAlt />}
          error={errors[`experience_${index}_endDate`]}
          forceShowError={forceShowError}
        />
      )}
      <div className="form-group">
        <span className="dc-checkbox">
          <input 
            type="checkbox"
            id={`stillWorking-${index}`}
            checked={exp.stillWorking}
            onChange={(e) => handleFieldChange("stillWorking", e.target.checked)}
          />  
    
        <label style={{ fontWeight: "bold" }} htmlFor={`stillWorking-${index}`}>
          {t("experience.stillWorking")}
        </label>
        </span>
      </div>
      {index > 0 && (
        <button
          type="button"
          className="btn remove"
          onClick={() => onRemove(index)}
        >
          {t("experience.removeCompany")}
        </button>
      )}
    </div>
  );
};

export default ExperienceField;
