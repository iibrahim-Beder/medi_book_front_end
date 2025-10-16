import React, { useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import 'chart.js/auto';

// بيانات تجريبية متقدمة لكل التفاصيل
const sampleBookings = [
  {
    patient: "John Doe",
    age: 30,
    gender: "Male",
    address: "123 Main St",
    date: "2025-10-05",
    time: "10:00 AM",
    branch: "Clinic A",
    status: "Completed",
    totalAmount: 200,
    paid: 150,
    outstanding: 50,
    paymentMethod: "Stripe",
    refund: 0,
    notes: "Follow-up needed for blood test",
    diagnosis: "Flu",
    medication: "Paracetamol",
    allergies: "None",
    hereditaryDiseases: "None",
    previousAppointments: [
      { date: "2025-09-01", diagnosis: "Cold", medication: "Vitamin C" },
      { date: "2025-08-15", diagnosis: "Headache", medication: "Ibuprofen" }
    ],
    cancellations: [
      { date: "2025-07-20", reason: "Patient no-show", refund: 50 }
    ],
    calls: [
      { type: "Video", duration: "15 min", date: "2025-10-05" }
    ]
  },
  {
    patient: "Jane Smith",
    age: 25,
    gender: "Female",
    address: "456 Elm St",
    date: "2025-10-06",
    branch: "Clinic B",
    status: "Cancelled",
    totalAmount: 100,
    paid: 0,
    outstanding: 100,
    paymentMethod: "Cash",
    refund: 50,
    notes: "Patient no-show",
    diagnosis: "",
    medication: "",
    allergies: "Peanuts",
    hereditaryDiseases: "Diabetes",
    previousAppointments: [
      { date: "2025-09-10", diagnosis: "Allergy", medication: "Antihistamine" }
    ],
    cancellations: [
      { date: "2025-10-06", reason: "No-show", refund: 50 }
    ],
    calls: []
  },
  {
    patient: "Ali Hassan",
    age: 40,
    gender: "Male",
    address: "789 Oak St",
    date: "2025-10-07",
    branch: "Clinic A",
    status: "Completed",
    totalAmount: 250,
    paid: 200,
    outstanding: 50,
    paymentMethod: "Wallet",
    refund: 0,
    notes: "Allergy treatment follow-up",
    diagnosis: "Allergy",
    medication: "Antihistamine",
    allergies: "Pollen",
    hereditaryDiseases: "Asthma",
    previousAppointments: [
      { date: "2025-09-20", diagnosis: "Allergy", medication: "Antihistamine" }
    ],
    cancellations: [],
    calls: [
      { type: "Audio", duration: "10 min", date: "2025-10-07" }
    ]
  }
];

const ProfessionalDashboard = () => {
  const [bookings, setBookings] = useState(sampleBookings);
  const [modalData, setModalData] = useState(null);

  // الحسابات الملخصة
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = bookings.reduce((acc, b) => acc + b.paid, 0);
  const totalOutstanding = bookings.reduce((acc, b) => acc + b.outstanding, 0);
  const totalRefund = bookings.reduce((acc, b) => acc + b.refund, 0);
  const completed = bookings.filter(b => b.status === "Completed").length;
  const cancelled = bookings.filter(b => b.status === "Cancelled").length;

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
        data: [completed, cancelled],
        backgroundColor: ["#198754", "#dc3545"]
      }
    ]
  };

  const branchRevenueChartData = {
    labels: ["Clinic A", "Clinic B", "Clinic C"],
    datasets: [
      {
        label: "Branch Revenue",
        data: [450, 100, 0],
        backgroundColor: ["#0d6efd", "#198754", "#ffc107"]
      }
    ]
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Professional Doctor Dashboard</h1>

      {/* Top Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Revenue</h6>
              <h4 className="card-title text-primary">${totalRevenue}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Paid</h6>
              <h4 className="card-title text-success">${totalPaid}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Outstanding</h6>
              <h4 className="card-title text-warning">${totalOutstanding}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Refunds</h6>
              <h4 className="card-title text-danger">${totalRefund}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Revenue Trend</h5>
            <Line data={revenueChartData} />
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Bookings Status</h5>
            <Pie data={statusChartData} />
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5 className="card-title mb-3">Branch Revenue</h5>
            <Bar data={branchRevenueChartData} />
          </div>
        </div>
      </div>

      {/* Detailed Bookings Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Detailed Bookings</h5>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Outstanding</th>
                  <th>Refund</th>
                  <th>Payment Method</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.patient}</td>
                    <td>{b.age}</td>
                    <td>{b.gender}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.branch}</td>
                    <td className={b.status === "Completed" ? "text-success" : "text-danger"}>{b.status}</td>
                    <td>${b.totalAmount}</td>
                    <td>${b.paid}</td>
                    <td>${b.outstanding}</td>
                    <td>${b.refund}</td>
                    <td>{b.paymentMethod}</td>
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
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking & Patient Details</h5>
                <button type="button" className="btn-close" onClick={() => setModalData(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient:</strong> {modalData.patient} ({modalData.age} y/o, {modalData.gender})</p>
                <p><strong>Address:</strong> {modalData.address}</p>
                <p><strong>Branch:</strong> {modalData.branch}</p>
                <p><strong>Date & Time:</strong> {modalData.date} {modalData.time}</p>
                <p><strong>Status:</strong> {modalData.status}</p>
                <p><strong>Total Amount:</strong> ${modalData.totalAmount}</p>
                <p><strong>Paid:</strong> ${modalData.paid}</p>
                <p><strong>Outstanding:</strong> ${modalData.outstanding}</p>
                <p><strong>Refund:</strong> ${modalData.refund}</p>
                <p><strong>Payment Method:</strong> {modalData.paymentMethod}</p>
                <p><strong>Diagnosis:</strong> {modalData.diagnosis || "-"}</p>
                <p><strong>Medication:</strong> {modalData.medication || "-"}</p>
                <p><strong>Allergies:</strong> {modalData.allergies || "-"}</p>
                <p><strong>Hereditary Diseases:</strong> {modalData.hereditaryDiseases || "-"}</p>
                <p><strong>Notes:</strong> {modalData.notes || "-"}</p>
                <hr/>
                <h6>Previous Appointments:</h6>
                <ul>
                  {modalData.previousAppointments.map((p, i) => (
                    <li key={i}>{p.date}: {p.diagnosis} ({p.medication})</li>
                  ))}
                </ul>
                <h6>Cancellations:</h6>
                <ul>
                  {modalData.cancellations.map((c, i) => (
                    <li key={i}>{c.date}: {c.reason} (Refund: ${c.refund})</li>
                  ))}
                </ul>
                <h6>Calls:</h6>
                <ul>
                  {modalData.calls.map((c, i) => (
                    <li key={i}>{c.type} Call on {c.date}, Duration: {c.duration}</li>
                  ))}
                </ul>
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

export default ProfessionalDashboard;
