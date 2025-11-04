import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiMail, FiPhone } from "react-icons/fi";
import logo from "../../assets/images/logo-login1.png";
import Field from "../ui/form-fields/Field";
import "./Login.css";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("email"); // "email" or "phone"
  const [step, setStep] = useState(1); // 1: Enter email/phone, 2: Enter OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [step, timer]);

  const toggleMethod = () => {
    setMethod(method === "email" ? "phone" : "email");
    // Clear fields when switching
    setEmail("");
    setPhone("");
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    setMsg(null);

    if (method === "email" && !email) {
      setMsg({ type: "error", text: t("forgotPassword.emailRequired") });
      return;
    }

    if (method === "phone" && !phone) {
      setMsg({ type: "error", text: t("forgotPassword.phoneRequired") });
      return;
    }

    // Simulate sending code
    setMsg({ type: "success", text: t("forgotPassword.codeSent") });
    setStep(2);
    setTimer(59);
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`digit-${index + 2}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`digit-${index}`).focus();
    }
  };

  const handleResendCode = () => {
    setTimer(59);
    setMsg({ type: "success", text: t("forgotPassword.codeResent") });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    
    if (otp.some(digit => digit === "")) {
      setMsg({ type: "error", text: t("forgotPassword.otpRequired") });
      return;
    }

    setMsg({ type: "success", text: t("forgotPassword.passwordReset") });
    // Here you would typically redirect to reset password page
  };

  return (
    <div style={{height:"100vh", display:"flex", justifyContent:"center"}}>
      <div className="d-flex align-items-center justify-content-center login-container">
        <div className="col-md-7 col-lg-6 login-left">
          <img src={logo} className="img-fluid" alt="Doccure Forgot Password" />
        </div>

        <div className="col-md-12 col-lg-6">
          <div className="login-right">
            <div className="login-header">
              <h3>
                {step === 1 ? t("forgotPassword.title") : t("forgotPassword.verifyTitle")}{" "}
                <span className="login-logo">{t("login.brand")}</span>
              </h3>
            </div>

            {step === 1 ? (
              <>
                {/* Toggle Method Button */}
                <div className="login-method-toggle">
                  {t("login.with")} 
                  <button 
                    type="button"
                    className="toggle-method-btn"
                    onClick={toggleMethod}
                  >
                    {method === "email" 
                      ? t("login.withPhone") 
                      : t("login.withEmail")
                    }
                  </button>
                </div>

                <form className="dc-formtheme dc-userform" onSubmit={handleSendCode}>
                  <fieldset>
                    <div className="form-group">
                      {method === "email" ? (
                        <Field
                          label={t("login.email")}
                          type="email"
                          name="email"
                          placeholder={t("login.enterEmail")}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          icon={<FiMail />}
                        />
                      ) : (
                        <Field
                          label={t("login.phone")}
                          type="tel"
                          name="phone"
                          placeholder={t("login.enterPhone")}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          icon={<FiPhone />}
                        />
                      )}
                    </div>

                    <div className="form-group mt-6" style={{ overflow: "hidden" }}>
                      <button
                        className="btn-primary-gradient w-100 dc-btn"
                        type="submit"
                      >
                        {t("forgotPassword.sendCode")}
                      </button>
                    </div>

                    <div className="account-signup">
                      <p>
                        {t("forgotPassword.rememberPassword")}{" "}
                        <Link to="/login">{t("forgotPassword.backToLogin")}</Link>
                      </p>
                    </div>

                    {/* {msg && (
                      <div
                        className={`alert alert-${msg.type}`}
                        style={{ marginTop: 15 }}
                      >
                        {msg.text}
                      </div>
                    )} */}
                  </fieldset>
                </form>
              </>
            ) : (
              <div className="account-content">
                <div className="account-info">
                  <div className="login-verify-img">
                    <i className="isax isax-sms"></i>
                  </div>
                  <div className="login-title">
                    <p className="mb-0 send-code-to ">
                      {t("forgotPassword.codeSentTo")}{" "}
                      {method === "email" 
                        ? `******${email.split('@')[0].slice(-3)}@${email.split('@')[1]}`
                        : `******${phone.slice(-3)}`
                      }
                    </p>
                  </div>
                  
                  <form className="digit-group login-form-control" onSubmit={handleVerifyOtp}>
                    <div className="otp-box">
                      <div className="mb-3 d-flex justify-content-between">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`digit-${index + 1}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="otp-input"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="otp-info d-flex justify-content-between align-items-end ">
                        <div className="account-signup">
                          <p className="d-flex">
                            {t("forgotPassword.didntReceive")}{" "}
                            <a 
                              href="#!" 
                              onClick={handleResendCode}
                              className={timer > 0 ? "disabled" : ""}
                            >
                              {t("forgotPassword.resendCode")}
                            </a>
                          </p>
                        </div>
                        <div className="otp-sec">
                          <p className="mb-0">
                            {/* <i className="isax isax-clock"></i> */}
                            00:{timer < 10 ? `0${timer}` : timer} {t("forgotPassword.secs")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="reset-btn">
                      <button className="btn-primary-gradient w-100 dc-btn" type="submit">
                        {t("forgotPassword.verify")}
                      </button>
                    </div>
                  </form>

                  {/* {msg && (
                    <div
                      className={`alert alert-${msg.type}`}
                      style={{ marginTop: 15 }}
                    >
                      {msg.text}
                    </div>
                  )} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}