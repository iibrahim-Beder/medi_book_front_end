import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash, FaUniversity, FaCalendarAlt, FaAward, FaFileUpload, FaCloudUploadAlt, FaUpload } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SectionTitle from "../../shared/SectionTitle";
import Field from "../../ui/form-fields/Field";
import SelectField from "../../ui/form-fields/SelectField";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import MultiFileField from "../../ui/form-fields/MultiFileField";
import FullWidth from "../../shared/FullWidth";
import { getQualificationOptions } from "../../../constants/formOptions";
import { PiCertificateThin } from "react-icons/pi";
import { MdSchool } from "react-icons/md";
import { IoIosRibbon } from "react-icons/io";
import FileField from "../../ui/form-fields/FileField";


// ============= 1. Single Qualification Form =============
function SingleQualificationForm({ q, index, errors, forceShowError, handleInputChange }) {
  const { t } = useTranslation();

  return (
    <form className="dc-formtheme dc-userform">
      <fieldset>
        <div className="form-grid">
          {/* Qualification selection field */}
          <SelectField
            label={t("qualificationsInfo.qualification.label")}
            name={`qualification_${index}`}
            value={q.qualification}
            onChange={(e) => handleInputChange(q.id, "qualification", e.target.value)}
            options={getQualificationOptions(t)}
            icon={<IoIosRibbon />}
            error={errors[`qualification_${index}`]}
            forceShowError={forceShowError}
          />

          {/* University name input */}
          <Field
            label={t("qualificationsInfo.university.label")}
            name={`university_${index}`}
            value={q.university}
            onChange={(e) => handleInputChange(q.id, "university", e.target.value)}
            placeholder={t("qualificationsInfo.university.placeholder")}
            icon={<FaUniversity />}
            error={errors[`university_${index}`]}
            forceShowError={forceShowError}
          />

          {/* Graduation year input */}
          <Field
            label={t("qualificationsInfo.graduationYear.label")}
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            name={`graduationYear_${index}`}
            value={q.graduationYear}
            onChange={(e) => handleInputChange(q.id, "graduationYear", e.target.value)}
            placeholder={t("qualificationsInfo.graduationYear.placeholder")}
            icon={<FaCalendarAlt />}
            error={errors[`graduationYear_${index}`]}
            forceShowError={forceShowError}
          />

          {/* Additional certificate input */}
          <Field
            label={t("qualificationsInfo.additionalCert.label")}
            name={`additionalCert_${index}`}
            value={q.additionalCert}
            onChange={(e) => handleInputChange(q.id, "additionalCert", e.target.value)}
            placeholder={t("qualificationsInfo.additionalCert.placeholder")}
            icon={<FaAward />}
            error={errors[`additionalCert_${index}`]}
            forceShowError={forceShowError}
          />

          {/* Certificates description text area */}
          <FullWidth>
            <TextAreaField
              label={t("qualificationsInfo.certificates.label")}
              name={`certificates_${index}`}
              value={q.certificates}
              onChange={(e) => handleInputChange(q.id, "certificates", e.target.value)}
              placeholder={t("qualificationsInfo.certificates.placeholder")}
              icon={<MdSchool />}
              error={errors[`certificates_${index}`]}
              forceShowError={forceShowError}
            />
          </FullWidth>

          {/* File upload for certificates */}
          <FullWidth>
            <FileField
              label={t("qualificationsInfo.certFiles.label")}
              name={`certFiles_${index}`}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleInputChange(q.id, "certFiles", e.target.files)}
              icon={<FaCloudUploadAlt />}
              buttonIcon={<FaUpload />}
              error={errors[`certFiles_${index}`]}
              forceShowError={forceShowError}
              hint={" Upload Certificates & Qualifications  "}
            />
          </FullWidth>
        </div>
      </fieldset>
    </form>
  );
}


