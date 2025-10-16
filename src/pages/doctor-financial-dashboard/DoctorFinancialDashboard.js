import { Container, Row } from "react-bootstrap";
import DoctorFinanceStats from "./component/DoctorFinanceStats";
import { Bar, Line, Pie } from "react-chartjs-2";
import DoctorFinanceTable from "./component/DoctorFinanceTable";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa";
import StatCard from "../patient-management/patients-home-page/components/StatCard";
import { useTranslation } from "react-i18next";

const DoctorFinancialDashboard = () => {
    const { t } = useTranslation();
    // Charts
  const revenueChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [3500, 4000, 3000, 4500],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statusChartData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        label: "Bookings Status",
        data: [15, 20],
        backgroundColor: ["#198754", "#dc3545"]
      }
    ]
  };

  const branchRevenueChartData = {
    labels: ["Clinic A", "Clinic B", "Clinic C"],
    datasets: [
      {
        label: "Branch Revenue",
        data: [450, 100, 50],
        backgroundColor: ["#0d6efd", "#198754", "#ffc107"]
      }
    ]
  };

  
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
    ];
  return (
    <Container fluid className="p-4">
        <DoctorFinanceStats/>
        
      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="table-card">
            <h5 className="card-title mb-3">Revenue Trend</h5>
            <Line data={revenueChartData} />
          </div>
        </div>
        {/* <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Bookings Status</h5>
            <Pie data={statusChartData} />
          </div>
        </div> */}
        <div className="col-md-6 mb-3">
          <div className="table-card">
            <h5 className="card-title mb-3">Branch Revenue</h5>
            <Bar data={branchRevenueChartData} />
          </div>
        </div>
      </div>
        <DoctorFinanceTable/>
        <Row className="g-3 mb-4 patintStats">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </Row>
     
    </Container>
  );
};

export default DoctorFinancialDashboard;
