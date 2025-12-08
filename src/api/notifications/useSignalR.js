// hooks/useSignalRNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { signalRService } from './signalRService';
import toast from 'react-hot-toast';
import { useMarkNotificationAsReadMutation } from "../../api/doctorNotificationsApi";

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
            toast.custom((t) => (
              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg">🔔</span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    View
                  </button>
                </div>
              </div>  
            ), {
              duration: 5000,
              position: 'top-left',
            });
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

    // تنظيف عند unmount
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
        
        signalRService.markAsRead(notificationId);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
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