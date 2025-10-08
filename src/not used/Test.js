// ProfessionalDashboardTabs.jsx
import React, { useMemo, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import 'chart.js/auto';

/*
  Tabbed Professional Dashboard (Bootstrap)
  - Tabs: Overview / Revenue / Bookings / Patients / Cancellations / Calls / Branches
  - Uses sample detailed data (replace with API calls)
  - Features: summary cards, charts, detailed tables, modals, CSV export, basic filters & search
*/

// ---------- Sample detailed data (replace with API data) ----------
const sampleBookings = [
  {
    id: 1,
    patientId: 101,
    patient: "John Doe",
    age: 30,
    gender: "Male",
    phone: "+201234567890",
    address: "123 Main St",
    date: "2025-10-05",
    time: "10:00",
    branch: "Clinic A",
    status: "Completed",
    totalAmount: 200,
    paid: 150,
    outstanding: 50,
    paymentMethod: "Stripe",
    refund: 0,
    notes: "Follow-up for blood test",
    diagnosis: "Flu",
    medication: "Paracetamol",
    allergies: "None",
    hereditaryDiseases: "None",
    previousAppointments: [
      { date: "2025-09-01", diagnosis: "Cold", medication: "Vitamin C" },
      { date: "2025-08-15", diagnosis: "Headache", medication: "Ibuprofen" }
    ],
    cancellations: [],
    calls: [{ type: "Video", duration: "15m", date: "2025-10-05" }]
  },
  {
    id: 2,
    patientId: 102,
    patient: "Jane Smith",
    age: 25,
    gender: "Female",
    phone: "+201112223334",
    address: "456 Elm St",
    date: "2025-10-06",
    time: "14:00",
    branch: "Clinic B",
    status: "Cancelled",
    totalAmount: 100,
    paid: 0,
    outstanding: 100,
    paymentMethod: "Cash",
    refund: 50,
    notes: "No-show",
    diagnosis: "",
    medication: "",
    allergies: "Peanuts",
    hereditaryDiseases: "Diabetes",
    previousAppointments: [{ date: "2025-09-10", diagnosis: "Allergy", medication: "Antihistamine" }],
    cancellations: [{ date: "2025-10-06", reason: "No-show", refund: 50 }],
    calls: []
  },
  {
    id: 3,
    patientId: 103,
    patient: "Ali Hassan",
    age: 40,
    gender: "Male",
    phone: "+201998877665",
    address: "789 Oak St",
    date: "2025-10-07",
    time: "11:00",
    branch: "Clinic A",
    status: "Completed",
    totalAmount: 250,
    paid: 200,
    outstanding: 50,
    paymentMethod: "Wallet",
    refund: 0,
    notes: "Allergy follow-up",
    diagnosis: "Allergy",
    medication: "Antihistamine",
    allergies: "Pollen",
    hereditaryDiseases: "Asthma",
    previousAppointments: [{ date: "2025-09-20", diagnosis: "Allergy", medication: "Antihistamine" }],
    cancellations: [],
    calls: [{ type: "Audio", duration: "10m", date: "2025-10-07" }]
  }
];

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
  const [bookings] = useState(sampleBookings);
  const [payments] = useState(samplePayments);
  const [branches] = useState(sampleBranches);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // aggregates (memoized)
  const aggregates = useMemo(() => {
    const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalPaid = bookings.reduce((s, b) => s + (b.paid || 0), 0);
    const totalOutstanding = bookings.reduce((s, b) => s + (b.outstanding || 0), 0);
    const totalRefunds = bookings.reduce((s, b) => s + (b.refund || 0), 0);
    const completed = bookings.filter(b => b.status === "Completed").length;
    const cancelled = bookings.filter(b => b.status === "Cancelled").length;
    return { totalRevenue, totalPaid, totalOutstanding, totalRefunds, completed, cancelled };
  }, [bookings]);

  // Filtered bookings for tables
  const filteredBookings = bookings.filter(b => {
    if (filterBranch !== "All" && b.branch !== filterBranch) return false;
    if (filterStatus !== "All" && b.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (b.patient && b.patient.toLowerCase().includes(q)) ||
        (b.branch && b.branch.toLowerCase().includes(q)) ||
        (String(b.id).includes(q)) ||
        (b.paymentMethod && b.paymentMethod.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Chart data examples
  const revenueChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Revenue", data: [3500, 4000, 3000, 4500], borderColor: "#0d6efd", backgroundColor: "rgba(13,110,253,0.15)", fill: true }]
  };
  const statusChartData = {
    labels: ["Completed", "Cancelled"],
    datasets: [{ data: [aggregates.completed, aggregates.cancelled], backgroundColor: ["#198754", "#dc3545"] }]
  };
  const branchChartData = {
    labels: branches.map(b => b.id),
    datasets: [{ label: "Upcoming bookings", data: branches.map(b => b.upcomingBookings), backgroundColor: ["#0d6efd", "#198754", "#ffc107"] }]
  };

  // CSV export util (simple)
  const exportToCSV = (rows, filename = "export.csv") => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [
      keys.join(","),
      ...rows.map(r => keys.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Doctor Professional Dashboard (Tabs)</h2>

      {/* Nav Tabs */}
      <ul className="nav nav-tabs mb-3" id="dashboardTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab">Overview</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="revenue-tab" data-bs-toggle="tab" data-bs-target="#revenue" type="button" role="tab">Revenue</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="bookings-tab" data-bs-toggle="tab" data-bs-target="#bookings" type="button" role="tab">Bookings</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="patients-tab" data-bs-toggle="tab" data-bs-target="#patients" type="button" role="tab">Patients</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="cancellations-tab" data-bs-toggle="tab" data-bs-target="#cancellations" type="button" role="tab">Cancellations</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="calls-tab" data-bs-toggle="tab" data-bs-target="#calls" type="button" role="tab">Calls</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="branches-tab" data-bs-toggle="tab" data-bs-target="#branches" type="button" role="tab">Branches</button>
        </li>
      </ul>

      {/* Tab panes */}
      <div className="tab-content">
        {/* --------- Overview Tab --------- */}
        <div className="tab-pane fade show active" id="overview" role="tabpanel">
          <div className="row mb-3">
            <div className="col-md-3 mb-3">
              <div className="card p-3">
                <small className="text-muted">Total Revenue</small>
                <h4 className="mt-2">${aggregates.totalRevenue}</h4>
                <small className="text-muted">Includes refunds</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3">
                <small className="text-muted">Total Paid</small>
                <h4 className="mt-2 text-success">${aggregates.totalPaid}</h4>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3">
                <small className="text-muted">Outstanding</small>
                <h4 className="mt-2 text-warning">${aggregates.totalOutstanding}</h4>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3">
                <small className="text-muted">Refunds</small>
                <h4 className="mt-2 text-danger">${aggregates.totalRefunds}</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 mb-3">
              <div className="card p-3 shadow-sm">
                <h6>Revenue Trend</h6>
                <Line data={revenueChartData} />
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm mb-3">
                <h6>Bookings Status</h6>
                <Pie data={statusChartData} />
              </div>
              <div className="card p-3 shadow-sm">
                <h6>Branches Overview</h6>
                <Bar data={branchChartData} />
              </div>
            </div>
          </div>
        </div>

        {/* --------- Revenue Tab --------- */}
        <div className="tab-pane fade" id="revenue" role="tabpanel">
          <div className="row mb-3">
            <div className="col-md-12 d-flex justify-content-between align-items-center">
              <h5>Revenue Details & Reports</h5>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => exportToCSV(bookings.map(b => ({
                  id: b.id, patient: b.patient, date: b.date, totalAmount: b.totalAmount, paid: b.paid, outstanding: b.outstanding, refund: b.refund, method: b.paymentMethod, branch: b.branch
                })), "revenue_details.csv")}>Export CSV</button>
              </div>
            </div>
          </div>
          <div className="card p-3 mb-3">
            <h6>Monthly Breakdown (example)</h6>
            <Line data={revenueChartData} />
          </div>

          <div className="card p-3">
            <h6>Revenue By Branch</h6>
            <Bar data={branchChartData} />
          </div>
        </div>

        {/* --------- Bookings Tab --------- */}
        <div className="tab-pane fade" id="bookings" role="tabpanel">
          <div className="card mb-3 p-3">
            <div className="d-flex gap-2 align-items-center mb-2">
              <input className="form-control form-control-sm w-25" placeholder="Search patient / id / method" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="form-select form-select-sm w-auto" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                <option>All</option>
                {branches.map(b => <option key={b.id}>{b.id}</option>)}
              </select>
              <select className="form-select form-select-sm w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>All</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>Pending</option>
              </select>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setSearchTerm(""); setFilterBranch("All"); setFilterStatus("All"); }}>Reset</button>
              <div className="ms-auto">
                <button className="btn btn-sm btn-outline-primary" onClick={() => exportToCSV(filteredBookings, "bookings.csv")}>Export CSV</button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>#</th><th>Patient</th><th>Date</th><th>Branch</th><th>Status</th>
                    <th>Total</th><th>Paid</th><th>Outstanding</th><th>Refund</th><th>Method</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td><button className="btn btn-link btn-sm p-0" onClick={() => setSelectedBooking(b)}>{b.patient}</button></td>
                      <td>{b.date} {b.time}</td>
                      <td>{b.branch}</td>
                      <td className={b.status === "Completed" ? "text-success" : "text-danger"}>{b.status}</td>
                      <td>${b.totalAmount}</td>
                      <td>${b.paid}</td>
                      <td>${b.outstanding}</td>
                      <td>${b.refund}</td>
                      <td>{b.paymentMethod}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedBooking(b)}>View</button>
                          <button className="btn btn-sm btn-outline-success" onClick={() => alert("Start Payment Flow (implement API)")}>Record Payment</button>
                          <button className="btn btn-sm btn-outline-info" onClick={() => alert("Start Call (integration)")}>Call</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan="11" className="text-center small text-muted">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --------- Patients Tab --------- */}
        <div className="tab-pane fade" id="patients" role="tabpanel">
          <div className="card p-3">
            <h6>Patients / Medical History</h6>
            <div className="table-responsive mt-2">
              <table className="table table-sm table-hover">
                <thead className="table-light small"><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Allergies</th><th>Hereditary</th><th>Last Visit</th></tr></thead>
                <tbody>
                  {Array.from(new Map(bookings.map(b => [b.patientId, b]))).map(([id, b]) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td><button className="btn btn-link btn-sm p-0" onClick={() => setSelectedBooking(b)}>{b.patient}</button></td>
                      <td>{b.age}</td>
                      <td>{b.gender}</td>
                      <td>{b.phone}</td>
                      <td>{b.allergies || "-"}</td>
                      <td>{b.hereditaryDiseases || "-"}</td>
                      <td>{b.previousAppointments?.[0]?.date || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --------- Cancellations Tab --------- */}
        <div className="tab-pane fade" id="cancellations" role="tabpanel">
          <div className="card p-3">
            <h6>Cancellations & Refunds</h6>
            <div className="table-responsive mt-2">
              <table className="table table-sm table-hover">
                <thead className="table-light small"><tr><th>Booking#</th><th>Patient</th><th>Cancel Date</th><th>Reason</th><th>Refund</th></tr></thead>
                <tbody>
                  {bookings.flatMap(b => b.cancellations.map(c => ({ bookingId: b.id, patient: b.patient, ...c }))).map((r, i) => (
                    <tr key={i}>
                      <td>{r.bookingId}</td>
                      <td>{r.patient}</td>
                      <td>{r.date}</td>
                      <td>{r.reason}</td>
                      <td>${r.refund}</td>
                    </tr>
                  ))}
                  {bookings.flatMap(b => b.cancellations).length === 0 && <tr><td colSpan="5" className="text-center small text-muted">No cancellations</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --------- Calls Tab --------- */}
        <div className="tab-pane fade" id="calls" role="tabpanel">
          <div className="card p-3">
            <h6>Calls & Consultations</h6>
            <div className="table-responsive mt-2">
              <table className="table table-sm table-hover">
                <thead className="table-light small"><tr><th>Type</th><th>Booking#</th><th>Patient</th><th>Date</th><th>Duration</th></tr></thead>
                <tbody>
                  {bookings.flatMap(b => b.calls.map(c => ({ ...c, bookingId: b.id, patient: b.patient }))).map((r, i) => (
                    <tr key={i}>
                      <td>{r.type}</td>
                      <td>{r.bookingId}</td>
                      <td>{r.patient}</td>
                      <td>{r.date}</td>
                      <td>{r.duration}</td>
                    </tr>
                  ))}
                  {bookings.flatMap(b => b.calls).length === 0 && <tr><td colSpan="5" className="text-center small text-muted">No calls recorded</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --------- Branches Tab --------- */}
        <div className="tab-pane fade" id="branches" role="tabpanel">
          <div className="card p-3">
            <h6>Branches & Schedules</h6>
            <div className="table-responsive mt-2">
              <table className="table table-sm table-hover">
                <thead className="table-light small"><tr><th>Branch</th><th>Address</th><th>Hours</th><th>Upcoming</th></tr></thead>
                <tbody>
                  {branches.map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.address}</td>
                      <td>{b.hours}</td>
                      <td>{b.upcomingBookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Selected Booking Modal (formatted) ---------- */}
      {selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking #{selectedBooking.id} — {selectedBooking.patient}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedBooking(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-md-6">
                    <h6>Appointment</h6>
                    <p><strong>Date/Time:</strong> {selectedBooking.date} {selectedBooking.time}</p>
                    <p><strong>Branch:</strong> {selectedBooking.branch}</p>
                    <p><strong>Status:</strong> <span className={selectedBooking.status==="Completed" ? "text-success" : "text-danger"}>{selectedBooking.status}</span></p>
                  </div>
                  <div className="col-md-6">
                    <h6>Financial</h6>
                    <p><strong>Total:</strong> ${selectedBooking.totalAmount}</p>
                    <p><strong>Paid:</strong> ${selectedBooking.paid}</p>
                    <p><strong>Outstanding:</strong> ${selectedBooking.outstanding}</p>
                    <p><strong>Refund:</strong> ${selectedBooking.refund}</p>
                    <p><strong>Method:</strong> {selectedBooking.paymentMethod}</p>
                  </div>
                </div>

                <hr />
                <h6>Medical Details</h6>
                <p><strong>Diagnosis:</strong> {selectedBooking.diagnosis || "-"}</p>
                <p><strong>Medication:</strong> {selectedBooking.medication || "-"}</p>
                <p><strong>Allergies:</strong> {selectedBooking.allergies || "-"}</p>
                <p><strong>Hereditary:</strong> {selectedBooking.hereditaryDiseases || "-"}</p>
                <p><strong>Notes:</strong> {selectedBooking.notes || "-"}</p>

                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6>Previous Appointments</h6>
                    <ul>
                      {selectedBooking.previousAppointments?.map((p, i) => <li key={i}>{p.date}: {p.diagnosis} ({p.medication})</li>)}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Cancellations</h6>
                    <ul>
                      {selectedBooking.cancellations?.map((c, i) => <li key={i}>{c.date}: {c.reason} (Refund: ${c.refund})</li>)}
                    </ul>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setSelectedBooking(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => alert("Open Edit / Payment / Call flows (implement)")}>Actions</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDashboardTabs;
