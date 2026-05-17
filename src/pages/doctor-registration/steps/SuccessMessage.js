import React from "react";
import { FaCheckCircle, FaRedo } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SuccessMessage = ({ setOpenStepRegister }) => {
  const { t } = useTranslation();

  return (
    <div className="success-message">
      <FaCheckCircle />
      <h2 style={{ fontWeight: "600" }}>{t("success.title")}</h2>
      <h5 style={{ fontWeight: "500" }}>{t("success.message2")} </h5>
      <br />
      <div className="d-flex flex-column">
        <Link to="/Generate-Doctor-Slots">
          <a
            href="!#"
            style={{
              textWrapMode: "nowrap",
              textDecoration: "underline",
              margin: "0 20px",
              fontWeight: "500",
              fontSize: "16px",
            }}
            onClick={() => setOpenStepRegister(false)}
          >
            {t("Go to generate rules page")}
          </a>
        </Link>
        <button
          onClick={() => setOpenStepRegister(false)}
          className="simple-btn"
        >
          close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
