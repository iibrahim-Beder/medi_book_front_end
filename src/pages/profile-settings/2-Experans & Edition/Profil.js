import { useTranslation } from "react-i18next";
import "../../MainCss.css";

const Profil = () => {
  const { t } = useTranslation();

  return (
    <div className="dc-yourdetails dc-tabsinfo">
      <div className="dc-tabscontenttitle">
        <h3>{t("profile.title")}</h3>
      </div>
      <form className="dc-formtheme dc-userform">
        <fieldset>
          <div className="form-group form-group-half">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder={t("profile.experience")}
            />
          </div>
          <div className="form-group form-group-half">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder={t("profile.bio")}
            />
          </div>

          <div className="form-group form-group-half">
            <input
              type="text"
              name="heading"
              className="form-control"
              placeholder={t("profile.languages")}
            />
          </div>
          <div className="form-group form-group-half">
            <input
              type="text"
              name="heading"
              className="form-control"
              placeholder={t("profile.speciality")}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Profil;
