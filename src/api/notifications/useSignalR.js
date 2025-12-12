import { useState, useEffect, useCallback } from 'react';
import { signalRService } from './signalRService';
import toast from 'react-hot-toast';
import { useMarkNotificationAsReadMutation } from "../../api/doctorNotificationsApi";
import { getNotificationIcon } from '../../pages/shared/utils';


export const useSignalRNotifications = (userId, options = {}) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const { enableToast = true } = options;
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  useEffect(() => {
    if (!userId) return;
    const initConnection = async () => {
      try {
        signalRService.onConnectionStatusChanged = (isConnected) => {
          setConnectionStatus(isConnected);
          if (!isConnected) {
            toast.error('Connection lost. Reconnecting...', {
              duration: 3000,
            });
          }
        };

        signalRService.onNotificationReceived = (notification) => {
          console.log("New notification in hook:", notification);
          
          if (notification) {
            const newNotification = {
              id: notification.id || Date.now(), 
              title: notification.title,
              message: notification.message,
              createdAt: notification.createdAt || new Date().toISOString(),
              isRead: false,
              relatedEntityType: notification.type
            };
            
            setRealtimeNotifications(prev => [newNotification, ...prev]);
          }
          
          setUnreadCount(prev => prev + 1);
          
          if (enableToast && notification) {
          toast.custom(
            (t) => (
              <div
                className={`toast-box toast-custom-box shadow  bg-white border p-3 d-flex align-items-start 
             ${t.visible ? "opacity-100" : "opacity-0"} 
              transition-opacity`}
              >
                <div className='d-flex'>
                <div className='avatar-title'>
                {/* Avatar / Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#eef1f6",
                    fontSize: "18px",
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </div>  
             <h6 className="fw-bold mb-1">{notification.title}</h6>
                </div>
             {/* Close */}
                <button
                  className="btn-close ms-2"
                  onClick={() => toast.dismiss(t.id)}
                >
                  close
                {/* <MdClose /> */}
                </button>


                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <p className=" m-0">{notification.message}</p>
                </div>

           
              </div>
            ),
            {
              duration: 600000,
              position: "top-left",
            }
          );
          }
        };

        await signalRService.startConnection(userId);
        
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
        toast.error('Failed to connect to notifications', {
          duration: 3000,
        });
      }
    };

    initConnection();

    return () => {
      signalRService.stopConnection();
    };
  }, [userId, enableToast]);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const result = await markNotificationAsRead(notificationId).unwrap();
      console.log("result", result);
      
      if (result.data) {
        setRealtimeNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        return result;
      }
    } catch (error) {
      console.log("Error marking notification as read:", error);
      return error;
    }
  }, [markNotificationAsRead]);

  const markAllAsRead = useCallback(() => {
    signalRService.markAllAsRead();
    setRealtimeNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notification) => {
    setRealtimeNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const clearRealtimeNotifications = useCallback(() => {
    setRealtimeNotifications([]);
  }, []);

  return {
    connectionStatus,
    unreadCount,
    realtimeNotifications,
    updateUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearRealtimeNotifications,
    isConnected: signalRService.isConnected(),
  };
};
