// ProfessionalDashboardTabs.jsx
import React, { useMemo, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import 'chart.js/auto';
import CustomAccordion from "../pages/shared/CustomAccordion";
import StarRating from "../pages/shared/StarRating";

const samplePayments = [
  { id: 5001, bookingId: 1, date: "2025-10-05", amount: 150, method: "Stripe", status: "Completed", txRef: "ch_1A2B3C" },
  { id: 5002, bookingId: 2, date: "2025-10-06", amount: 0, method: "Cash", status: "Refunded", txRef: null },
  { id: 5003, bookingId: 3, date: "2025-10-07", amount: 200, method: "Wallet", status: "Completed", txRef: "wal_9Z8Y" }
];

const sampleBranches = [
  { id: "Clinic A", address: "Building 1", hours: "Mon-Fri 09:00-17:00", upcomingBookings: 8 },
  { id: "Clinic B", address: "Building 2", hours: "Mon-Sat 10:00-18:00", upcomingBookings: 3 }
];

const ProfessionalDashboardTabs = () => {
   const [data, setData] = useState([
    {
      id: 1,
      title: "Diabetes",
      date: "2025-10-10",
      type: "Condition",
      isExpanded: false,
      isNew: false,
      description: "Patient has type 2 diabetes",
      severity: "Moderate",
      MedicalCondition: "Diabetes",
      medicalOptions: ["Diabetes", "Asthma", "Hypertension"],
    },
    {
      id: 2,
      title: "Asthma",
      date: "2025-09-05",
      type: "Condition",
      isExpanded: false,
      isNew: false,
      description: "Childhood asthma, uses inhaler",
      severity: "Mild",
      MedicalCondition: "Asthma",
      medicalOptions: ["Diabetes", "Asthma", "Hypertension"],
    },
  ]);

  const formFields = [
    { name: "description", type: "textarea", placeholder: "Enter description" , half: true}  ,
    { name: "severity", type: "select", placeholder: "Select severity", options: ["Mild", "Moderate", "Severe"] },
    { name: "MedicalCondition", type: "dropdown" },
  ];

  // إضافة عنصر جديد
  const handleAdd = () => {
    setData([
      ...data,
      {
        id: Date.now(),
        title: "New Condition",
        date: new Date().toISOString().split("T")[0],
        type: "Condition",
        isExpanded: true,
        isNew: true,
        description: "",
        severity: "",
        MedicalCondition: "",
        medicalOptions: ["Diabetes", "Asthma", "Hypertension"],
      },
    ]);
  };

  // تحديث البيانات
  const handleUpdate = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  // حذف
  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  // حفظ
  const handleSave = (index, itemData) => {
    const newData = [...data];
    newData[index] = { ...itemData, isNew: false, isExpanded: false };
    setData(newData);
  };

  return (
    <table className="table">
      <tbody>
        <tr>
          <td>John Doe</td>
          <StarRating rating={1} /> {/* ⭐⭐⭐⭐☆ */}
        </tr>
        <tr>
          <td>Jane Smith</td>
          <StarRating rating={3} /> {/* ⭐⭐⭐☆☆ */}
        </tr>
      </tbody>
    </table>
  );
};

export default ProfessionalDashboardTabs;
