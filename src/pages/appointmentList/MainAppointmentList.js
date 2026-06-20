import React, { useState } from "react";

import CalendarComponent from "./cards/CalendarComponent";
// import RecentAppointments from "../RecentAppointments";
import AppointmentSpaces from "./cards/TimeSlosts";
import CancellationDetails from "./cards/4-CancellationDetails";
import PatientDetails from "./cards/3-PatientDetails";
import PationtCard from "./cards/1-PationtCard";
import TimeSlotInformationCard from "./cards/2-TimeSlotInformationCard";
import { Button, Divider, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useGetTimeSlotsForWebQuery } from "../../api/doctor-information/timeSlotsApi";
import { formatDateForAPI } from "../shared/utils";
import { useSelector } from "react-redux";
import { useGetTimeSlotDetailsForWebQuery } from "../../api/doctor-information/timeSlotsApi";
import DataEmptyComponent from "../shared/DataEmptyComponent";
import { patientSkeletonTheme } from "../patient-management/patient-information/PatientTabs/patientBasicInfo/usePatientBasicInfo";
import ErrorPage from "../notFound-pageError/ErrorPage";
export default function MainAppointtmentList() {
  const doctorId = useSelector((state) => state.auth.doctorId);
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState("All");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const {
    data: slotsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTimeSlotsForWebQuery({
    doctorId: doctorId,
    date: formatDateForAPI(date),
    filter: filter,
  });

  const {
    data: slotDetails,
    isLoading: isSlotDetailsLoading,
    isFetching: isSlotDetailsFetching,
    error: slotDetailsError,
  } = useGetTimeSlotDetailsForWebQuery(selectedSlot?.slotId, {
    skip: !selectedSlot?.slotId,
  });

  const slot =
    {
      status: selectedSlot?.status,
      ...slotDetails?.slotInfoOverview,
    } || {};

  const patient = {
    patientId: slotDetails?.patientInfoOverview?.patientId,
    name: slotDetails?.patientInfoOverview?.patientName,
    img: slotDetails?.patientInfoOverview?.patientImageUrl,
    phoneNumber: slotDetails?.patientInfoOverview?.phoneNumber,
    bookingType: slotDetails?.patientInfoOverview?.bookingType,
    patientAge: slotDetails?.patientInfoOverview?.patientAge,
    isFirstVisit: slotDetails?.patientInfoOverview?.isFirstVisit,
  };

  const cancellation = {
    time: slotDetails?.cancellationInfoOverview?.cancellationTime,
    cancelledBy: slotDetails?.cancellationInfoOverview?.cancelledBy,
    financialStatus: slotDetails?.cancellationInfoOverview?.financialStatus,
    reason: slotDetails?.cancellationInfoOverview?.cancellationReason,
  };

  console.log("==MainAppointtmentList",(isError || (!isLoading && !slotsData  && isFetching) ));

  if (isError || (!isLoading && !slotsData  && isFetching)) {
    return (
      <ErrorPage refetch={refetch} isFetching={isFetching} error={error} />
    );
  }
  return (
    <section className="dc-haslayout">
      <div className="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
          <div class="dc-haslayout dc-dbsectionspace dc-haslayout dc-dbsectionspace">
            <div className="dc-dashboardbox dc-apointments-wrap dc-apointments-wraptest ">
              <CalendarComponent date={date} setDate={setDate} />
               {slotsData?.length === 0 && !isFetching && !isLoading && filter==="All" ? (null) : (
                <AppointmentSpaces
                  isLoading={isLoading || isFetching}
                  slots={slotsData || []}
                  filter={filter}
                  setFilter={setFilter}
                  onRemoveSlot={(slot, index) =>
                    console.log("Remove slot:", slot, index)
                  }
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                />
               )}

              {slotsData?.length === 0 && !isFetching && !isLoading ? (
                <DataEmptyComponent
                  containerStyle={{
                    margin: "10px 0 0px",
                    backgroundColor: "var(--badybkcolor)",
                  }}
                  title={t("No Time Slots Found!")}
                  text={filter !=="All" ? t("No time slots found in this date change the date or clear filters.") : t("No time slots found in this date you can change the date.")}
                  btnText={t("Clear Filters")}
                  onClick={filter !=="All" ? () => setFilter("All") : null}
                  />
              ) : ( null )}

            
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
          <div className="dc-haslayout dc-dbsectionspace dc-dbsectionspacetest">
            {isSlotDetailsLoading || isSlotDetailsFetching ? (
              patientSkeletonTheme(false, "0 0 25px", false)
            ) : (
              <>
                {selectedSlot ? (
                  <div className="dc-dashboardbox">
                    {slotDetails?.patientInfoOverview && (
                      <PationtCard
                        userName={patient?.name}
                        userImg="/images/avt/patient-avt.png"
                        userLocation={patient?.location}
                        chatId={1}
                        patientId={patient?.patientId}
                        status={slot?.status}
                        time={slot?.startTime}
                        spaces={slot?.duration}
                      />
                    )}

                    <div
                      className="dc-user-details"
                      style={{ borderColor: "#eee" }}
                    >
                      <TimeSlotInformationCard
                        {...slot}
                        showLine={slotDetails?.bookingId ? true : false}
                      />

                      {slotDetails?.patientInfoOverview && (
                        <PatientDetails
                          name={patient?.name}
                          phoneNumber={patient?.phoneNumber}
                          address={patient?.address}
                          bookingType={patient?.bookingType}
                          patientAge={patient?.patientAge}
                          isFirstVisit={patient?.isFirstVisit}
                        />
                      )}

                      {slotDetails?.cancellationInfoOverview && (
                        <CancellationDetails
                          time={cancellation?.time}
                          cancelledBy={cancellation?.cancelledBy}
                          financialStatus={cancellation?.financialStatus}
                          reason={cancellation?.reason}
                        />
                      )}
                    </div>
                    {slotDetails?.bookingId ? (
                      <div className="appointmentinfo-footer">
                        <Divider orientation="vertical" flexItem />

                        <Link
                          to={`/appointment-details/${slotDetails.bookingId}`}
                          className="button-elment"
                        >
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: "10px",
                              textTransform: "none",
                              px: 3,
                              backgroundColor: "#60a5fa",
                              boxShadow: "none",
                            }}
                          >
                            Appointment Details
                          </Button>
                        </Link>
                      </div>
                    ): null}
                  </div>
                ) : (
                  <div className="table-card">
                    <DataEmptyComponent
                      imgDate
                      title="Choose a time to show it"
                      containerStyle={{ flexDirection: "column" }}
                      imgStyle={{ width: "100%", maxWidth: "300px" }}
                      text="You can change the date and select a time from the list to view its details here."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
