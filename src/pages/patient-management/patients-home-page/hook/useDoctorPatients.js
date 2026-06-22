import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { formatDateForAPI } from "../../../shared/utils";
import { useGetDoctorPatientsQuery } from "../../../../api/PatientProfile/patientApi";

export const useDoctorPatients = () => {
   
  const doctorId = useSelector((state) => state.auth.doctorId);
  const [currentFilters, setCurrentFilters] = useState({
    searchText: "",
    fromDate: null,
    toDate: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchText: "",
    fromDate: null,
    toDate: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

const queryArgs = useMemo(() => {
  const apiFilters = {
    ...appliedFilters,
    fromDate: formatDateForAPI(currentFilters.fromDate),
    toDate: formatDateForAPI(currentFilters.toDate),
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

  return {
    doctorId,
    filter: apiFilters,
    pageNumber: currentPage,
    pageSize,
  };
}, [doctorId, appliedFilters, currentPage , currentFilters]);

  const {
    data: patientsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDoctorPatientsQuery(queryArgs, {
    skip: !doctorId,
  });

const handleSearch = (filters) => {
  setCurrentPage(1);

  if (filters && typeof filters === "object") {
    setAppliedFilters(filters);
    setCurrentFilters(filters);
  } else {
    setAppliedFilters(currentFilters);
  }
};

  const handleResetFilters = () => {
    const resetFilters = {
      searchText: "",
      fromDate: null,
      toDate: null,
    };

    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  return {
    currentFilters,
    setCurrentFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    patientsData,
    isLoading,
    isFetching,
    error,
    refetch,
    handleSearch,
    handleResetFilters,
  };
};