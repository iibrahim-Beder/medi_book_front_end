import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import 'chart.js/auto';

const sampleBookings = [
  {
    patient: "John Doe",
    date: "2025-10-05",
    time: "10:00 AM",
    status: "Completed",
    amount: 150,
    paymentMethod: "Stripe",
    branch: "Clinic A",
    notes: "Follow-up needed",
    diagnosis: "Flu",
    medication: "Paracetamol"
  },
  {
    patient: "Jane Smith",
    date: "2025-10-06",
    time: "02:00 PM",
    status: "Cancelled",
    amount: 0,
    paymentMethod: "Cash",
    branch: "Clinic B",
    notes: "Patient no-show",
    diagnosis: "",
    medication: ""
  },
  {
    patient: "Ali Hassan",
    date: "2025-10-07",
    time: "11:00 AM",
    status: "Completed",
    amount: 200,
    paymentMethod: "Wallet",
    branch: "Clinic A",
    notes: "",
    diagnosis: "Allergy",
    medication: "Antihistamine"
  },
];

const FinancialDashboard = () => {
  const [bookings, setBookings] = useState(sampleBookings);
  const [modalData, setModalData] = useState(null);

  // Summary Cards calculation
  const totalBookings = bookings.length;
  const completed = bookings.filter(b => b.status === "Completed").length;
  const cancelled = bookings.filter(b => b.status === "Cancelled").length;
  const totalRevenue = bookings.reduce((acc, b) => acc + b.amount, 0);

  // Charts data
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
        data: [completed, cancelled],
        backgroundColor: ["#198754", "#dc3545"]
      }
    ]
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Financial Dashboard</h1>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Bookings</h6>
              <h4 className="card-title">{totalBookings}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Completed</h6>
              <h4 className="card-title text-success">{completed}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Cancelled</h6>
              <h4 className="card-title text-danger">{cancelled}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Revenue</h6>
              <h4 className="card-title text-primary">${totalRevenue}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Revenue Trend</h5>
            <Line data={revenueChartData} />
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Bookings Status</h5>
            <Pie data={statusChartData} />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Recent Bookings</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Branch</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.patient}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td className={b.status === "Completed" ? "text-success" : "text-danger"}>{b.status}</td>
                    <td>${b.amount}</td>
                    <td>{b.branch}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => setModalData(b)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Booking Details */}
      {modalData && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button type="button" className="btn-close" onClick={() => setModalData(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient:</strong> {modalData.patient}</p>
                <p><strong>Date & Time:</strong> {modalData.date} {modalData.time}</p>
                <p><strong>Status:</strong> {modalData.status}</p>
                <p><strong>Amount:</strong> ${modalData.amount}</p>
                <p><strong>Payment:</strong> {modalData.paymentMethod}</p>
                <p><strong>Branch:</strong> {modalData.branch}</p>
                <p><strong>Diagnosis:</strong> {modalData.diagnosis || "-"}</p>
                <p><strong>Medication:</strong> {modalData.medication || "-"}</p>
                <p><strong>Notes:</strong> {modalData.notes || "-"}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalData(null)}>Close</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
