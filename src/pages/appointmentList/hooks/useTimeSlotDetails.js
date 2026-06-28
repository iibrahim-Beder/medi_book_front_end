import { useGetTimeSlotDetailsForWebQuery } from "../../../api/doctor-information/timeSlotsApi";

export function useTimeSlotDetails(id, GetDetails=useGetTimeSlotDetailsForWebQuery) {


  const {
    data: slotDetails,
    isLoading: isSlotDetailsLoading,
    isFetching: isSlotDetailsFetching,
    error: slotDetailsError,
    isError: isSlotDetailsError,
    refetch: refetchSlotDetails,
  } = GetDetails(id, {
    skip: !id,
  });

  const slot = {
    ...slotDetails?.slotInfoOverview,
    location: slotDetails?.slotInfoOverview?.locationName,
  };

  const patient = {
    patientId: slotDetails?.patientInfoOverview?.patientId,
    name: slotDetails?.patientInfoOverview?.patientName,
    img: slotDetails?.patientInfoOverview?.patientImageUrl,
    phoneNumber: slotDetails?.patientInfoOverview?.phoneNumber,
    bookingType: slotDetails?.patientInfoOverview?.bookingType,
    patientAge: slotDetails?.patientInfoOverview?.patientAge,
    isFirstVisit: slotDetails?.patientInfoOverview?.isFirstVisit,
    location: slotDetails?.patientInfoOverview?.patientCity,
    chatId: slotDetails?.patientInfoOverview?.chatId,
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