import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import Field from "../ui/form-fields/Field";
import logo from "../../assets/images/loginImg.png";
import { useAuthentication } from "./hooks/useAuthentication";

export default function Authentication() {
    const { t } = useTranslation();
 const { formState, handlers } = useAuthentication();
  const {
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
  } = formState;
  const {
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSubmit,
  } = handlers;

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div className="d-flex align-items-center justify-content-center login-container">
        <div className="col-md-7 col-lg-6 login-left">
          <img src={logo} className="img-fluid" alt="Register" />
        </div>

        <div className="col-md-12 col-lg-6">
          <div className="login-right">
            <div className="login-header">
              <h3>
                {t('register.title')}{' '}
                <span className="login-logo">{t('register.brand')}</span>
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <Field
                label={t('register.email')}
                type="email"
                name="email"
                placeholder={t('register.enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FiMail />}
                disabled={isLoading}
              />

              {/* Password */}
              <div className="form-group mb-0">
                <div className="form-label-group">
                  <label>{t('login.password')}</label>
                </div>
                <div className="pass-group" style={{ position: 'relative' }}>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder={t('login.enterPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<FiLock />}
                    disabled={isLoading}
                  />
                  <span
                    className="toggle-password-icon"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group mb-0 mt-3">
                <div className="form-label-group">
                  <label>{t('register.confirmPassword')}</label>
                </div>
                <div className="pass-group" style={{ position: 'relative' }}>
                  <Field
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder={t('register.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<FiLock />}
                    disabled={isLoading}
                  />
                  <span
                    className="toggle-password-icon"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary-gradient w-100 dc-btn mt-3"
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('register.button')}
              </button>

              <div className="account-signup mt-3">
                <p>
                  {t('register.haveAccount')}{' '}
                  <Link to="/login">{t('register.loginNow')}</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}