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
import DataEmptyComponent from "../shared/DataEmptyComponent";
import { patientSkeletonTheme } from "../patient-management/patient-information/PatientTabs/patientBasicInfo/usePatientBasicInfo";
import ErrorPage from "../notFound-pageError/ErrorPage";
import ErrorLoading from "../shared/ErrorLoading";
import { useTimeSlots } from "./hooks/useTimeSlots";
import { useTimeSlotDetails } from "./hooks/useTimeSlotDetails";
export default function MainAppointtmentList() {
  const {
    date,
    filter,
    setFilter,
    handleDateChange,
    slotsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleSelectSlot,
    handleFilterChange,
    slotId
  } = useTimeSlots();
  const {
    slot,
    patient,
    cancellation,
    slotDetails,
    isSlotDetailsLoading,
    isSlotDetailsFetching,
    slotDetailsError,
    isSlotDetailsError,
    refetchSlotDetails,
  }=useTimeSlotDetails(slotId);
  

  if (isError || (!isLoading && !slotsData && isFetching)) {
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
              <CalendarComponent date={date} setDate={handleDateChange} />
              {slotsData?.length === 0 &&
              !isFetching &&
              !isLoading &&
              filter === "All" ? null : (
                <AppointmentSpaces
                  isLoading={isLoading || isFetching}
                  slots={slotsData || []}
                  filter={filter}
                  setFilter={handleFilterChange}
                  onRemoveSlot={(slot, index) =>
                    console.log("Remove slot:", slot, index)
                  }
                  selectedSlotId={slotId}
                  setSelectedSlot={handleSelectSlot}
                />
              )}

              {slotsData?.length === 0 && !isFetching && !isLoading ? (
                <DataEmptyComponent
                  containerStyle={{
                    margin: "10px 0 0px",
                    backgroundColor: "var(--badybkcolor)",
                  }}
                  title={t("No Time Slots Found!")}
                  text={
                    filter !== "All"
                      ? t(
                          "No time slots found in this date change the date or clear filters.",
                        )
                      : t(
                          "No time slots found in this date you can change the date.",
                        )
                  }
                  btnText={t("Clear Filters")}
                  onClick={filter !== "All" ? () => setFilter("All") : null}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
          <div className="dc-haslayout dc-dbsectionspace dc-dbsectionspacetest">
            {isSlotDetailsLoading || isSlotDetailsFetching ? (
              patientSkeletonTheme(false, "0 0 25px", false)
            ) : isSlotDetailsError ? (
              <div className="table-card">
                <ErrorLoading
                  error={slotDetailsError}
                  refetch={refetchSlotDetails}
                />{" "}
              </div>
            ) : (
              <>
                {slotId ? (
                  <div className="dc-dashboardbox">
                    {slotDetails?.patientInfoOverview && (
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
                          to={`/appointment-management/${slotDetails.bookingId}/${slotId}`}
                          className="button-elment"
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "100%",
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
                    ) : null}
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
