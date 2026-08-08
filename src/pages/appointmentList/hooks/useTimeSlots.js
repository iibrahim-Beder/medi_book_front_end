// src/hooks/useTimeSlots.js

import { useSelector } from "react-redux";
import {
  useGetTimeSlotsForWebQuery,
} from "../../../api/doctor-information/timeSlotsApi";
import { formatDateForAPI } from "../../shared/utils";
import { useSearchParams } from "react-router-dom";

export function useTimeSlots() {

  const [searchParams, setSearchParams] = useSearchParams();

const date =
  searchParams.get("date")
    ? new Date(searchParams.get("date"))
    : new Date();

const filter = searchParams.get("filter") || "All";

const slotId = searchParams.get("slotId");

const handleFilterChange = (value) => {
  setSearchParams((prev) => {
    prev.set("filter", value);
    return prev;
  });
};
const handleDateChange = (value) => {
  setSearchParams((prev) => {
    prev.set("date", formatDateForAPI(value));
    return prev; 
  });
};
const handleSelectSlot = (slot) => {
  setSearchParams((prev) => {
    prev.set("slotId", slot.slotId);
    return prev;
  });
};

  const doctorId = useSelector((state) => state.auth.doctorId);
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
  const selectedSlot = slotsData?.find((slot) => slot.slotId === slotId);
  return {
    date,
    filter,
    selectedSlot,
    slotsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleDateChange,
    handleFilterChange,
    handleSelectSlot,
    slotId:Number(slotId),
  };
}
