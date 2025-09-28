import { useState } from "react";

export const usePatients = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      age: 35,
      gender: "ذكر",
      phone: "01012345678",
      email: "ahmed@test.com",
      lastVisit: "2025-08-12",
      status: "نشط",
    },
    {
      id: 2,
      name: "سارة محمود",
      age: 28,
      gender: "أنثى",
      phone: "01098765432",
      email: "sara@test.com",
      lastVisit: "2025-08-28",
      status: "غير نشط",
    },
  ]);

  const addPatient = (patient) => {
    setPatients([
      ...patients,
      { ...patient, id: patients.length + 1, lastVisit: "-", status: "نشط" },
    ]);
  };

  const updatePatient = (patient) => {
    setPatients(patients.map((p) => (p.id === patient.id ? patient : p)));
  };

  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return { patients, addPatient, updatePatient, deletePatient };
};
