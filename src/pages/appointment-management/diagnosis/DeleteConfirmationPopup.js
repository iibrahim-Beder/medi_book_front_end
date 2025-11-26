// DeleteConfirmationPopup.jsx
import React from "react";
import PopupMessage from "../../shared/PopupMessage";

const DeleteConfirmationPopup = ({ deletePopup, onClose, onConfirm, t }) => {
  return (
    <PopupMessage
      type="danger"
      title={t("Delete Diagnosis")}
      message={
        t("Are you sure you want to delete diagnosis") +
        ` "${deletePopup.diagnosisName.slice(0, 120) + (deletePopup.diagnosisName.length > 120 ? "..." : "") } "? ` +
        t("This action cannot be undone.")
      }
      buttons={[
        {
          text: t("Cancel"),
          onClick: onClose,
          variant: "secondary",
        },
        {
          text: t("Delete"),
          onClick: onConfirm,
          variant: "danger",
        },
      ]}
      onClose={onClose}
    />
  );
};

export default DeleteConfirmationPopup;