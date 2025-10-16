import { Row } from "react-bootstrap";
import { FaMoneyBillWave, FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import StatCard from "../../patient-management/patients-home-page/components/StatCard";

const DoctorFinanceStats = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t("total Earnings"), 
      value: 12500,
      percentage: 4.5,
      isPositive: true,
      icon: FaMoneyBillWave,
      color: "#3B82F6",
    },
    {
      title: t("pending Payments"),
      value: 2300,
      percentage: 2.1,
      isPositive: false,
      icon: FaWallet,
      color: "#F59E0B",
    },
    {
      title: t("withdrawn Amount"),
      value: 8700,
      percentage: 1.3,
      isPositive: false,
      icon: FaArrowDown,
      color: "#EF4444",
    },
    {
      title: t("monthly Growth"), 
      value: "+8.7%",
      percentage: 8.7,
      isPositive: true,
      icon: FaArrowUp,
      color: "#10B981",
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

export default DoctorFinanceStats;
