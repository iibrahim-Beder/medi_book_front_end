import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PasswordSettings({ onSubmit }) {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [logoutAll, setLogoutAll] = useState(true);
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);
    if (!oldPassword || !newPassword) {
      setMsg({ type: "error", text: t("password.error") });
      return;
    }
    const payload = { oldPassword, newPassword, logoutAll };
    setMsg({ type: "success", text: t("password.success") });
    if (typeof onSubmit === "function") onSubmit(payload);
  };

  return (
    <div className="dc-passwordholder" id="dc-password">
      <div className="dc-changepassword">
        <div className="dc-tabscontenttitle">
          <h3>{t("password.title")}</h3>
        </div>
        <form
          className="dc-formtheme dc-userform dc-sidepadding"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset>
            <div className="form-group form-group-half">
              <input
                id="oldPassword"
                type="password"
                name="oldPassword"
                className="form-control"
                placeholder={t("password.old")}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group form-group-half">
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                className="form-control"
                placeholder={t("password.new")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="dc-checkbox" htmlFor="logoutAllSessionsPassword">
                <input
                  id="logoutAllSessionsPassword"
                  type="checkbox"
                  name="logoutAllSessions"
                  checked={logoutAll}
                  onChange={(e) => setLogoutAll(e.target.checked)}
                />
                <span>{t("password.logoutAll")}</span>
              </label>
            </div>

            <div className="form-group dc-btnarea">
              <button type="submit" className="dc-btn">
                {t("password.updateBtn")}
              </button>
            </div>

            {msg && (
              <div
                style={{
                  marginTop: 12,
                  color: msg.type === "error" ? "#c00" : "#0a0",
                }}
              >
                {msg.text}
              </div>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}
