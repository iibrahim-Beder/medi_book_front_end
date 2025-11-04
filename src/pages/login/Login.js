import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/logo-login1.png";
import Field from "../ui/form-fields/Field";
import "./Login.css";
import { Link } from "react-router-dom";
export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginWithOTP, setLoginWithOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);

    if (!email) {
      setMsg({ type: "error", text: t("login.emailRequired") });
      return;
    }

    if (!password && !loginWithOTP) {
      setMsg({ type: "error", text: t("login.passwordRequired") });
      return;
    }

    setMsg({ type: "success", text: t("login.success") });
    console.log("Login attempt:", { email, password, rememberMe, loginWithOTP });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{height:"100vh", display:"flex", justifyContent:"center"}} >
      <div className="d-flex align-items-center justify-content-center login-container ">
        <div class="col-md-7 col-lg-6 login-left  ">
          <img src={logo} class="img-fluid" alt="Doccure Login" />
        </div>

        {/* Login Form */}
        <div className="col-md-12 col-lg-6">
          <div className="login-right">
            <div className="login-header">
              <h3>
                {t("login.title")}{" "}
                <span className="login-logo">{t("login.brand")}</span>
              </h3>
            </div>

            <form className="dc-formtheme dc-userform" onSubmit={handleSubmit}>
              <fieldset>
                {/* Email Field */}
                <div className="form-group">
                  <Field
                    label={t("login.email")}
                    type="email"
                    name="email"
                    placeholder={t("login.enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<FiMail />}
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <div className="form-label-group">
                    <label>{t("login.password")}</label>
                    <a href="forgot-password.html" className="forgot-link">
                      {t("login.forgotPassword")}
                    </a>
                  </div>
                  <div className="pass-group" style={{ position: "relative" }}>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t("login.enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<FiLock />}
                    />
                    <span
                      className={`toggle-password-icon ${
                        showPassword ? "feather-eye-off" : "feather-eye"
                      }`}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="form-group form-check-box">
                  <div className="form-group-checbox">
                    <span className="dc-checkbox">
                      <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember">
                        <span>{t("login.rememberMe")}</span>
                      </label>
                    </span>

                    <span className="dc-checkbox">
                      <input
                        id="remember1"
                        type="checkbox"
                        name="loginWithOTP"
                        checked={loginWithOTP}
                        onChange={(e) => setLoginWithOTP(e.target.checked)}
                      />
                      <label htmlFor="remember1">
                        <span>{t("login.loginWithOTP")}</span>
                      </label>
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-group mt-6" style={{ overflow: "hidden" }}>
                  <Link to="/dashboard">
                  <button
                    className="btn-primary-gradient w-100 dc-btn"
                    type="submit"
                  >
                    {t("login.button")}
                  </button>
                  </Link>
                </div>

                {/* Divider */}
                <div className="login-or">
                  <span className="or-line"></span>
                  <span className="span-or">{t("login.or")}</span>
                </div>

                {/* Social Login */}
                <div className="social-login-btn">
                  <a href="!#" className="btn w-100">
                    <FcGoogle />
                    {t("login.google")}
                  </a>
                </div>

                {/* Signup Link */}
                <div className="account-signup">
                  <p>
                    {t("login.noAccount")}{" "}
                    <Link to="/registration">   <a href="!#">{t("login.signupNow")}</a></Link>
                 
                  </p>
                </div>

                {/* Messages */}
                {msg && (
                  <div
                    className={`alert alert-${msg.type}`}
                    style={{ marginTop: 15 }}
                  >
                    {msg.text}
                  </div>
                )}
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
