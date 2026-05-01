import React from "react";
import CustomAccordion from "../../shared/CustomAccordion";
import { useDoctorEducation } from "../hooks/useDoctorEducation";
import CustomAccordionSkeleton from "../../shared/CustomAccordionSkeleton";
import ErrorLoading from "../../shared/ErrorLoading";
const AcademicQualifications = () => {
  const doctorId = 103;

  const [academicData, setAcademicData] = React.useState([]);

  const {
    handleAddAcademic,
    handleDeleteAcademic,
    handleUpdateAcademic,
    handleSaveAcademic,
    isLoading,
    error,
    refetch,
  } = useDoctorEducation(doctorId, academicData, setAcademicData);
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
      type: "number",
      placeholder: "Enter graduation year",
      min: 1950,
      max: 2030,
      required: true,
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
    if (item.institutionName && item.graduationYear && item.degree && item.major) {
      return `${item.institutionName} - ${item.major} - ${item.degree}  - ${item.graduationYear}`;
    } else if (item.institutionName && item.graduationYear && item.degree) {
      return `${item.institutionName} - ${item.degree}  - ${item.graduationYear}`;
    }else if (item.institutionName && item.graduationYear) {
      return `${item.institutionName} - ${item.graduationYear}`;
    }
    return "New Academic Qualification";
  };

  return (
    <div className="academic-qualifications-section accordion-table-card">
      <CustomAccordion
        oneAccordion={true}
        title="Academic Qualifications"
        addNewLabel="Add New Qualification"
        data={academicData}
        formFields={formFields}
        onAdd={handleAddAcademic}
        onDelete={handleDeleteAcademic}
        onUpdate={handleUpdateAcademic}
        onSave={handleSaveAcademic}
        getItemTitle={getAcademicTitle}
        noDataMessage="No academic qualifications added yet. Click 'Add New Qualification' to get started."
        // backgroundColor="#f8f9fa"
        // titleBackgroundColor="#e3f2fd"
        // allowMultipleOpen={true}
      />
    </div>
  );
};

export default AcademicQualifications;
