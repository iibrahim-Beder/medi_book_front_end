import React, { useState } from "react";
import CustomAccordion from "../../shareds/CustomAccordion"; // المسار حسب مكان الكمبوننت عندك

const DoctorExperienceComponent = () => {
  const [experienceData, setExperienceData] = useState([  
    {
      companyTitle: " the example company",
      jobTitle: " the example job",
      startingDate: " the example date",
      endingDate: " the example date",
      description: " the example description",
      isNew: true,
      isExpanded: true,
    },
  ]);

  const handleAdd = () => {
    setExperienceData((prev) => [
      ...prev,
      {
        companyTitle: "",
        jobTitle: "",
        startingDate: "",
        endingDate: "",
        description: "",
        isNew: true,
        isExpanded: true,
      },
    ]);
  };

  const handleUpdate = (index, field, value) => {
    setExperienceData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDelete = (index) => {
    setExperienceData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (index, itemData) => {
    setExperienceData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...itemData, isNew: false, isExpanded: false } : item
      )
    );
  };

  const formFields = [
    { name: "companyTitle", label: "Company Title", type: "text" ,half:true  },
    { name: "jobTitle", label: "Your Job Title", type: "text",half:true },
    { name: "startingDate", label: "Starting Date", type: "date" ,half:true }, 
    { 
      name: "endingDate", 
      label: "Ending Date *", 
      type: "date", 
      half: true,
    },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <CustomAccordion
      title="Work Experience"
      addNewLabel="Add New Experience"
      data={experienceData}
      formFields={formFields}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onSave={handleSave}
      getItemTitle={(item) => item.companyTitle || "New Experience"}
      hint="If you are still working here, leave the ending date empty."
      noDataMessage="No work experiences added yet."
    />
  );
};

export default DoctorExperienceComponent;
