import { Container } from "react-bootstrap";
import { useState } from "react";
import PatientStats from "./components/PatientStats";
// import PatientToolbar from "./PatientToolbar";
import PatientsTable from "./components/PatientsTable";
// import PatientsFilters from "./PatientsFilters"; new
// import PatientFormModal from "./PatientFormModal";
// import PatientViewModal from "./PatientViewModal";
import { usePatients } from "./components/usePatients";
import '../Patient-management.css'
import PatientReviewsTable from "./components/PatientReviewsTable";
const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formModal, setFormModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [formPatient, setFormPatient] = useState({});

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "نشط").length,
    inactive: patients.filter((p) => p.status === "غير نشط").length,
    visits: 12, // مثال فقط
  };

  const handleSave = () => {
    if (formPatient.id) {
      updatePatient(formPatient);
    } else {
      addPatient(formPatient);
    }
    setFormModal(false);
    setFormPatient({});
  };

  return (
    <Container fluid className="p-4">
<i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i>
      <PatientStats stats={stats} />
      <PatientsTable
        patients={filteredPatients}
        onView={(p) => { setSelectedPatient(p); setViewModal(true); }}
        onEdit={(p) => { setFormPatient(p); setFormModal(true); }}
        onDelete={deletePatient}
      />
      <PatientReviewsTable />

     
    </Container>
  );
};

export default PatientManagement;
