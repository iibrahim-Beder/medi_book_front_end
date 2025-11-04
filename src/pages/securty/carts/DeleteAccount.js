import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import TextAreaField from "../../ui/form-fields/TextAreaField";

export default function DeleteAccount({ onDelete }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [unsubscribe, setUnsubscribe] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);

    if (!password) {
      setMsg({ type: "error", text: t("deleteAccount.errors.emptyPassword") });
      return;
    }
    if (password !== password2) {
      setMsg({ type: "error", text: t("deleteAccount.errors.notMatch") });
      return;
    }

    if (!window.confirm(t("deleteAccount.confirmMessage"))) return;

    setMsg({ type: "success", text: t("deleteAccount.successMessage") });
    if (typeof onDelete === "function") onDelete();
  };

  return (
    <div className="dc-emailnotiholder" id="dc-deleteaccount" role="tabpanel">
      <div className="dc-accountdel">
        <div className="dc-tabscontenttitle">
          <h3>{t("deleteAccount.title")}</h3>
        </div>

        <form
          className="dc-formtheme dc-userform dc-sidepadding"
          onSubmit={handleSubmit}
        >
          <fieldset>
            <div className="form-group form-group-half">
              <Field
                 label="password"
                type="password"
                name="password"
                placeholder={t("deleteAccount.placeholders.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group form-group-half">
              <Field
                type="password"
                label="confirm Password"
                name="confirmPassword"
                placeholder={t("deleteAccount.placeholders.confirmPassword")}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>

            <div className="form-group">
              <SelectField
                name="reason"
                label={t("deleteAccount.placeholders.reason")}
                options={[
                  { value: "noReason", label: t("deleteAccount.reasons.noReason") },
                  { value: "reason1", label: t("deleteAccount.reasons.reason1") },
                  { value: "reason2", label: t("deleteAccount.reasons.reason2") },
                ]}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

            </div>

            <div className="form-group">

              <TextAreaField
                name="message"
                label={t("deleteAccount.placeholders.description")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="form-group form-group-half float-right">
              <span className="dc-checkbox">
                <input
                  id="termsconditions1"
                  type="checkbox"
                  name="termsconditions"
                  checked={unsubscribe}
                  onChange={(e) => setUnsubscribe(e.target.checked)}
                />
                <label htmlFor="termsconditions1">
                  <span>{t("deleteAccount.unsubscribe")}</span>
                </label>
              </span>
            </div>

            <div className="form-group form-group-half dc-btnarea">
              <button type="submit" className="dc-btn">
                {t("deleteAccount.button")}
              </button>
            </div>

            {msg && (
              <div
                className={`alert alert-${msg.type}`}
                style={{ marginTop: 10 }}
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
