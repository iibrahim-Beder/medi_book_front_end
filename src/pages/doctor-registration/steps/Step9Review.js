import React from "react";
import SectionTitle from "../../shareds/SectionTitle";
import FullWidth from "../../shareds/FullWidth";
import { t } from "i18next";
import { GiConfirmed } from "react-icons/gi";

const Step9Review = ({ formData, handleInputChange, errors }) => {
  
  return (

    <>
      <SectionTitle
        icon={<GiConfirmed />}
        title={t("reviewInfo.title")}
      />
      <div className="form-grid">
        <FullWidth>
          <div className="terms-container">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms || false}
              onChange={handleInputChange}
            />
            <label className="m-0" htmlFor="terms">
              {t("reviewInfo.termsText")}{" "}
              <a href="#!">{t("reviewInfo.termsOfUse")}</a> {" "}
              {t("reviewInfo.and")}{" "}
              <a href="#!">{t("reviewInfo.privacyPolicy")}</a> {" "}
              {t("reviewInfo.confirm")}
            </label>
            {/* {errors.terms && <span className="error-message">{errors.terms}</span>} */}
          </div>
        </FullWidth>
      </div>
    </>
  );
};

export default Step9Review;