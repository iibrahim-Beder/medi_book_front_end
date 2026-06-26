import { useState, useMemo } from "react";
import { formatDateForAPI } from "../../../../shared/utils";
import { useGetPatientAppointmentsQuery } from "../../../../../api/PatientProfile/patientAppointmentsApi";


export const usePatientAppointments = ({isMobile = false, patientId}) => {
  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    status: "",
    appointmentType: "",
    fromDate: null,
    toDate: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    status: "",
    appointmentType: "",
    fromDate: null,
    toDate: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const pageSize = isMobile ? 5 : 5;

  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      fromDate: formatDateForAPI(appliedFilters.fromDate),
      toDate: formatDateForAPI(appliedFilters.toDate),
    };

    Object.keys(apiFilters).forEach((key) => {
      if (
        apiFilters[key] === undefined ||
        apiFilters[key] === null ||
        apiFilters[key] === ""
      ) {
        delete apiFilters[key];
      }
    });

    console.log("Appointments API Filters:", apiFilters);

    return {
      patientId,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize,
    };
  }, [patientId, appliedFilters, currentPage, pageSize]);

  const {
    data: appointmentsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPatientAppointmentsQuery(queryArgs);



  const handleSearch = (filters) => {
    setCurrentPage(1);

    if (filters && typeof filters === "object") {
      setCurrentFilters(filters);
      setAppliedFilters(filters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      status: "",
      appointmentType: "",
      fromDate: null,
      toDate: null,
    };

    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "#3fabf3";
      case "Completed":
        return "#4BAE78";
      case "Cancelled":
        return "#D66A6A";
      case "InProgress":
        return "#FFA500";
      case "PendingPayment":
        return "#8B5CF6";
      case "Expired":
        return "#7A8B97";
      default:
        return "#7A8B97";
    }
  };

  const currentData = appointmentsData?.data || [];

  return {
    // State
    currentFilters,
    appliedFilters,
    currentPage,
    expandedRow,
    appointmentsData: appointmentsData,
    currentData,
    isLoading,
    isFetching,
    error,
    pageSize,

    // Actions
    handleSearch,
    handleResetFilters,
    setCurrentPage,
    setCurrentFilters,
    refetch,

    // Utils
    getStatusColor,
  };
};