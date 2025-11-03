import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaUniversity,
  FaCalendarAlt,
  FaAward,
  FaCloudUploadAlt,
  FaUpload,
} from "react-icons/fa";
import { PiCertificateThin } from "react-icons/pi";
import { MdSchool } from "react-icons/md";
import { IoIosRibbon } from "react-icons/io";
import { getQualificationOptions } from "../../../constants/formOptions";
import CustomAccordion from "../../shareds/CustomAccordion";

export default function Step2Qualifications({
  formData,
  handleInputChange,
  errors = {},
  forceShowError = false,
}) {
  const { t } = useTranslation();
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    const quals =
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
              isExpanded: true,
            },
          ];

    setQualifications(
      quals.map((q) => ({
        ...q,
        isExpanded: quals.length === 1 ? true : q.isExpanded ?? false,
      }))
    );
  }, [formData.qualifications]);

  const handleQualificationChange = (id, field, value) => {
    const updatedQualifications = qualifications.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );
    setQualifications(updatedQualifications);
    const cleaned = updatedQualifications.map(({ isExpanded, ...rest }) => rest);
    handleInputChange({
      target: {
        name: "qualifications",
        value: cleaned,
      },
    });
  };

  const addNewQualification = () => {
    const newId = qualifications.length
      ? Math.max(...qualifications.map((q) => q.id)) + 1
      : 1;
    const newQ = {
      id: newId,
      qualification: "",
      university: "",
      graduationYear: "",
      additionalCert: "",
      certificates: "",
      certFiles: [],
      isExpanded: true,
    };
    const updatedQualifications = [...qualifications, newQ];
    setQualifications(updatedQualifications);
    const cleaned = updatedQualifications.map(({ isExpanded, ...rest }) => rest);
    handleInputChange({
      target: {
        name: "qualifications",
        value: cleaned,
      },
    });
  };

  const formFields = [
    {
      type: "select",
      name: "qualification",
      label: t("qualificationsInfo.qualification.label"),
      options: getQualificationOptions(t),
      icon: <IoIosRibbon />,
      half: true,
    },
    {
      type: "text",
      name: "university",
      label: t("qualificationsInfo.university.label"),
      placeholder: t("qualificationsInfo.university.placeholder"),
      icon: <FaUniversity />,
      half: true,
    },
    {
      type: "number",
      name: "graduationYear",
      label: t("qualificationsInfo.graduationYear.label"),
      placeholder: t("qualificationsInfo.graduationYear.placeholder"),
      icon: <FaCalendarAlt />,
      min: "1900",
      max: new Date().getFullYear(),
      half: true,
    },
    {
      type: "text",
      name: "additionalCert",
      label: t("qualificationsInfo.additionalCert.label"),
      placeholder: t("qualificationsInfo.additionalCert.placeholder"),
      icon: <FaAward />,
      half: true,
    },
    {
      type: "textarea",
      name: "certificates",
      label: t("qualificationsInfo.certificates.label"),
      placeholder: t("qualificationsInfo.certificates.placeholder"),
      icon: <MdSchool />,
    },
    {
      type: "file",
      name: "certFiles",
      label: t("qualificationsInfo.certFiles.label"),
      accept: ".pdf,.jpg,.jpeg,.png",
      icon: <FaCloudUploadAlt />,
      buttonIcon: <FaUpload />,
      hint: "Upload Certificates & Qualifications",
    },
  ];

  return (
    <CustomAccordion
      noHedarBefore={true}
      title={t("qualificationsInfo.title")}
      titleIcon={<PiCertificateThin />}
      addNewLabel={t("qualificationsInfo.addNew")}
      data={qualifications}
      formFields={formFields}
      onAdd={addNewQualification}
      onDelete={(index) => {
        const id = qualifications[index].id;
        let updatedQualifications = qualifications.filter((q) => q.id !== id);

        if (updatedQualifications.length === 0) {
          updatedQualifications = [
            {
              id: 1,
              qualification: "",
              university: "",
              graduationYear: "",
              additionalCert: "",
              certificates: "",
              certFiles: [],
              isExpanded: true,
            },
          ];
        }

        setQualifications(updatedQualifications);
        const cleaned = updatedQualifications.map(({ isExpanded, ...rest }) => rest);
        handleInputChange({
          target: {
            name: "qualifications",
            value: cleaned,
          },
        });
      }}
      onUpdate={(index, field, value) => {
        const id = qualifications[index].id;
        handleQualificationChange(id, field, value);
      }}
      oneAccordion={true}
      allowMultipleOpen={true}
      liveUpdate={true}
      getItemTitle={(item) =>
        `${item.qualification || t("qualificationsInfo.newQualification")}${
          item.university ? ` (${item.university})` : ""
        }`
      }
      noDataMessage={t("qualificationsInfo.noQualifications")}
      globalError={errors.qualifications}
      forceShowError={forceShowError}
      errors={errors}
      readOnly={false}
    />
  );
}
