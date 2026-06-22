import { useParams } from "react-router-dom";
import PationtCard from "../../appointmentList/cards/1-PationtCard";
import TimeSlotInformationCard from "../../appointmentList/cards/2-TimeSlotInformationCard";
import PatientDetails from "../../appointmentList/cards/3-PatientDetails";
import CancellationDetails from "../../appointmentList/cards/4-CancellationDetails";
import ErrorPage from "../../notFound-pageError/ErrorPage";
import { useTimeSlotDetails } from "../../appointmentList/hooks/useTimeSlotDetails";
import { patientSkeletonTheme } from "../../patient-management/patient-information/PatientTabs/patientBasicInfo/usePatientBasicInfo";

const AppointmentInformation = () => {
  const { slotId } = useParams();

const {
  slot,
  patient,
  cancellation,
  slotDetails,
  isSlotDetailsLoading,
  isSlotDetailsFetching,
  isSlotDetailsError,
  refetchSlotDetails,
  slotDetailsError,
} = useTimeSlotDetails(Number(slotId));


    if (isSlotDetailsError || (!isSlotDetailsLoading && !slotDetails && isSlotDetailsFetching)) {
      return (
        <ErrorPage refetch={refetchSlotDetails} isFetching={isSlotDetailsFetching} error={slotDetailsError} />
      );
    }
    if( isSlotDetailsLoading || isSlotDetailsFetching  ){
      
      return (
       <div style={{ marginTop: "30px" , width:"100%"}}> 
        {patientSkeletonTheme()}
       </div>
      )
      }
    
  return (
    <div className="dc-yourdetails dc-tabsinfo " style={{ marginTop: "30px" }}>
      {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"> */}
      <div className="dc-haslayout dc-dbsectionspace dc-dbsectionspacetest">
        <div className="dc-dashboardbox pl-4 pr-4">
          <PationtCard
            userName={patient?.name}
            userImg={patient?.img}
            userLocation={patient?.location}
            chatId={1}
            patientId={patient?.patientId}
            status={slot?.status}
            time={slot?.startTime}
            spaces={slot?.duration}
          />
          <div className="dc-user-details">
            <TimeSlotInformationCard {...slot} />
            <PatientDetails
              name={patient?.name}
              phoneNumber={patient?.phoneNumber}
              address={patient?.address}
              bookingType={patient?.bookingType}
              patientAge={patient?.patientAge}
              isFirstVisit={patient?.isFirstVisit}
            />
           {slotDetails?.cancellationInfoOverview && <CancellationDetails
              time={cancellation?.time}
              cancelledBy={cancellation?.cancelledBy}
              financialStatus={cancellation?.financialStatus}
              reason={cancellation?.reason}
            />}
          </div>
        </div>{" "}
      </div>{" "}
      {/* </div> */}
    </div>
  );
};

export default AppointmentInformation;
