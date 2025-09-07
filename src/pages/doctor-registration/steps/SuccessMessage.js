import React from "react";
import { FaCheckCircle, FaRedo } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const SuccessMessage = ({ resetForm }) => {
  const { t } = useTranslation();

  return (
    <div className="success-message">
      <FaCheckCircle />
      <h2>{t("success.title")}</h2>
      <p>{t("success.message1")}</p>
      <p>{t("success.message2")}</p>
      <p>
        {t("success.requestNumber")}:{" "}
        <strong>MR-{new Date().getFullYear()}-5876</strong>
      </p>
      <br />
      <button  type="submit" className="dc-btn" onClick={resetForm}>
        {t("success.newRegister")}
      </button>
    </div>
  );
};

export default SuccessMessage;
