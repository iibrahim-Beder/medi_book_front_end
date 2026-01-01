import CalendarComponent from "./cards/CalendarComponent";
// import RecentAppointments from "../RecentAppointments";
import AppointmentSpaces from "./cards/TimeSlosts";
import CancellationDetails from "./cards/4-CancellationDetails";
import PatientDetails from "./cards/3-PatientDetails";
import PationtCard from "./cards/1-PationtCard";
import TimeSlotInformationCard from "./cards/2-TimeSlotInformationCard";


export default function MainAppointtmentList2(){
  const slotsData = [
  { time: "8:25 am", spaces: 1, status: "pending" },
  { time: "8:30 am", spaces: 2, status: "cancelled" },
  { time: "9:00 am", spaces: 3, status: "pending" },
  { time: "9:25 am", spaces: 4, status: "completed" },
  { time: "10:00 am", spaces: 5, status: "empty" },
  { time: "2:25 am", spaces: 1, status: "completed" },
  { time: "3:30 am", spaces: 2, status: "pending" },
  { time: "4:00 am", spaces: 3, status: "cancelled" },
  { time: "5:25 am", spaces: 4, status: "pending" },
  { time: "5:00 am", spaces: 5, status:  "cancelled" },
  { time: "3:00 am", spaces: 5, status:  "empty" },
  { time: "2:00 am", spaces: 5, status:  "completed" },
  { time: "11:00 am", spaces: 5, status: "pending" },
  { time: "12:00 am", spaces: 5, status: "completed" },
  { time: "1:00 am", spaces: 5, status:  "pending" },
  { time: "1:00 am", spaces: 5, status:  "empty" },
  { time: "1:00 am", spaces: 5, status:  "empty" },
  { time: "9:00 am", spaces: 5, status:  "cancelled" },
  { time: "8:00 am", spaces: 5, status:  "completed" },
  { time: "4:00 am", spaces: 5, status:  "cancelled" },
  { time: "3:00 am", spaces: 5, status:  "pending" },
  { time: "6:00 am", spaces: 5, status:  "completed" },
];
 const  slot= 
   {
    status: "Pending",
    startTime: "08:00 AM",
    endTime: "08:30 AM",
    duration: "30 mins",
    shiftName: "Morning Shift",
    bookingDate: "2025-08-13",
    location: "Smiles Multispeciality Clinic",
    price: "$50"
  }
    return (
      <section  className="dc-haslayout">
        <div className="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div class="dc-haslayout dc-dbsectionspace dc-haslayout dc-dbsectionspace">
              <div className="dc-dashboardbox dc-apointments-wrap dc-apointments-wraptest ">
                <CalendarComponent />

                <AppointmentSpaces
                  slots={slotsData}
                  onRemoveSlot={(slot, index) =>
                    console.log("Remove slot:", slot, index)
                  }
                />
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="dc-haslayout dc-dbsectionspace dc-dbsectionspacetest">
              <div className="dc-dashboardbox ">
                <PationtCard
                  userName={"Ibrahem makhasi"}
                  userImg={"/images/avt/patient-avt.png"}
                  userLocation={"Egypt"}      
                />
                <div className="dc-user-details">
                  <TimeSlotInformationCard slot={slot} />
                  
                  <PatientDetails
                    patient={{
                      name: "John Smith",
                      id: "A123456789",
                      contact: "+1 555-1234",
                      notes: "Follow-up required",
                      bookingType: "Clinic Visit",
                    }}
                  />
                  <CancellationDetails
                    cancellation={{
                      time: "2025-08-13 14:30",
                      cancelledBy: "John Smith",
                      reason: "Patient unavailable",
                      financialStatus: "Refunded",
                    }}
                  />
                </div>
              </div>{" "}
            </div>{" "}
          </div>
        </div>
      </section>
    );
}