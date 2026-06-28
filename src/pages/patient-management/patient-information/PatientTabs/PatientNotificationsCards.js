import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErrorLoading from "../../../shared/ErrorLoading";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";
import Pagination from "../../../shared/Pagination";
import {
  useGetPatientDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../../../api/PatientProfile/patientNotificationsApi";
import PatientName from "./component/PatientName";
import DataEmptyComponent from "../../../shared/DataEmptyComponent";
import { formatTime, getNotificationIcon } from "../../../shared/utils";
import { ShimmerCard } from "../../../notifications/Notifications";

const PatientNotificationsCards = ({ patientId }) => {
  const { t } = useTranslation();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(undefined);
  const [filterIsRead, setFilterIsRead] = useState(undefined);
  const [filterEntityType, setFilterEntityType] = useState(undefined);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Transform filters to API format
  const filter = useMemo(() => {
    return {
      searchText: searchTerm || undefined,
      type: filterType,
      isRead: filterIsRead,
      relatedEntityType: filterEntityType,
      fromDate: dateRange.start?.toISOString().split("T")[0],
      toDate: dateRange.end?.toISOString().split("T")[0],
    };
  }, [searchTerm, filterType, filterIsRead, filterEntityType, dateRange]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // API Query
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPatientDoctorNotificationsQuery({
    patientId,
    filter,
    pageNumber: currentPage,
    pageSize,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = response?.data || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = response?.totalPages || 0;

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead({ notificationId, patientId }).unwrap();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(patientId).unwrap();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterType(undefined);
    setFilterIsRead(undefined);
    setFilterEntityType(undefined);
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };



  const isFilterEmpty =
    !filterType &&
    !filterIsRead &&
    !filterEntityType &&
    !dateRange.start &&
    !dateRange.end;

  return (
    <div className="comments-list notifications-list">
      <div className="filters-container-search">
        {/* Header */}
        <div className="table-header">
          <div>
            <h3 className="table-title">{t("Patient Notifications")}</h3>
          <h6 className="table-subtitle"style={{fontWeight:"700"}} ><PatientName/></h6>
          </div>
          {/* {totalCount > 0 && !isLoading && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
              disabled={isFetching}
            >
              <LiaCheckDoubleSolid />
              {t("Mark All as Read")}
            </button>
          )} */}
        </div>

        {/* Filters */}
        <div className="review-filters">
          <FilterDropdown
            oneOption={true}
            small
            filters={[
              {
                name: "type",
                label: t("Notification Type"),
                data: [
                  { key: "AppointmentBooked", label: t("Appointment Booked") },
                  {
                    key: "AppointmentCancelledByDoctor",
                    label: t("Appointment Cancelled By Doctor"),
                  },
                  {
                    key: "AppointmentCancelledByPatient",
                    label: t("Appointment Cancelled By Patient"),
                  },
                  {
                    key: "AppointmentRescheduled",
                    label: t("Appointment Rescheduled"),
                  },
                  {
                    key: "AppointmentReminder24h",
                    label: t("Appointment Reminder 24h"),
                  },
                  {
                    key: "AppointmentReminder1h",
                    label: t("Appointment Reminder 1h"),
                  },
                  { key: "PaymentSuccessful", label: t("Payment Successful") },
                  { key: "PaymentFailed", label: t("Payment Failed") },
                  {
                    key: "SystemAnnouncement",
                    label: t("System Announcement"),
                  },
                  {
                    key: "MaintenanceNotification",
                    label: t("Maintenance Notification"),
                  },
                  {
                    key: "AccountVerificationReminder",
                    label: t("Account Verification Reminder"),
                  },
                  {
                    key: "NewDoctorAvailableInArea",
                    label: t("New Doctor AvailableInArea"),
                  },
                  { key: "NewMessage", label: t("New Message") },
                  { key: "RefundCompleted", label: t("Refund Completed") },
                ],
              },
              {
                name: "entityType",
                label: t("Related To"),
                data: [
                  { key: "Booking", label: t("Booking") },
                  { key: "Message", label: t("Message") },
                  { key: "Payment", label: t("Payment") },
                  { key: "System", label: t("System") },
                ],
              },
              {
                name: "isRead",
                label: t("Status"),
                data: [
                  { key: "true", label: t("Read") },
                  { key: "false", label: t("Unread") },
                ],
              },
            ]}
            onFilter={(filters) => {
              const typeFilter = filters.type || {};
              const selectedType = Object.keys(typeFilter).find((k) => typeFilter[k]);
              setFilterType(selectedType || undefined);

              const entityFilter = filters.entityType || {};
              const selectedEntity = Object.keys(entityFilter).find((k) => entityFilter[k]);
              setFilterEntityType(selectedEntity || undefined);

              const readFilter = filters.isRead || {};
              const selectedRead = Object.keys(readFilter).find((k) => readFilter[k]);
              setFilterIsRead(selectedRead === "true" ? true : selectedRead === "false" ? false : undefined);
            }}
            onReset={resetFilters}
          />
          <DateRangePicker onChange={setDateRange} />
        </div>
      </div>

      {/* Notifications List */}
      <div className="table-card">
        {isLoading || isFetching? (
          Array.from({ length: 7 }).map((_, i) => <ShimmerCard key={i}  imgLoaded={false}/>)
        ) : isError ? (
          <ErrorLoading onRetry={refetch} />
        ) : notifications.length === 0 ? (
         <>
              {isFilterEmpty? (
                <DataEmptyComponent imgStyle={{ maxWidth: "300px" }} title="No Notifications " text="No Notifications For This Patient yet "  />                
              ):(
                <DataEmptyComponent imgStyle={{ maxWidth: "200px" }} title="No Reviews Found" text="No Reviews Found Based on Filters"  
                btnText="Clear Filters"
                onClick={() => {
                  resetFilters();
                }}
                 />
              )}
            </>
        ) : (
          notifications.map((note) => {
            const icon = getNotificationIcon(note);

            return (
              <div
                key={note.id}
                className={` notification-card-container border-0 unread ${
                  !note.isRead ? "unread" : ""
                }`}
                onClick={() => !note.isRead && handleMarkAsRead(note.id)}
                style={{ cursor: note.isRead ? "" : "pointer" }}
              >
                <div className="notification-card d-flex align-items-center">
                  <div className="notification-icon text-center">
                    {getNotificationIcon(note.relatedEntityType)}
                    <span> {formatTime(note.createdAt)}</span>
                  </div>
                  <div className="notification-content flex-grow-1">
                    <h6 className="mb-0 notification-title">{note.title}</h6>

                    <p className="mb-0">{note.message}</p>
                  </div>

                  <div className="ml-auto notification-avatar">
                    {/* <img src="/images/avt/patient-avt.png" alt="Patient" /> */}
                  </div>
                  {!note.isRead && (
                    <span className="mb-auto w-0">
                      <div
                        className="rounded-circle "
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: "#dc3545",
                        }}
                      />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {!isLoading && totalCount > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default PatientNotificationsCards;