// ============= 2. Qualifications Accordion =============
function QualificationsAccordion({ qualifications, toggleAccordion, handleInputChange, errors, forceShowError, setQualifications }) {
  const { t } = useTranslation();

  return (
    <ul className="dc-experienceaccordion accordion">
      {qualifications.map((q, index) => (
        <li key={q.id}>
          <div className="dc-accordioninnertitle">
            <span
              onClick={() => toggleAccordion(q.id)}
              style={{ cursor: "pointer" }}
              aria-expanded={q.isOpen}
              aria-controls={`qual-collapse-${q.id}`}
              id={`qual-header-${q.id}`}
            >
              {q.qualification || t("qualificationsInfo.newQualification")}
              <em> {q.university && `(${q.university})`} </em>
            </span>

            <div className="dc-rightarea">
              <a
                className="dc-addinfo dc-skillsaddinfo"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  toggleAccordion(q.id);
                }}
              >
                <FaPencilAlt />
              </a>
              <a
                className="dc-deleteinfo"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setQualifications((prev) => prev.filter((item) => item.id !== q.id));
                }}
              >
                <FaTrash />
              </a>
            </div>
          </div>

          {q.isOpen && (
            <div
              className="dc-collapseexp collapse show"
              id={`qual-collapse-${q.id}`}
              aria-labelledby={`qual-header-${q.id}`}
            >
              <SingleQualificationForm
                q={q}
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


// ============= 3. Main Component =============
export default function Step2Qualifications({
  formData,
  handleInputChange,
  errors = {},
  forceShowError = false,
}) {
  const { t } = useTranslation();

  const [qualifications, setQualifications] = useState(
    formData.qualifications && formData.qualifications.length
      ? formData.qualifications
      : [
          {
            id: 1,
            qualification: "",
            university: "",
            graduationYear: "",
            additionalCert: "",
            certificates: "",
            certFiles: [],
            isOpen: true,
          },
        ]
  );

  useEffect(() => {
    if (formData.qualifications && formData.qualifications.length) {
      setQualifications(formData.qualifications);
    }
  }, [formData.qualifications]);

  const toggleAccordion = (id) => {
    setQualifications((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isOpen: !q.isOpen } : q))
    );
  };

  const handleQualificationChange = (id, field, value) => {
    const updatedQualifications = qualifications.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );

    setQualifications(updatedQualifications);

    handleInputChange({
      target: {
        name: "qualifications",
        value: updatedQualifications,
      },
    });
  };

  const addNewQualification = () => {
    const newId = qualifications.length ? Math.max(...qualifications.map((q) => q.id)) + 1 : 1;
    const newQ = {
      id: newId,
      qualification: "",
      university: "",
      graduationYear: "",
      additionalCert: "",
      certificates: "",
      certFiles: [],
      isOpen: true,
    };

    const updatedQualifications = [...qualifications, newQ];
    setQualifications(updatedQualifications);

    handleInputChange({
      target: {
        name: "qualifications",
        value: updatedQualifications,
      },
    });
  };

  const deleteQualification = (id) => {
    const updatedQualifications = qualifications.filter((item) => item.id !== id);
    setQualifications(updatedQualifications);

    handleInputChange({
      target: {
        name: "qualifications",
        value: updatedQualifications,
      },
    });
  };

  return (
    <div className="dc-userexperience dc-tabsinfo">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SectionTitle icon={<PiCertificateThin />} title={t("qualificationsInfo.title")} />

        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            addNewQualification();
          }}
        >
          {t("qualificationsInfo.addNew")}
        </a>
      </div>

      {forceShowError && errors.qualifications && (
        <div className="alert alert-danger">{errors.qualifications}</div>
      )}

      {qualifications.length === 0 ? (
        <div className="alert alert-info">{t("qualificationsInfo.noQualifications")}</div>
      ) : qualifications.length === 1 ? (
        <SingleQualificationForm
          q={qualifications[0]}
          index={0}
          errors={errors}
          forceShowError={forceShowError}
          handleInputChange={handleQualificationChange}
        />
      ) : (
        <QualificationsAccordion
          qualifications={qualifications}
          toggleAccordion={toggleAccordion}
          handleInputChange={handleQualificationChange}
          errors={errors}
          forceShowError={forceShowError}
          setQualifications={setQualifications}
        />
      )}
    </div>
  );
}
