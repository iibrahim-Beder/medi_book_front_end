import React, { useState, useEffect, useMemo } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { Bell } from "lucide-react";
import "../patient-management/patient-information/PatientTabs/component/DateRangePicker.css";
import "./NotificationButton.css"
import { 
  useGetDoctorNotificationsQuery,
} from "../../api/doctorNotificationsApi";
import { useSignalRNotifications } from "../../api/notifications/useSignalR";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { getNotificationIcon } from "../shared/utils";
const NotificationDropdown = () => {
  const [localUserId, setLocalUserId] = useState(1); 
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);
  
  const { 
    connectionStatus, 
    unreadCount, 
    updateUnreadCount,
    markAsRead,
    realtimeNotifications,
  } = useSignalRNotifications(localUserId, {
    enableToast: true
  });

  const { 
    data: notificationsResponse, 
    isLoading, 
    refetch,
    isFetching 
  } = useGetDoctorNotificationsQuery({
    pageNumber: 1,
    pageSize: 10,
    // filter: { isRead: false }
  }, {
    refetchOnMountOrArgChange: true,
  });
  console.log("notificationsResponse", notificationsResponse);

  useEffect(() => {
    if (notificationsResponse && notificationsResponse.data) {
      const serverNotifications = notificationsResponse.data;
      
      const uniqueRealtimeNotifs = realtimeNotifications.filter(rtNotif => 
        !serverNotifications.some(serverNotif => serverNotif.id === rtNotif.id)
      );
      
      const mergedNotifications = [
        ...uniqueRealtimeNotifs,
        ...serverNotifications
      ]; 
      
      setLocalNotifications(mergedNotifications);
      
      const unreadFromServer = serverNotifications.filter(n => !n.isRead).length;
      const unreadFromRealtime = uniqueRealtimeNotifs.filter(n => !n.isRead).length;
      updateUnreadCount(unreadFromServer + unreadFromRealtime);
    } else if (realtimeNotifications.length > 0) {
      setLocalNotifications(realtimeNotifications.slice(0, 15));
      updateUnreadCount(realtimeNotifications.filter(n => !n.isRead).length);
    }
  }, [notificationsResponse, realtimeNotifications, updateUnreadCount]);

  const handleNotificationClick = async (notificationId) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    await markAsRead(notificationId);
  };



  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('Just now');
    if (diffMins < 60) return `${diffMins} ${t('min ago')}`;
    if (diffHours < 24) return `${diffHours} ${t('hour ago')}`;
    if (diffDays < 7) return `${diffDays} ${t('day ago')}`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isNewNotification = (createdAt) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffMinutes = (now - notificationDate) / (1000 * 60);
    return diffMinutes < 5; 
  };

  return (
    <>
      <Dropdown 
        align="end" 
        className="notifications" 
        onToggle={(isOpen) => {
          // setIsDropdownOpen(isOpen);
          if (isOpen) {
            if(!connectionStatus){
              refetch();
              // console.log("refetch");
            }
          }
        }}
      >
        <Dropdown.Toggle
          variant="light"
          id="dropdown-notifications"
          className="position-relative noti-nav active-dot active-dot-danger rounded-circle"
          style={{
            borderRadius: "50%",
            fontSize: "large",
            color: "#6B7280",
            background: "rgb(249, 249, 249)",
            boxShadow: "none",
            display: "flex",
            border: "1px solid #ddd",
            padding: "6px",
            position: 'relative'
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge 
              pill 
              bg="danger" 
              className="position-absolute"
              style={{
                backgroundColor:"red",
                color: 'white',
                top: '-5px',
                right: '-5px',
                fontSize: '0.7rem',
                minWidth: 'fit-content',
                height: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
         className="dropdown-menu-end notifications shadow list-date-option open"
        style={{
          minWidth: "350px",
          backgroundColor: "var(--cardcolor)",
          border: "1px solid #ccc",
          marginTop: "10px",
          maxHeight: "0",
          opacity: "0",
          overflow: "hidden",
          display: "block",
          transform: "translate(3px, 267.2222px)",
        }}
        >
          <div className="topnav-dropdown-header p-2 border-bottom">
            <span className="fw-bold" style={{ color: "var(--terthemecolor)" }}>
              Notifications
            </span>
            
            <div className="d-flex align-items-center gap-2">
            </div>
          </div>
          
          <div
            className="noti-content"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {isLoading ? (
              <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2 mb-0">{t('Loading notifications...')}</p>
              </div>
            ) : localNotifications.length === 0 ? (
              <div className="text-center p-4">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
                <p className="text-muted mb-0">{t('No notifications')}</p>
              </div>
            ) : (
              <ul className="list-unstyled m-0">
                {localNotifications.map((n, index) => (
                  <li 
                    key={n.id || `realtime-${index}`} 
                    className="notification-message border-bottom"
                    onClick={() => handleNotificationClick(n.id)}
                    style={{ 
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div
                      className="d-flex align-items-start p-2 text-decoration-none text-dark"
                      style={{ 
                        gap: "10px",
                      }}
                    >
                      <span className="avatar me-2" style={{minWidth:"40px"}}>
                        <div className="rounded-circle  d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px", color: 'white', backgroundColor:"#e6e8ee57"}}>
                          {/* {n.relatedEntityType ? n.relatedEntityType.charAt(0) : 'N'} */}
                          {getNotificationIcon(n.relatedEntityType)}
                        </div>
                      </span>
                      <div className="media-body">
                        <h6 className="mb-1 d-flex justify-content-between">
                          <span>{n.title}</span>
                          <span className="text-muted small" style={{whiteSpace:"nowrap"}}>
                            {formatTime(n.createdAt)}
                          </span>
                        </h6>
                        <p 
                          title={n.message} 
                          className="mb-0 small text-ellipsis" 
                          style={{direction:"inherit", maxWidth: "230px"}}
                        >
                          {n.message}
                        </p>
                      </div>
                      
                      {!n.isRead && (
                        <span className="ms-auto">
                          <div className="rounded-circle "
                            title ={isNewNotification(n.createdAt)?t("New"):""}
                            style={{ width: "8px", height: "8px", backgroundColor: isNewNotification(n.createdAt) ? '#28a745' : '#dc3545' }} 
                            />
                        </span> 
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {localNotifications.length > 0 && (
            <div className="topnav-dropdown-footer border-top p-2 text-center">
              <Link to="/notifications">
              <button
                className="text-primary text-decoration-none"
                // onClick={(e) => {
                //   e.preventDefault();
                //   // Navigate to all notifications page
                //   console.log("View all notifications clicked");
                // }}
              >
                View all notifications
              </button>
              </Link>
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;