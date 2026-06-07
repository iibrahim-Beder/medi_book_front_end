import React from "react";
import { FaCheckCircle, FaRedo } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Button } from "@mui/material";

const SuccessMessage = ({ setOpenStepRegister }) => {
  const { t } = useTranslation();

  return (
    <div className="success-message">
      <IoCheckmarkCircleOutline className="mb-0" />
      <h2 className="mb-0" style={{ fontWeight: "500", color: "var(--success)" }}>{t("SUCCESS!")}</h2>
      <h2 style={{ fontWeight: "500" }}>{t("success.title")}</h2>
      <h5 style={{ fontWeight: "500" }}>{t("success.message2")} </h5>
      <br />
      <div className="btns">
         <Link to="/Generate-Doctor-Slots">
          <Button
           onClick={() => setOpenStepRegister(false)}
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              backgroundColor: "#60a5fa",
              boxShadow: "none",
            }}
          >
            {t("Go to generate rules page")}
          </Button>
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
