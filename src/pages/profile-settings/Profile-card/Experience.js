import React, { forwardRef, useImperativeHandle } from "react";
import CustomAccordion from "../../shared/CustomAccordion";
import { useDoctorExperience } from "../hooks/useDoctorExperience";
import CustomAccordionSkeleton from "../../shared/CustomAccordionSkeleton";
import ErrorLoading from "../../shared/ErrorLoading";

const DoctorExperience = forwardRef(({ isNew ,register }, ref) => {


  const {
    handleAddExperience,
    handleDeleteExperience,
    handleUpdateExperience,
    handleSaveExperience,
    isLoading,
    error,
    refetch,
    experiences
  } = useDoctorExperience(isNew);
useImperativeHandle(
  ref,
  () => ({
    submit: async () => {
      const unsavedEducation = experiences.find(
        (edu) => edu.isNew || edu.isExpanded
      );
      console.log("unsavedEducation", unsavedEducation);

      if (!unsavedEducation) {
        return true;
      }

      const index = experiences.findIndex(
        (edu) => edu.id === unsavedEducation.id
      );

      return await handleSaveExperience(index, unsavedEducation);
    },
  }),
  [experiences, handleSaveExperience]
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
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      placeholder: "Enter job title",
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
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your role and responsibilities",
    },
  ];

  const getExperienceTitle = (item) => {
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
        onDelete={handleDeleteExperience}
        onUpdate={handleUpdateExperience}
        onSave={handleSaveExperience}
        getItemTitle={getExperienceTitle}
        noDataMessage="No experience added yet. Click 'Add New Experience' to get started."
        onAdd={isNew ? null: handleAddExperience}
        buttonsAvailable={isNew ? false: true}
        isUpdateOut={isNew}
        MainHint={ register && "You can also add more than one experience from within."}
      />
    </div>
  );
});

export default DoctorExperience;