import { Row } from "react-bootstrap";
import { PiUsersThreeLight } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { FiUserCheck } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa";
import { GrCompliance } from "react-icons/gr";

import StatCard from "./StatCard";

const PatientStats = () => {
const stats = [
  {
    title: "All Patients",
    value: 168,
    percentage: 3.48,
    isPositive: true,
    icon: FaUsers,
    color: "#3B82F6", // أزرق
  },
  // {
  //   title: "Month Visits",
  //   value: 487,
  //   percentage: 1.25,
  //   isPositive: true,
  //   icon: MdCalendarMonth,
  //   color: "#14B8A6", 
  // },
  {
    title: "Active Patient",
    value: "162",
    percentage: 5.12,
    isPositive: true,
    icon: FaUserCheck,
    color: "#28a745", // أحمر وردي أنعم
  },
  {
    title: "Treatment Completed",
    value: 485,
    percentage: 0.87,
    isPositive: false,
    icon: GrCompliance,
    color: "#14B8A6", // برتقالي ذهبي
  },//#F59E0B
  {
    title: "Stopped Treatment",
    value: "50",
    percentage: 5.12,
    isPositive: true,
    icon: FaUserCheck,
    color: "#F43F5E", // أحمر وردي أنعم
  },
];


  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </Row>
  );
};

export default PatientStats;
