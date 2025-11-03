import React from "react";
import CustomAccordion from "../../shareds/CustomAccordion";

const AcademicQualifications = () => {
  // Sample initial data
  const initialAcademicData = [
    {
      id: 1,
      qualification: "Bachelor of Science in Computer Science",
      university: "University of Technology",
      graduationYear: "2020",
      additionalCertificates: "AWS Certified Solutions Architect",
      certificatesDetails: "Graduated with honors and received Dean's List recognition",
      uploadedFiles: [],
      isExpanded: false
    },
    {
      id: 2,
      qualification: "Master of Business Administration",
      university: "Global Business School",
      graduationYear: "2022",
      additionalCertificates: "PMP Certification",
      certificatesDetails: "Specialized in Project Management and Leadership",
      uploadedFiles: [],
      isExpanded: false
    }
  ];

  const [academicData, setAcademicData] = React.useState(initialAcademicData);

  const formFields = [
    {
      name: "qualification",
      label: "Select qualification",
      type: "select",
      options: [
        { value: "", label: "Select qualification" },
        { value: "highschool", label: "High School Diploma" },
        { value: "associate", label: "Associate Degree" },
        { value: "bachelor", label: "Bachelor's Degree" },
        { value: "master", label: "Master's Degree" },
        { value: "phd", label: "PhD" },
        { value: "diploma", label: "Diploma" },
        { value: "certificate", label: "Professional Certificate" }
      ],
      required: true,
      half: true
    },   {
      name: "graduationYear",
      label: "Graduation Year",
      type: "number",
      placeholder: "Enter graduation year",
      min: 1950,
      max: 2030,
      required: true,
      half: true
    },
    {
      name: "university",
      label: "University name",
      type: "text",
      placeholder: "Enter university or institution name",
      required: true,
      // half:  ,
    },
 
    {
      name: "additionalCertificates",
      label: "Additional Certificates",
      type: "textarea",
      placeholder: "List any additional certificates or specializations",
    },
    {
      name: "certificatesDetails",
      label: "Certificates & Achievements Details",
      type: "textarea",
      placeholder: "Describe your achievements, honors, or special recognitions",
    },
    {
      name: "uploadedFiles",
      label: "Upload Certificates & Qualifications",
      type: "file",
      accept: ".pdf,.jpg,.png,.doc,.docx",
      buttonIcon: "upload",
      hint: "Upload your certificates, diplomas, or qualification documents (PDF, JPG, PNG, DOC)"
    }
  ];

  const handleAddAcademic = () => {
    const newAcademic = {
      id: Date.now(),
      qualification: "",
      university: "",
      graduationYear: "",
      additionalCertificates: "",
      certificatesDetails: "",
      uploadedFiles: [],
      isExpanded: true,
      isNew: true
    };
    setAcademicData(prev => [...prev, newAcademic]);
  };

  const handleDeleteAcademic = (index) => {
    setAcademicData(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAcademic = (index, field, value) => {
    setAcademicData(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveAcademic = (index, itemData) => {
    console.log("Saving academic data:", itemData);
    // Here you would typically make an API call to save the data
    setAcademicData(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, isExpanded: false, isNew: false } : item
      )
    );
  };

  const getAcademicTitle = (item) => {
    if (item.qualification && item.university) {
      return `${item.qualification} - ${item.university}`;
    } else if (item.qualification) {
      return item.qualification;
    } else if (item.university) {
      return item.university;
    }
    return "New Academic Qualification";
  };

  return (
    <div className="academic-qualifications-section">
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
        hint="Please fill in all required fields and upload supporting documents for verification."
        allowMultipleOpen={true}
      />
    </div>
  );
};

export default AcademicQualifications;