import PatientsTable from "./components/PatientsTable";
import '../Patient-management.css'
import AllPatientsCard from "./components/AllPatientsCard";
import AppointmentsCard from "./components/AppointmentsCard";
import ReviewsCard from "./components/ReviewsCard";
import CommunicationCard from "./components/CommunicationCard";
import PatientBehavior from "./components/PatientBehavior";
const PatientManagement = () => {
    return (
      <div>
      <div className="row payment-page">
        <div className="col-lg-6  col-m-d12">
          <AllPatientsCard  />
          <AppointmentsCard />
        </div>
        <div className="col-lg-6  col-md-12">
          <PatientBehavior />
        </div>
        <div className="col-lg-8 col-md-12 mb-3">
          <PatientsTable />
        </div>
         <div className="col-lg-4 mb-3 col-md-12 reviews-communication-card">
          <div className="col-lg-12 col-md-6 p-0 one">
          <ReviewsCard />
          </div>
          <div className="col-lg-12 col-md-6 p-0 two" >
             <CommunicationCard />
          </div>
        </div>
      </div>
      </div>
    );
};

export default PatientManagement;
