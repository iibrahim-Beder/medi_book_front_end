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
      {/* <h3 className="mb-4">إدارة المرضى</h3> */}
<i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i><i class="fi fi-tr-user-trust"></i>
      <PatientStats stats={stats} />

      {/* <PatientToolbar search={search} setSearch={setSearch} onAdd={() => setFormModal(true)} /> */}
     {/* <PatientsFilters/> */}
      <PatientsTable
        patients={filteredPatients}
        onView={(p) => { setSelectedPatient(p); setViewModal(true); }}
        onEdit={(p) => { setFormPatient(p); setFormModal(true); }}
        onDelete={deletePatient}
      />

      {/* <PatientFormModal
        show={formModal}
        handleClose={() => setFormModal(false)}
        patient={formPatient}
        setPatient={setFormPatient}
        onSave={handleSave}
      />

      <PatientViewModal
        show={viewModal}
        handleClose={() => setViewModal(false)}
        patient={selectedPatient}
      /> */}
    </Container>
  );
};

export default PatientManagement;
