import React, { useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import 'chart.js/auto';
import DiagnosisMobileView from "../pages/patient-management/patient-information/PatientTabs/dignosis/DiagnosisMobileView";
const ProfessionalDashboard = () => {
    const diseasesData = [
      {
        id: "#DZ001",
        diagnosisName: "Diabetes Mellitus Type 2",
        symptomsDescription: "Increased thirst, frequent urination, fatigue, blurred vision",
        diagnosisDescription: "Chronic condition affecting the way the body processes blood sugar",
        diagnosedConditions: [

          
          { MedicalCondition: "Diabetic Retinopathy", Severity: "Moderate", note: "Requires regular monitoring" },
          { MedicalCondition: "Hypertension", Severity: "severe", note: "patient has high blood pressure" },
        ],
        notes: [
          {  content: "Patient started on Metformin 500mg twice daily" },
          {  content: "Blood sugar levels improving with medication" },
        ],
        prescription: [
          {
            id: "RX001",
            title: "Diabetes Management",
            status:"completed" ,
            isExpanded: false,
            note: "Patient requires regular monitoring",
            recipes: [
              { type: "medication", durationInDays: 30, instructions: "Patient started on Metformin 500mg twice daily", dosage: "2 tablets per day" },
              { type: "referral", durationInDays: 20, instructions: "Referred to ophthalmologist for regular checkups", dosage: "5 times per week" },
            ]
          },
          {
            id: "RX002",
            title: "Eye Care",
            date: "2025-03-20",
            isExpanded: false,
            type: "Specialist",
            recipes: [
              { type: "Referral", date: "2025-03-20", content: "Referred to ophthalmologist for regular checkups" },
            ]
          }
        ],
      },
      // other diseases here...
    ];

  return (
      <DiagnosisMobileView diseasesData={diseasesData}/>
  );
};

export default ProfessionalDashboard;
