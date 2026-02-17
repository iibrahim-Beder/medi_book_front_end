import { Appointments } from "./cards/AppointmentsOverCard";
import AppointmentsStatusCard from "./cards/AppointmentsStatusCard";
import AppointmentsTypeCard from "./cards/AppointmentsTypeCard";
import MainAppointtmentList2 from "./MainAppointmentList";

export default function AppointmentsPage() {
  return (
    <div>
    <div className="row payment-page dashboards-pages">
      <div className="col-lg-6  mb-3 col-m-d12">
        <Appointments  />
        <AppointmentsTypeCard  />
      </div>
      <div className="col-lg-6 col-md-12">
      <AppointmentsStatusCard />
        </div>
        <div style={{padding:"0 16px"}} >
        <MainAppointtmentList2 />
        </div>
    </div>
    </div>
  );
}