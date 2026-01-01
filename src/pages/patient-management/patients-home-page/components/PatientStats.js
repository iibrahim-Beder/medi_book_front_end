import { Row } from "react-bootstrap";
import { FaUsers, FaUserCheck } from "react-icons/fa";
import { GrCompliance } from "react-icons/gr";
import { useTranslation } from "react-i18next";

import StatCard from "./StatCard";

const PatientStats = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t("allPatients"),
      value: 168,
      percentage: 3.48,
      isPositive: true,
      icon: '/images/card-icon/patients.png',
      color: "#3B82F6",
    },
    {
      title: t("activePatients"),
      value: 162,
      percentage: 5.12,
      isPositive: true,
      icon:'/images/card-icon/active-patient1.png',
      color: "#28a745",
    },
    {
      title: t("treatmentCompleted"),
      value: 485,
      percentage: 0.87,
      isPositive: false,
      icon: '/images/card-icon/completed.png',
      color: "#14B8A6",
    },
    {
      title: t("stoppedTreatment"),
      value: 50,
      percentage: 5.12,
      isPositive: true,
      icon: '/images/card-icon/stopped-treatment.png',
      color: "#F43F5E",
    },
  ];

  return (
    <Row className="g-3 mb-4 patintStats">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </Row>
  );
};

export default PatientStats;
