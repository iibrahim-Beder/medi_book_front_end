// hooks/usePatientReviews.js

import { useMemo, useState, useEffect } from "react";
import { useGetReviewsQuery } from "../../../api/doctor-information/reviewsApi";
import { useSelector } from "react-redux";

export const usePatientReviews = (itemsPerPage=3) => {
      // const doctorId = useSelector((state) => state.auth.doctorId);
  const doctorId = 1;

  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  const [starFilters, setStarFilters] = useState({});
  const [appointmentType, setAppointmentType] = useState(undefined);
  const [page, setPage] = useState(1);


  useEffect(() => {
    setPage(1);
  }, [dateRange, starFilters, appointmentType]);

  const filter = useMemo(() => {
    const selectedRatings = Object.keys(starFilters)
      .filter((k) => starFilters[k])
      .map(Number);

    const minRating = selectedRatings.length
      ? Math.min(...selectedRatings)
      : undefined;

    const maxRating = selectedRatings.length
      ? Math.max(...selectedRatings)
      : undefined;

    return {
      minRating,
      maxRating,
      appointmentType,
      fromDate: dateRange.start?.toISOString(),
      toDate: dateRange.end?.toISOString(),
    };
  }, [starFilters, dateRange, appointmentType]);

  const {
    data: reviewsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
    error,
  } = useGetReviewsQuery({
    doctorId,
    filter,
    pageNumber: page,
    pageSize: itemsPerPage,
  });
  console.log("reviewsResponse",reviewsResponse);
  return {
    reviews: reviewsResponse?.data || [],
    averageRating: reviewsResponse?.averageRating ?? 0,
    totalCount: reviewsResponse?.totalCount ?? 0,

    page,
    setPage,

    itemsPerPage,

    isLoading,
    isFetching,
    isError,
    error,
    refetch,

    dateRange,
    setDateRange,

    starFilters,
    setStarFilters,

    appointmentType,
    setAppointmentType,
  };
};