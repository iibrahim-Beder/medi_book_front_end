import { useGetTimeSlotDetailsForWebQuery } from "../../../api/doctor-information/timeSlotsApi";

export function useTimeSlotDetails(slotId) {
  const {
    data: slotDetails,
    isLoading: isSlotDetailsLoading,
    isFetching: isSlotDetailsFetching,
    error: slotDetailsError,
    isError: isSlotDetailsError,
    refetch: refetchSlotDetails,
  } = useGetTimeSlotDetailsForWebQuery(slotId, {
    skip: !slotId,
  });

  const slot = {
    ...slotDetails?.slotInfoOverview,
  };

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

  return {
    slot,
    patient,
    cancellation,
    slotDetails,
    isSlotDetailsLoading,
    isSlotDetailsFetching,
    slotDetailsError,
    isSlotDetailsError,
    refetchSlotDetails,
  };
}