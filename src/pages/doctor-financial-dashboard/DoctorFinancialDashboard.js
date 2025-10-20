import { Container, Row } from "react-bootstrap";
import DoctorFinanceStats from "./component/DoctorFinanceStats";
import { Bar, Line, Pie } from "react-chartjs-2";
import DoctorFinanceTable from "./component/DoctorFinanceTable";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa";
import StatCard from "../patient-management/patients-home-page/components/StatCard";
import { useTranslation } from "react-i18next";
import DateRangePicker from "../patient-management/patient-information/PatientTabs/component/DateRangePicker";

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
        data: [1000, 200],
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
        title: t("All bookings"), 
        value: 1200,
        percentage: 4.5,
        isPositive: true,
        icon: FaMoneyBillWave,
        color: "#3B82F6",
      },
      {
        title: t("Completed bookings"),
        value: 1000,
        percentage: 2.1,
        isPositive: true,
        icon: FaWallet,
        color: "#F59E0B",
      },
      {
        title: t("Cancelled bookings"),
        value: 200,
        percentage: 2.1,
        isPositive: false,
        icon: FaWallet,
        color: "#F59E0B",
      },
    ];


  const responsive = {
    responsive: true}
  const options = {
    responsive: true,
 
    scales: {
      x: {
        grid: {
          color: "transparent", // Hide x-axis grid
        },
        ticks: {
          color: "#3fabf3",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: "#ccc", 
        },
        ticks: {
          color: "#3fabf3", 
          stepSize: 200,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Container fluid className="p-4">
        <DoctorFinanceStats/>
        
      {/* Charts */}
      <div className="row mb-4">
        <div className="col-xl-6 col-sm-12 col-12 mb-3">
          <div className="table-card">
            <h5 className="card-title mb-3">Revenue Trend</h5>
            <Line data={revenueChartData} options={options} />
          </div>
        </div>
        <div className="col-xl-6 col-sm-12 col-12 mb-3">
          <div className="table-card">
            <h5 className="card-title mb-3">Branch Revenue</h5>
            <Bar data={branchRevenueChartData} options={options} />
          </div>
        </div>
      </div>
        <div className="table-card mt-4 " > 
          <div className="mb-3" style={{display:"flex", justifyContent:"space-between"}}>

  <div className="table-header">
        <div>
          <h3 className="table-title">bookings stats</h3>
        </div>
      </div>
            <div className="d-flex align-items-center" > 
              <p className="m-0 mr-1">Filter by date :</p>  
          <DateRangePicker/>
          </div>
          </div>
        <Row className="g-3 mb-4 patintStats">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
        <div className="col-xl-3 col-sm-6 col-12"
        //  style={{    width:" 338px", height:"230px", display: "flex"}}
         >
          <div className="table-card" style={{    display: "flex",flexDirection:"column",alignItems: "center"}}>
            <h4 className="text-muted mb-0">Bookings Status</h4>
            <Pie data={statusChartData} options={responsive} />
          </div>
        </div>
    </Row>

        </div>
        <DoctorFinanceTable/>
     
    </Container>
  );
};

export default DoctorFinancialDashboard;
