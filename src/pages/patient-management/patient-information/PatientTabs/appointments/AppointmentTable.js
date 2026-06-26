import React from "react";
import { MdOutlineArrowForward } from "react-icons/md";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../shared/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConditionsFilters from "../component/ConditionsFilters";
import { formatDate } from "../../../../shared/utils";
import { usePatientAppointments } from "./usePatientAppointments";
import ErrorLoading from "../../../../shared/ErrorLoading";
import { Link } from "react-router-dom";
import PatientName from "../component/PatientName";

const AppointmentTable = ({ patientId }) => {
  const { t } = useTranslation();

  const {
    currentFilters,
    appliedFilters,
    currentPage,
    expandedRow,
    appointmentsData,
    currentData,
    isLoading,
    isFetching,
    error,
    pageSize,

    // Actions
    handleSearch,
    handleResetFilters,
    handleExpandClick,
    setCurrentPage,
    setCurrentFilters,
    refetch,

    // Utils
    getStatusColor,
  } = usePatientAppointments({ patientId });

  const appointmentStatus = [
    { key: "PendingPayment", label: "Pending Payment" },
    { key: "OnHold", label: "On Hold" },
    { key: "Scheduled", label: "Scheduled" },
    { key: "InProgress", label: "In Progress" },
    { key: "Completed", label: "Completed" },
    { key: "Cancelled", label: "Cancelled" },
    { key: "NoShow", label: "No Show" },
    { key: "PaymentFailed", label: "Payment Failed" },
    { key: "Expired", label: "Expired" },
    { key: "PaymentProcessing", label: "Payment Processing" },
    { key: "RescheduleRequested", label: "Reschedule Requested" },
    { key: "Rescheduled", label: "Rescheduled" },
    { key: "RescheduleDeclined", label: "Reschedule Declined" },
  ];

  const appointmentTypes = [
    { key: "InPerson", label: "In Person" },
    { key: "VideoCall", label: "Video Call" },
    { key: "PhoneCall", label: "Phone Call" },
  ];

  const filterConfigs = [
    {
      name: "status",
      label: "Status",
      data: appointmentStatus,
    },
    {
      name: "appointmentType",
      label: "Appointment Type",
      data: appointmentTypes,
    },
  ];

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("DiagnosedConditionsTable.table_title")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
        </div>
      </div>

        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
          <ConditionsFilters
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchValue: value }))}
            filterType={currentFilters.conditionType}
            setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, conditionType: value }))}
            filterDateFrom={currentFilters.fromDate}
            setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
            filterDateTo={currentFilters.toDate}
            setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={appointmentsData?.data || []}
            filterConfigs={filterConfigs}
          />
            </div>

          {/* Scrollable Table Wrapper */}
          <div style={{ overflowX: "auto" }}>
            <Table
              className="align-middle mb-0 table-hover"
              style={{ whiteSpace: "nowrap" }}
            >
              <thead className="table-light">
                <tr>
                  <th>{t("Date")}</th>
                  <th>{t("Start Time")}</th>
                  <th>{t("End Time")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching   ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td>
                        <Skeleton width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton width={100} height={15} />
                      </td>
                      <td>
                        <Skeleton width={120} height={15} />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center text-danger">
                      <ErrorLoading isError={error} refetch={refetch} />
                    </td>
                  </tr>
                ) : appointmentsData?.data?.length > 0 ? (
                  appointmentsData.data.map((appointment) => (
                    <tr key={appointment.bookingId}>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{appointment.startTime}</td>
                      <td>{appointment.endTime}</td>
                      <td>{appointment.appointmentType}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            color: getStatusColor(appointment.status),
                            fontWeight: 600,
                          }}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/appointment-management/${appointment.bookingId}`}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center view-btn ms-2"
                          >
                            {t("View Booking")}
                            <MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalItems={appointmentsData?.totalCount || 0}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={appointmentsData?.totalPages || 1}
          />
        </div>
      </div>
  );
};

export default AppointmentTable;
