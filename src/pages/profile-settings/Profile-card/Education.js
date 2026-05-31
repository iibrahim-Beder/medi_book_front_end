import React, { forwardRef, useImperativeHandle } from "react";
import CustomAccordion from "../../shared/CustomAccordion";
import { useDoctorEducation } from "../hooks/useDoctorEducation";
import CustomAccordionSkeleton from "../../shared/CustomAccordionSkeleton";
import ErrorLoading from "../../shared/ErrorLoading";
import { formatDate } from "../../shared/utils";
const AcademicQualifications = forwardRef(({ isNew ,register}, ref) => {
  const {
    handleAddAcademic,
    handleDeleteAcademic,
    handleUpdateAcademic,
    handleSaveAcademic,
    isLoading,
    error,
    refetch,
    educations,
    errors
  } = useDoctorEducation(isNew);
useImperativeHandle(
  ref,
  () => ({
    submit: async () => {
      if (isNew) {
        const unsavedEducations = educations.filter(
          edu => edu.isNew || edu.isExpanded
        );

        if (!unsavedEducations.length) {
          return true;
        }

        return await handleSaveAcademic(
          null,
          unsavedEducations
        );
      }

      const unsavedEducation = educations.find(
        edu => edu.isNew || edu.isExpanded
      );

      if (!unsavedEducation) return true;

      const index = educations.findIndex(
        edu => edu.id === unsavedEducation.id
      );

      return await handleSaveAcademic(
        index,
        unsavedEducation
      );
    },
  }),
  [educations, handleSaveAcademic, isNew]
);
  if (isLoading)
    return <CustomAccordionSkeleton number={3} className={"d-grid"} />;
  if (error) return <ErrorLoading error={error} refetch={refetch} />;
  const formFields = [
    {
      name: "institutionName",
      label: "institution Name",
      type: "text",
      placeholder: "Enter institution name",
      half: true,
    },
    {
      name: "graduationYear",
      label: "Graduation Year",
      type: "date",
      placeholder: "Enter graduation year",
      half: true,
    },
    {
      name: "major",
      label: "Major",
      type: "text",
      placeholder: "Enter university or institution name",
      half: true,
    },
    {
      name: "degree",
      label: "Degree",
      type: "select",
      options: [
        "select degree",
        "MBBS",
        "MD",
        "DO",
        "BMBS",
        "BDS",
        "DDS",
        "MDS",
        "MS",
        "MSc",
        "PhD",
        "MPH",
        "Residency",
        "Fellowship",
        "DNB",
        "DM",
        "MCh",
        "Other",
      ],
      placeholder: "Enter degree name",
      half: true,
    },

    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      half: true,
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      half: true,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter notes (if any) about your academic qualifications",
    },
    {
      name: "uploadedFiles",
      label: "Upload Certificates & Qualifications",
      type: "file",
      accept: ".pdf,.jpg,.png,.doc,.docx",
      buttonIcon: "upload",
      hint: "Upload your certificates, diplomas, or qualification documents (PDF, JPG, PNG, DOC)",
    },
  ];

  const getAcademicTitle = (item) => {
    if (
      item.institutionName &&
      item.graduationYear &&
      item.degree &&
      item.major
    ) {
      return `${item.institutionName} - ${item.major} - ${item.degree}  - ${formatDate( item.graduationYear)}`;
    } else if (item.institutionName && item.graduationYear && item.degree) {
      return `${item.institutionName} - ${item.degree}  - ${formatDate(item.graduationYear)}`;
    } else if (item.institutionName && item.graduationYear) {
      return `${item.institutionName} - ${formatDate(item.graduationYear)}`;
    }
    return "New Academic Qualification";
  };

  return (
    <div className="academic-qualifications-section accordion-table-card">
      <CustomAccordion
        oneAccordion={true}
        title="Academic Qualifications"
        addNewLabel="Add New Qualification"
        data={educations}
        formFields={formFields}
        onAdd={handleAddAcademic}
        buttonsAvailable={isNew ? false: true}
        onDelete={!register && handleDeleteAcademic}
        onUpdate={handleUpdateAcademic}
        onSave={handleSaveAcademic}
        getItemTitle={getAcademicTitle}
        noDataMessage="No academic qualifications added yet. Click 'Add New Qualification' to get started."
        isUpdateOut={true}
        // backgroundColor="#f8f9fa"
        // titleBackgroundColor="#e3f2fd"
        // allowMultipleOpen={true}
        MainHint={register && "You can also add or delete qualifications from inside."}
        errors={errors}
        forceShowError={true}
      />
    </div>
  );
});

export default AcademicQualifications;
