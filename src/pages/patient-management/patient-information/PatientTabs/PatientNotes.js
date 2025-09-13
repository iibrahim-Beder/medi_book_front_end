import React from "react";
import CustomAccordion from "../../../shared/CustomAccordion";

export default function PatientBasicInfo() {

  return (
    <div className="dc-haslayout dc-dbsectionspace">
      <div
        className="dc-dashboardbox"
        style={{ background: "none", boxShadow: "none" }}
      >
       
        <CustomAccordion
          title="Notes"
          addNewLabel="Add Note"
          data={[
            {
              type: "Medical",
              icon: "",
              date: "2025-09-13",
              content: "Patient requires monitoring.",
            },
            {
              type: "Follow-up",
              icon: "",
              date: "2025-09-10",
              content: "Schedule follow-up in 2 weeks.",
            },
          ]}
          formFields={[
            {
              name: "type",
              type: "select",
              options: [
                "Medical",
                "Follow-up",
                "Behavioral",
                "Communication",
                "Administrative",
                "Urgent",
              ],
              placeholder: "Select Note Type",
              half: true,
            },
            { name: "date", type: "date", placeholder: "Date", half: true },
            { name: "content", type: "textarea", placeholder: "Note Content" },
          ]}
          onAdd={() => alert("Add Note")}
          onDelete={(index) => alert("Delete note " + index)}
        />
      </div>
    </div>
  );
}
