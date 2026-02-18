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
import {  formatTime, getNotificationIcon, getRandomNumber } from "../shared/utils";
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
  const [markAllAsRead] = useMarkAllNotificationsAsReadwithoutInvalidateMutation();

 useEffect(() => {
    refetch();
    if(isChange){return () => {dispatch(doctorNotificationsApi.util.invalidateTags(["DoctorNotifications"]));};}
 },[])
 useEffect(() => {
  console.log("isChange currentPage",isChange)
   if (isChange) {
     console.log("Page changed → invalidate");
      dispatch(doctorNotificationsApi.util.invalidateTags(["DoctorNotifications"]));
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

  const handleMarkAsRead = useCallback(async (notificationId) => {
    setLocalNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    setIsChange(true);
    console.log("isChange",isChange)
    try {
      await markAsRead(notificationId).unwrap();
    } catch (err) {
      toast.error(t("Failed to mark as read"));
      console.error("Failed to mark as read", err);
      
      // Revert on error: restore original state
      setLocalNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: false }
            : notification
        )
      );
      setIsChange(false);

    }
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(async () => {
    
    const originalNotifications = [...localNotifications];
    
    setLocalNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
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
      const selectedType = Object.keys(filters.type).find((k) => filters.type[k]);
      setFilterType(selectedType || undefined);
    } else {
      setFilterType(undefined);
    }
    
    if (filters.entityType) {
      const selectedEntity = Object.keys(filters.entityType).find((k) => filters.entityType[k]);
      setFilterEntityType(selectedEntity || undefined);
    } else {
      setFilterEntityType(undefined);
    }
    
    if (filters.isRead) {
      const selectedRead = Object.keys(filters.isRead).find((k) => filters.isRead[k]);
      setFilterIsRead(selectedRead === "true" ? true : selectedRead === "false" ? false : undefined);
    } else {
      setFilterIsRead(undefined);
    }
  }, []);

  const ShimmerCard = () => (
    <div className="notification-card-container ">
      <div className="notification-card">
        <div className="icon-content w-100">
          <div className="alert-icon">
            <Skeleton width={35} height={30} />
          </div>
          <div style={{ flex: 1 ,maxHeight:"48px"} }>
            <Skeleton height={14} width={`${getRandomNumber(15, 30)}%`}/>
            <Skeleton height={12} width={`${getRandomNumber(50, 90)}%`} />
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
              <DateRangePicker 
                onChange={setDateRange}
                value={dateRange}
              />
              <FilterDropdown
                small
                filters={[
                  {
                    name: "type",
                    label: t("Notification Type"),
                    data: [
                      { key: "Info", label: t("Info") },
                      { key: "Warning", label: t("Warning") },
                      { key: "Alert", label: t("Alert") },
                      { key: "Reminder", label: t("Reminder") },
                    ],
                  },
                  {
                    name: "entityType",
                    label: t("Related To"),
                    data: [
                      { key: "Appointment", label: t("Appointment") },
                      { key: "Message", label: t("Message") },
                      { key: "Payment", label: t("Payment") },
                      { key: "Medical", label: t("Medical") },
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
              {totalCount > 0 && !isLoading && !isFetching && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-decoration-none"
                  style={{
                    color: "var(--bluecolor)"
                  }}
                  disabled={isFetching}
                >
                  {t("Mark All as Read")}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="table-card">
            {isLoading || isFetching  ?(
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
                    className={` notification-card-container ${
                      !note.isRead ? "unread" : ""
                    }`}
                    onClick={() => !note.isRead && handleMarkAsRead(note.id)}
                    style={{ cursor: note.isRead ? "default" : "pointer" }}
                  >
                    <div className="notification-card">
                      <div className="icon-content w-100">
                        <div className="alert-icon">
                          {getNotificationIcon(note.relatedEntityType)}
                        </div>
                        <div style={{ flex: 1 }}>
                      <div className="d-flex justify-content-between">
                            <h6 className="mb-0 notification-title">
                              {note.title}
                            </h6>
                            <p
                              className="mb-0 text-muted small date-time "
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {!note.isRead && (
                                <span className="ms-auto">
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
                              {formatTime(note.createdAt)}
                            </p>
                          </div>
                          <span className="mb-2" style={{ fontSize: "14px" }}>
                            {note.message}
                          </span>
                          {/* <div className="d-flex align-items-center justify-content-between">
                            <div></div>
                          </div> */}
                        </div>
                      </div>
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