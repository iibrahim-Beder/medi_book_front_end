import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Field from "../../ui/form-fields/Field"; 

// 1. Normal form for a single experience
function SingleExperienceForm({ exp, index, errors, forceShowError, handleInputChange }) {
  const { t } = useTranslation();
  return (
    <form className="dc-formtheme dc-userform">
      <fieldset>
        <div className="form-group form-group-half">
          <Field
            name={`experience_${index}_companyName`}
            label={t("userExperience.companyTitle")}
            value={exp.companyTitle}
            onChange={(e) =>
              handleInputChange(exp.id, "companyTitle", e.target.value)
            }
            placeholder={t("userExperience.companyTitle")}
            error={errors[`experience_${index}_companyName`]}
            forceShowError={forceShowError}
          />
        </div>
        <div className="form-group form-group-half">
          <Field
            name={`experience_${index}_startDate`}
            label={t("userExperience.startingDate")}
            value={exp.startingDate}
            onChange={(e) =>
              handleInputChange(exp.id, "startingDate", e.target.value)
            }
            placeholder={t("userExperience.startingDate")}
            error={errors[`experience_${index}_startDate`]}
            forceShowError={forceShowError}
          />
        </div>
        <div className="form-group form-group-half">
          <Field
            name={`experience_${index}_endDate`}
            label={t("userExperience.endingDate")}
            value={exp.endingDate}
            onChange={(e) =>
              handleInputChange(exp.id, "endingDate", e.target.value)
            }
            placeholder={t("userExperience.endingDate")}
            error={errors[`experience_${index}_endDate`]}
            forceShowError={forceShowError}
          />
        </div>
        <div className="form-group form-group-half">
          <Field
            name={`experience_${index}_jobTitle`}
            label={t("userExperience.jobTitle")}
            value={exp.jobTitle}
            onChange={(e) =>
              handleInputChange(exp.id, "jobTitle", e.target.value)
            }
            placeholder={t("userExperience.jobTitle")}
            error={errors[`experience_${index}_jobTitle`]}
            forceShowError={forceShowError}
          />
        </div>
        <div className="form-group">
          <textarea
            className={`form-control ${
              errors[`experience_${index}_description`] && forceShowError
                ? "input-error"
                : ""
            }`}
            placeholder={t("userExperience.jobDescription")}
            value={exp.description}
            onChange={(e) =>
              handleInputChange(exp.id, "description", e.target.value)
            }
          />
          {errors[`experience_${index}_description`] && forceShowError && (
            <span className="error-text">
              {errors[`experience_${index}_description`]}
            </span>
          )}
        </div>
        <div className="form-group">
          <span>{t("userExperience.noteEndingDate")}</span>
        </div>
      </fieldset>
    </form>
  );
}

// 2. Accordion when there are multiple experiences
function ExperiencesAccordion({ experiences, toggleAccordion, handleInputChange, errors, forceShowError, setExperiences }) {
  const { t } = useTranslation();
  return (
    <ul className="dc-experienceaccordion accordion">
      {experiences.map((exp, index) => (
        <li key={exp.id}>
          <div className="dc-accordioninnertitle">
            <span
              onClick={() => toggleAccordion(exp.id)}
              style={{ cursor: "pointer" }}
              aria-expanded={exp.isOpen}
              aria-controls={`exp-collapse-${exp.id}`}
              id={`exp-header-${exp.id}`}
            >
              {exp.title}
              <em> ({exp.period})</em>
            </span>
            <div className="dc-rightarea">
              <a
                className="dc-addinfo dc-skillsaddinfo"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  toggleAccordion(exp.id);
                }}
              >
                <FaPencilAlt />
              </a>
              <a
                className="dc-deleteinfo"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setExperiences((prev) =>
                    prev.filter((e) => e.id !== exp.id)
                  );
                }}
              >
                <FaTrash />
              </a>
            </div>
          </div>

          {exp.isOpen && (
            <div
              className="dc-collapseexp collapse show"
              id={`exp-collapse-${exp.id}`}
              aria-labelledby={`exp-header-${exp.id}`}
            >
              <SingleExperienceForm
                exp={exp}
                index={index}
                errors={errors}
                forceShowError={forceShowError}
                handleInputChange={handleInputChange}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// 3. Main component
export default function UserExperience({ ComponentProp, header = true, errors = {}, forceShowError = false }) {
  const { t } = useTranslation();

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: t("userExperience.generalDentistry"),
      period: "2018 - Present",
      companyTitle: "",
      startingDate: "",
      endingDate: "",
      jobTitle: "",
      description: "",
      isOpen: true,
    },
  ]);

  const toggleAccordion = (id) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, isOpen: !exp.isOpen } : exp
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addNewExperience = () => {
    const newId = experiences.length
      ? Math.max(...experiences.map((e) => e.id)) + 1
      : 1;
    const newExp = {
      id: newId,
      title: t("userExperience.newExperience"),
      period: "",
      companyTitle: "",
      startingDate: "",
      endingDate: "",
      jobTitle: "",
      description: "",
      isOpen: true,
    };
    setExperiences((prev) => [...prev, newExp]);
  };

  return (
    <div className="dc-userexperience dc-tabsinfo">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("userExperience.addYourExperience")}</h3>
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                addNewExperience();
              }}
            >
              {t("userExperience.addNew")}
            </a>
          </div>
        )}
        {!header && (
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              addNewExperience();
            }}
          >
            {t("userExperience.addNew")}
          </a>
        )}
      </div>

      {experiences.length === 1 ? (
        <SingleExperienceForm
          exp={experiences[0]}
          index={0}
          errors={errors}
          forceShowError={forceShowError}
          handleInputChange={handleInputChange}
        />
      ) : (
        <ExperiencesAccordion
          experiences={experiences}
          toggleAccordion={toggleAccordion}
          handleInputChange={handleInputChange}
          errors={errors}
          forceShowError={forceShowError}
          setExperiences={setExperiences}
        />
      )}
    </div>
  );
}
