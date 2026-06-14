import React, { forwardRef, useImperativeHandle } from "react";
import CustomAccordion from "../../shared/CustomAccordion";
import { useDoctorExperience } from "../hooks/useDoctorExperience";
import CustomAccordionSkeleton from "../../shared/CustomAccordionSkeleton";
import ErrorLoading from "../../shared/ErrorLoading";
import { formatDate } from "../../shared/utils";

const DoctorExperience = forwardRef(({ isNew ,register }, ref) => {


  const {
    handleAddExperience,
    handleDeleteExperience,
    handleUpdateExperience,
    handleSaveExperience,
    isLoading,
    error,
    refetch,
    experiences,
    errors
  } = useDoctorExperience(isNew);
useImperativeHandle(
  ref,
  () => ({
    submit: async () => {
      if (isNew) {
        const unsavedExperiences = experiences.filter(
          exp => exp.isNew || exp.isExpanded
        );

        if (!unsavedExperiences.length) {
          return true;
        }

        return await handleSaveExperience(
          null,
          unsavedExperiences
        );
      }

      const unsavedExperience = experiences.find(
        exp => exp.isNew || exp.isExpanded
      );

      if (!unsavedExperience) {
        return true;
      }

      const index = experiences.findIndex(
        exp => exp.id === unsavedExperience.id
      );

      return await handleSaveExperience(
        index,
        unsavedExperience
      );
    },
  }),
  [experiences, handleSaveExperience, isNew]
);
  if (isLoading)
    return <CustomAccordionSkeleton number={3} className={"d-grid"} />;

  if (error) return <ErrorLoading error={error} refetch={refetch} />;

  const formFields = [
    {
      name: "workplace",
      label: "Workplace",
      type: "text",
      placeholder: "Enter workplace name",
      half: true,
      required: true,
      requiredErrorMessage: "Workplace name is required"
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      placeholder: "Enter job title",
      half: true,
      required: true,
      requiredErrorMessage: "Job title is required"
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      half: true,
      required: true,
      requiredErrorMessage: "Start date is required"
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      half: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your role and responsibilities",
    },
  ];

  const getExperienceTitle = (item) => {
    if (item.workplace && item.jobTitle && item.startDate) {
      return `${item.jobTitle} - ${item.workplace} - ${formatDate(item.startDate)}`;
    }
    if (item.workplace && item.jobTitle) {
      return `${item.jobTitle} - ${item.workplace}`;
    } else if (item.workplace) {
      return item.workplace;
    }
    return "New Experience";
  };

  return (
    <div className="doctor-experience-section accordion-table-card">
      <CustomAccordion
        oneAccordion={true}
        title="Professional Experience"
        addNewLabel="Add New Experience"
        data={experiences}
        formFields={formFields}
        // onAdd={handleAddExperience}
        onDelete={(!register || isNew ) && handleDeleteExperience}
        onUpdate={handleUpdateExperience}
        onSave={handleSaveExperience}
        getItemTitle={getExperienceTitle}
        noDataMessage="No experience added yet. Click 'Add New Experience' to get started."
        onAdd={handleAddExperience}
        buttonsAvailable={isNew ? false: true}
        isUpdateOut={isNew ? true : false}
        MainHint={ register && "You can also add or delete experiences from inside."}
        errors={errors}
        forceShowError={true}
      />
    </div>
  );
});

export default DoctorExperience;