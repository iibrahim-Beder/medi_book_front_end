import React from "react";

export default function PatientBasicInfo() {
  const patient = {
    name: "Ahmed Mohamed Ali",
    birthDate: "1989-06-21",
    age: 36,
    gender: "Male",
    phone: "0500000000",
    email: "ahmad@example.com",
    city: "Riyadh, Saudi Arabia",
    address: "Al-Narjis District, Street 123, Building 5",
    chronic: ["Type II Diabetes", "Hypertension", "Osteoporosis"],
    allergies: {
      drug: "Penicillin",
      food: "None",
    },
    medicines: ["Metformin 500mg", "Amlodipine 10mg"],
    lastVisit: "Sep 2, 2025",
    nextVisit: "Sep 15, 2025",
  };

  return (
    <div className="dc-haslayout dc-dbsectionspace">
      <div
        className="dc-dashboardbox"
        style={{
          background: "none",
          boxShadow: "none",
          // border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {/* 🧾 Basic Information */}

        <div className="patient-section">
            <div className="dc-user-header">
          <div>
            <figure className="dc-user-img">
              <img src="images/feedback/user-img.jpg" alt="patient" />
            </figure>
          </div>
          <div className="dc-title">
            {/* <a href="">Patient Profile</a> */}
            <h3>
              {patient.name} <i className="fa fa-check-circle"></i>
            </h3>
            <span>{patient.city}</span>
          </div>
   
        </div>
          <h3>🧾 Patient Basic Information</h3>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 40px",
            }}
          >
            <p><strong>Full Name:</strong> {patient.name}</p>
            <p>
              <strong>Date of Birth:</strong> {patient.birthDate}{" "}
              (Age: {patient.age} years)
            </p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>City / Country:</strong> {patient.city}</p>
            <p style={{ gridColumn: "span 2" }}>
              <strong>Detailed Address:</strong> {patient.address}
            </p>
          </div>
        </div>

        <hr />

        {/* 🏥 Health Status */}
        <div className="patient-section">
          <h3>🏥 General Health Status</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 40px",
            }}
          >
            <div>
              <p><strong>Chronic Diseases:</strong></p>
              <ul>
                {patient.chronic.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p><strong>⚠️ Allergies:</strong></p>
              <ul>
                <li>Drug: {patient.allergies.drug}</li>
                <li>Food: {patient.allergies.food}</li>
              </ul>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <p><strong>💊 Current Medications:</strong></p>
              <ul>
                {patient.medicines.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr />

        {/* 📅 Visits */}
        <div className="patient-section">
          <h3>📅 Visits</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 40px",
            }}
          >
            <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
            <p><strong>Next Appointment:</strong> {patient.nextVisit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
