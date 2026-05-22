import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/logo-login1.png";
import Field from "../ui/form-fields/Field";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/doctor-information/authenticationsApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/Slices/login/authSlice";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/api-errors";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginWithOTP, setLoginWithOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [msg, setMsg] = useState(null);

   const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    if (isLoading) return;
    console.log("login===== email", email, "password", password);
    // return;
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    e.preventDefault();

    const loader = toast.loading("Please wait...");
    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      dispatch(setCredentials(res));

      // why: persist session
    if (rememberMe) {
      localStorage.setItem("auth", JSON.stringify(res));
    } else {
      sessionStorage.setItem("auth", JSON.stringify(res));
    }

      navigate("/dashboard");
    } catch (err) {
      console.log("login error",err);
      toast.error(getErrorMessage(err));
    }finally {
      toast.dismiss(loader);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "email" ? "phone" : "email");
    // Clear the fields when switching methods
    setEmail("");
    setPhone("");
  };

  return (
    <div style={{height:"100vh", display:"flex", justifyContent:"center"}}>
      <div className="d-flex align-items-center justify-content-center login-container">
        <div className="col-md-7 col-lg-6 login-left">
          <img src={logo} className="img-fluid" alt="Doccure Login" />
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

            {/* Toggle Login Method Button */}
            <div className="login-method-toggle">
              {t("login.with")} 
              <button 
                type="button"
                className="toggle-method-btn"
                onClick={toggleLoginMethod}
              >
                {loginMethod === "email" 
                  ? t("login.withPhone") 
                  : t("login.withEmail")
                }
              </button>
            </div>

            <form className="dc-formtheme dc-userform" >
              <fieldset>
                {/* Email/Phone Field */}
                <div className="form-group">
                  {loginMethod === "email" ? (
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

                {/* Password Field - Only show if not using OTP */}
                {!loginWithOTP && (
                  <div className="form-group">
                    <div className="form-label-group">
                      <label>{t("login.password")}</label>
                      <Link to="/forgot-password" className="forgot-link">
                        {t("login.forgotPassword")}
                      </Link>
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
                )}

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
                  <button
                    className="btn-primary-gradient w-100 dc-btn"
                    onClick={handleSubmit}
                    type="button"
                  >
                    {t("login.button")}
                  </button>
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
                    <Link to="/Authentication">{t("login.signupNow")}</Link>
                  </p>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}