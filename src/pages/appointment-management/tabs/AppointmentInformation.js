import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import PationtCard from "../../appointmentList/cards/1-PationtCard";
import TimeSlotInformationCard from "../../appointmentList/cards/2-TimeSlotInformationCard";
import PatientDetails from "../../appointmentList/cards/3-PatientDetails";
import CancellationDetails from "../../appointmentList/cards/4-CancellationDetails";

const AppointmentInformation = () => {
  const { t } = useTranslation();
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
    
    <div className="dc-yourdetails dc-tabsinfo "style={{marginTop:"30px"}} > 



          {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"> */}
            <div className="dc-haslayout dc-dbsectionspace dc-dbsectionspacetest">  
              <div className="dc-dashboardbox pl-4 pr-4">
                <PationtCard
                  userName={"Ibrahem makhasi"}
                  userImg={"images/feedback/user-img.jpg"}
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
          {/* </div> */}
    </div>
  );
};

export default AppointmentInformation;
