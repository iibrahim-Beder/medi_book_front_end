import { t } from "i18next";
import React, { useState } from "react";

const FileField = ({
  label,
  name,
  accept,
  onChange,
  icon,
  buttonIcon,
  hint,
  error,
  forceShowError = false, 
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setTouched(true);
    onChange(e);
  };
  const showError = error && (touched || forceShowError);
  return (
        <div className={`form-group form-group-label ${showError ? "has-error" : ""} `}>
            <label>{label}</label>
              <div className={`dc-labelgroup ${showError ? "file-error" : ""} `}>
                <label htmlFor="filep">
                  <span className="dc-btn"> {t("profilePhoto.selectFiles")}</span>
                  <input
                  accept={accept}
                  onChange={handleChange}
                  hidden
                  name={name}
                  type="file" id="filep" />
                </label>
                <span className="dc-uploadinfo">{t("profilePhoto.dropFiles")}</span>
                <em className="dc-fileuploading">
                  {t("profilePhoto.uploading")} <i className="fa fa-spinner fa-spin"></i>
                </em>
              </div>
            </div>
  );
};

export default FileField;