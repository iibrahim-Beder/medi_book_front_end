import Button from "@mui/material/Button";
import { useStep1PersonalInfo } from "../pages/doctor-registration/hooks/useStep1BasicInfo";
// import "./pageNotFoundAndErrorPage.css";
import { FaUsers } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoStarOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useState } from "react";
import AppointmentsPage from "../pages/appointmentList/AppointmentsPage";
import DoctorFinancialDashboard from "../pages/doctor-financial-dashboard/DoctorFinancialDashboard";
import PatientManagement from "../pages/patient-management/patients-home-page/PatientManagement";
import ReviewsPage from "../pages/reviews/ReviewsPage";
import { BsList } from "react-icons/bs";
export default function ErrorPage() {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="">
      <div style={{ zIndex:"7" , position: "relative"}}>
        <AnalyticsTabs activeTab={activeTab} setActiveTab={setActiveTab} /> 
      </div>

      {activeTab === "patients" && <PatientManagement />}
      {activeTab === "appointments" && <AppointmentsPage />}
      {activeTab === "reviews" && <ReviewsPage />}
      {activeTab === "finance" && <DoctorFinancialDashboard />}
    </div>
  );
}

const analyticsTabs = [
  {
    id: "appointments",
    label: "Appointments",
    icon: <BsList className="icon" />,
  },
  {
    id: "patients",
    label: "Patients",
    icon: <FaUsers />,
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: <IoStarOutline />,
  },
  {
    id: "finance",
    label: "Finance",
    icon: <HiOutlineCurrencyDollar />,
  },
];

export function AnalyticsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="analytics-tabs">
      {analyticsTabs.map((tab) => (
        <button
          key={tab.id}
          className={`analytics-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="analytics-tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
