import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import '.././../MainCss.css'
const EducationAccordion = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const data = [
    { title: t("education.items.0.title"), period: t("education.items.0.period") },
    { title: t("education.items.1.title"), period: t("education.items.1.period") },
    { title: t("education.items.2.title"), period: t("education.items.2.period") },
  ];

  return (
    <div className="dc-userexperience">
      <div className="dc-tabscontenttitle dc-addnew">
        <h3>{t("education.title")}</h3>
        <a href="#">{t("education.addNew")}</a>
      </div>

      <ul className="dc-experienceaccordion accordion">
        {data.map((item, index) => (
          <li key={index}>
            <div className="dc-accordioninnertitle">
              <span
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                {item.title} <em>{item.period}</em>
              </span>
              <div className="dc-rightarea">
                <a
                  href="#"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FaPencilAlt />
                </a>
                <a href="#" className="dc-deleteinfo">
                  <FaTrash />
                </a>
              </div>
            </div>

            <div
              className={`dc-collapseexp collapse ${
                openIndex === index ? "show" : "hide"
              }`}
            >
              <form className="dc-formtheme dc-userform">
                <fieldset>
                  <div className="form-group form-group-half">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("education.form.companyTitle")}
                    />
                  </div>
                  <div className="form-group form-group-half">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("education.form.startingDate")}
                    />
                  </div>
                  <div className="form-group form-group-half">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("education.form.endingDate")}
                    />
                  </div>
                  <div className="form-group form-group-half">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("education.form.jobTitle")}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder={t("education.form.jobDescription")}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <span>{t("education.form.note")}</span>
                  </div>
                </fieldset>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EducationAccordion;
