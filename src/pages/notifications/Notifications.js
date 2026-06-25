import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import ErrorLoading from "../shared/ErrorLoading";
import FilterDropdown from "../patient-management/patient-information/PatientTabs/component/FilterDropdown";
import DateRangePicker from "../patient-management/patient-information/PatientTabs/component/DateRangePicker";
import Pagination from "../shared/Pagination";
import {
  useGetDoctorNotificationsQuery,
  useMarkNotificationAsReadwithoutInvalidateMutation,
  useMarkAllNotificationsAsReadwithoutInvalidateMutation,
  doctorNotificationsApi,
} from "../../api/notifications/doctorNotificationsApi";
import {
  formatTime,
  getNotificationIcon,
  getRandomNumber,
} from "../shared/utils";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Notifications = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  let [isChange, setIsChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(undefined);
  const [filterIsRead, setFilterIsRead] = useState(undefined);
  const [filterEntityType, setFilterEntityType] = useState(undefined);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Local cache for optimistic updates
  const [localNotifications, setLocalNotifications] = useState([]);

  const filter = useMemo(() => {
    const apiFilter = {};

    if (searchTerm) {
      apiFilter.searchText = searchTerm;
    }

    if (filterType) {
      apiFilter.type = filterType;
    }

    if (filterIsRead !== undefined) {
      apiFilter.isRead = filterIsRead;
    }

    if (filterEntityType) {
      apiFilter.relatedEntityType = filterEntityType;
    }

    if (dateRange.start) {
      apiFilter.fromDate = dateRange.start.toISOString().split("T")[0];
    }

    if (dateRange.end) {
      apiFilter.toDate = dateRange.end.toISOString().split("T")[0];
    }

    return apiFilter;
  }, [searchTerm, filterType, filterIsRead, filterEntityType, dateRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDoctorNotificationsQuery({
    filter,
    pageNumber: currentPage,
    pageSize,
  });

  const [markAsRead] = useMarkNotificationAsReadwithoutInvalidateMutation();
  const [markAllAsRead] =
    useMarkAllNotificationsAsReadwithoutInvalidateMutation();

  useEffect(() => {
    refetch();
    if (isChange) {
      return () => {
        dispatch(
          doctorNotificationsApi.util.invalidateTags(["DoctorNotifications"]),
        );
      };
    }
  }, []);
  useEffect(() => {
    console.log("isChange currentPage", isChange);
    if (isChange) {
      console.log("Page changed → invalidate");
      dispatch(
        doctorNotificationsApi.util.invalidateTags(["DoctorNotifications"]),
      );
      setIsChange(false);
    }
  }, [currentPage]);
  // useEffect(() => {

  // }, []);
  useEffect(() => {
    if (response?.data) {
      setLocalNotifications(response.data);
    }
  }, [response]);

  const notifications = localNotifications;
  const totalCount = response?.totalCount || 0;
  const totalPages = response?.totalPages || 0;

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      setLocalNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setIsChange(true);
      console.log("isChange", isChange);
      try {
        await markAsRead(notificationId).unwrap();
      } catch (err) {
        toast.error(t("Failed to mark as read"));
        console.error("Failed to mark as read", err);

        // Revert on error: restore original state
        setLocalNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: false }
              : notification,
          ),
        );
        setIsChange(false);
      }
    },
    [markAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!totalCount > 0 || isLoading || isFetching) return;

    const originalNotifications = [...localNotifications];

    setLocalNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
    setIsChange(true);
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      toast.error(t("Failed to mark all as read"));
      console.error("Failed to mark all as read", err);
      setLocalNotifications(originalNotifications);
      setIsChange(false);
    }
  }, [markAllAsRead, localNotifications]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType(undefined);
    setFilterIsRead(undefined);
    setFilterEntityType(undefined);
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  const handleFilterChange = useCallback((filters) => {
    if (filters.type) {
      const selectedType = Object.keys(filters.type).find(
        (k) => filters.type[k],
      );
      setFilterType(selectedType || undefined);
    } else {
      setFilterType(undefined);
    }

    if (filters.entityType) {
      const selectedEntity = Object.keys(filters.entityType).find(
        (k) => filters.entityType[k],
      );
      setFilterEntityType(selectedEntity || undefined);
    } else {
      setFilterEntityType(undefined);
    }

    if (filters.isRead) {
      const selectedRead = Object.keys(filters.isRead).find(
        (k) => filters.isRead[k],
      );
      setFilterIsRead(
        selectedRead === "true"
          ? true
          : selectedRead === "false"
            ? false
            : undefined,
      );
    } else {
      setFilterIsRead(undefined);
    }
  }, []);

  const ShimmerCard = () => (
    <div className="notification-card-container border-0 ">
      <div className="notification-card">
        <div className="icon-content w-100">
          <div className="mr-3 text-center">
            <Skeleton style={{borderRadius:"40%"}} width={25} height={20} />
            <Skeleton  width={30} height={14} />
          </div>
          <div style={{ flex: 1, maxHeight: "48px" }}>
            <Skeleton style={{minWidth:"70px"}} minW height={14} width={"30%"}  />
            <Skeleton style={{minWidth:"120px"}} height={12} width={"60%"} />
          </div>

          <div className="">
            <Skeleton circle width={50} height={50} />
          </div>

        </div>
      </div>
    </div>
  );

  return (
    // <div className="notifications-container">
    // <div className="dc-haslayout dc-dbsectionspace notifications-main-page">
    <div className="comments-list notifications-list ">
      <div className="filters-container-search">
        {/* Header */}
        <div className="table-header">
          <div>
            <h3 className="table-title">{t("Notifications")}</h3>
          </div>
        </div>
        {/* Filters */}
        <div className="review-filters">
          <DateRangePicker onChange={setDateRange} value={dateRange} />
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
            onFilter={handleFilterChange}
            onReset={resetFilters}
          />
          {
            <button
              onClick={handleMarkAllAsRead}
              className="text-decoration-none"
              style={{
                color: "var(--bluecolor)",
              }}
              disabled={isFetching}
            >
              {t("Mark All as Read")}
            </button>
          }
        </div>
      </div>

      {/* Notifications List */}
      <div className="table-card">
        {isLoading || isFetching  ? (
          Array.from({ length: 10 }).map((_, i) => <ShimmerCard key={i} />)
        ) : isError ? (
          <ErrorLoading onRetry={refetch} />
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            {t("No notifications found")}
          </div>
        ) : (
          notifications.map((note) => {
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
                    <img src="/images/avt/patient-avt.png" alt="Patient" />
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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
    //   </div>
    // </div>
  );
};

export default Notifications;
