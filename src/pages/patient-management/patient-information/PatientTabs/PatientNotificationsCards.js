import React, { useState, useEffect, useMemo } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaFlask,
  FaMoneyBillWave,
  FaEnvelopeOpenText,
  FaBell,
  FaSyncAlt,
} from "react-icons/fa";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import ErrorLoading from "../../../shared/ErrorLoading";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";
import Pagination from "../../../shared/Pagination";
import {
  useGetPatientDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../../../api/patientNotificationsApi";

const PatientNotificationsCards = ({ patientId=4 }) => {
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

  // Icon mapping based on notificationType + relatedEntityType
  const getNotificationIcon = (item) => {
    const entityIcons = {
      Appointment: <FaCalendarCheck style={{ color: "#007bff" }} />,
      Message: <FaEnvelopeOpenText style={{ color: "#17a2b8" }} />,
      Payment: <FaMoneyBillWave style={{ color: "#28a745" }} />,
      Medical: <FaFlask style={{ color: "#6f42c1" }} />,
      System: <FaSyncAlt style={{ color: "#6c757d" }} />,
    };

    const typeIcons = {
      Info: <FaInfoCircle style={{ color: "var(--themecolor)" }} />,
      Warning: <FaExclamationTriangle style={{ color: "#xffc107" }} />,
      Alert: <FaTimesCircle style={{ color: "#dc3545" }} />,
      Reminder: <FaBell style={{ color: "#fd7e14" }} />,
    };

    // Priority: entity type > notification type
    return entityIcons[item.relatedEntityType] || typeIcons[item.notificationType] || <FaInfoCircle style={{ color: "var(--themecolor)" }} />;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Shimmer Card
  const ShimmerCard = () => (
    <div className="notification-card-container mb-2">
      <div className="notification-card">
        <div className="icon-content w-100">
          <div className="alert-icon">
            <Skeleton  width={35} height={30} />
          </div>
          <div style={{ flex: 1 }}>
            <Skeleton height={20} width="20%" />
            <Skeleton height={16} width="80%" style={{ marginTop: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="comments-list notifications-list">
      <div className="filters-container-search">
        {/* Header */}
        <div className="table-header">
          <div>
            <h3 className="table-title">{t("Patient Notifications")}</h3>
            <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
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
          Array.from({ length: 5 }).map((_, i) => <ShimmerCard key={i} />)
        ) : isError ? (
          <ErrorLoading onRetry={refetch} />
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            {t("No notifications found")}
          </div>
        ) : (
          notifications.map((note) => {
            const icon = getNotificationIcon(note);

            return (
              <div
                key={note.id}
                className={`mb-2 notification-card-container ${!note.isRead ? "unread" : ""}`}
                onClick={() => !note.isRead && handleMarkAsRead(note.id)}
                style={{ cursor: note.isRead ? "default" : "pointer" }}
              >
                <div className="notification-card">
                  <div className="icon-content w-100 ">
                    <div className="alert-icon">{icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex justify-content-between">
                      <h6 className=" mb-0 notification-title ">{note.title}</h6>
                        <p  className="mb-0 text-muted small"style={{whiteSpace:"nowrap"}}>{formatDate(note.createdAt)}</p>
                      </div>
                      <span className="mb-2" style={{fontSize:"14px"}} >{note.message}</span>
                      <div 
                      // className="d-flex align-items-center justify-content-between"
                      >
                        {/* <LiaCheckDoubleSolid
                          style={{
                            color: note.isRead ? "#0b81ff" : "#c2c9d6",
                            fontSize: "1.2rem",
                          }}
                        /> */}
                      </div>
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
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default PatientNotificationsCards;