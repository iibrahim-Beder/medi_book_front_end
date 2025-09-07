import { t } from "i18next";
import React from "react";

const MultiFileField = ({
  label,
  name,
  accept,
  onChange,
  icon,
  buttonIcon,
  hint,
}) => {
  return (
    <div>
      <label>{label}</label>
      <label className="file-upload">
        <span className="file-icon">{icon}</span>
        <p>{hint}</p>
        <span className="btn">
          {buttonIcon} {t("upload File")}
          <input
            type="file"
            name={name}
            accept={accept}
            multiple
            onChange={onChange}
            hidden
          />
        </span>
      </label>
    </div>
  );
};

export default MultiFileField;