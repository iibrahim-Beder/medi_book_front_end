import { Row } from "react-bootstrap";
import { PiUsersThreeLight } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { FiUserCheck } from "react-icons/fi";

import StatCard from "./StatCard";

const PatientStats = () => {
  const stats = [
    {
      title: "Patients",
      value: 168,
      percentage: 3.48,
      isPositive: true,
      icon: PiUsersThreeLight,
      color: "#4CAF50",
    },
    {
      title: "month vistes",
      value: 487,
      percentage: 1.25,
      isPositive: true,
      icon: BsCalendarCheck,
      color: "#2196F3",
    },
    {
      title: "payments",
      value: 485,
      percentage: 0.87,
      isPositive: false,
      icon: IoWarningOutline,
      color: "#F44336",
    },
    {
      title: "Active",
      value: "$62,523",
      percentage: 5.12,
      isPositive: true,
      icon: FiUserCheck,
      color: "#FFC107",
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
