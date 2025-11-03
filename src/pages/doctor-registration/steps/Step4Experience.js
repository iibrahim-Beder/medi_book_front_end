import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBuilding,
  FaCalendarAlt,
  FaUserTie,
  FaRegFileAlt,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import CustomAccordion from "../../shareds/CustomAccordion";

export default function Step4Experience({
  initialExperiences = [],
  onChange = () => {},
  ComponentProp,
  header = true,
  errors = {},
  forceShowError = false,
}) {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const exps = initialExperiences && initialExperiences.length
      ? initialExperiences
      : [
          {
            id: 1,
            companyTitle: "",
            startingDate: "",
            endingDate: "",
            jobTitle: "",
            description: "",
            isExpanded: true,
          },
        ];

    setExperiences(
      exps.map((exp) => ({
        ...exp,
        isExpanded: exps.length === 1 ? true : exp.isExpanded ?? false,
      }))
    );
  }, [initialExperiences]);

  const handleExperienceChange = (id, field, value) => {
    const updatedExperiences = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    const cleaned = updatedExperiences.map(({ isExpanded, ...rest }) => rest);
    onChange(cleaned);
  };

  const addNewExperience = () => {
    const newId = experiences.length
      ? Math.max(...experiences.map((exp) => exp.id)) + 1
      : 1;
    const newExp = {
      id: newId,
      companyTitle: "",
      startingDate: "",
      endingDate: "",
      jobTitle: "",
      description: "",
      isExpanded: true,
    };
    const updatedExperiences = [...experiences, newExp];
    setExperiences(updatedExperiences);
    const cleaned = updatedExperiences.map(({ isExpanded, ...rest }) => rest);
    onChange(cleaned);
  };

  const formFields = [
    {
      type: "text",
      name: "companyTitle",
      label: t("userExperience.companyTitle"),
      placeholder: t("userExperience.companyTitle"),
      icon: <FaBuilding />,
      half: true,
    },
    {
      type: "text",
      name: "jobTitle",
      label: t("userExperience.jobTitle"),
      placeholder: t("userExperience.jobTitle"),
      icon: <FaUserTie />,
      half: true,
    },
    {
      type: "date",
      name: "startingDate",
      label: t("userExperience.startingDate"),
      placeholder: t("userExperience.startingDate"),
      icon: <FaCalendarAlt />,
      half: true,
    },
    {
      type: "date",
      name: "endingDate",
      label: t("userExperience.endingDate"),
      placeholder: t("userExperience.endingDate"),
      icon: <FaCalendarAlt />,
      half: true,
    },
    {
      type: "textarea",
      name: "description",
      label: t("userExperience.jobDescription"),
      placeholder: t("userExperience.jobDescription"),
      icon: <FaRegFileAlt />,
    },
  ];

  return (
    <CustomAccordion
      noHeaderBefore={true}
      title={t("userExperience.addYourExperience")}
      titleIcon={<MdWork />}
      addNewLabel={t("userExperience.addNew")}
      data={experiences}
      formFields={formFields}
      onAdd={addNewExperience}
      onDelete={(index) => {
        const id = experiences[index].id;
        let updatedExperiences = experiences.filter((exp) => exp.id !== id);

        if (updatedExperiences.length === 0) {
          updatedExperiences = [
            {
              id: 1,
              companyTitle: "",
              startingDate: "",
              endingDate: "",
              jobTitle: "",
              description: "",
              isExpanded: true,
            },
          ];
        }

        setExperiences(updatedExperiences);
        const cleaned = updatedExperiences.map(({ isExpanded, ...rest }) => rest);
        onChange(cleaned);
      }}
      onUpdate={(index, field, value) => {
        const id = experiences[index].id;
        handleExperienceChange(id, field, value);
      }}
      oneAccordion={true}
      allowMultipleOpen={true}
      liveUpdate={true}
      getItemTitle={(item) =>
        `${item.companyTitle || t("userExperience.newExperience")}${
          item.jobTitle ? ` - ${item.jobTitle}` : ""
        }`
      }
      noDataMessage={t("userExperience.noExperiences")}
      globalError={errors.experiences}
      forceShowError={forceShowError}
      errors={errors}
      readOnly={false}
      ComponentProp={ComponentProp}
      header={header}
    />
  );
}