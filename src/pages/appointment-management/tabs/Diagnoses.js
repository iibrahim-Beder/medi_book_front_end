import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import TestAccordion from "../../shared/TwoLevelAccordion";
import NestedAccordion from "../../shared/NestedAccordion";
const Diagnoses = () => {
  const { t } = useTranslation();

  return (
    <div className="dc-yourdetails dc-tabsinfo" style={{backgroundColor:"#FFFF", padding:"20px", borderRadius:"8px", height:"100%" ,boxShadow: "0 0 7px #eee"}}> 

         <NestedAccordion 
         backgroundColor="#fff"
          title="Diagnostic information"
     addNewLabel="Add Diagnostic"
     data={[
    {
       type: "Medication", 
      icon: "" ,
      date: "2025-09-13",
      content: "Paracetamol 500mg twice daily after meals.",
    },
    {
      type: "Follow-up",
      icon: "",
      date: "2025-09-10",
      content: "Repeat lab tests in 2 weeks.",
    },
  ]}
  formFields={[
    {
      name: "type",
      type: "select",
      options: [
        "Medication",
        "Follow-up",
        "Behavioral",
        "Communication",
        "Administrative",
        "Urgent",
      ],
      placeholder: "Select Prescription Type",
      half: true,
    },
    { name: "date", type: "date", placeholder: "Date", half: true },
    { name: "content", type: "textarea", placeholder: "Prescription Details" },
  ]}
  onAdd={() => alert("Add Prescription")}
  onDelete={(index) => alert("Delete prescription " + (index + 1))}
/>
    </div>
  );
};

export default Diagnoses;
