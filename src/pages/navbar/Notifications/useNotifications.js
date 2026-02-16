import { useState, useEffect, useCallback } from "react";
import {
  useGetDoctorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../../api/notifications/doctorNotificationsApi";
import { useSignalRNotifications } from "../../../api/notifications/useSignalR";

const PAGE_SIZE = 10;

export const useNotifications = (userId) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const { data, isFetching , isLoading, refetch} = useGetDoctorNotificationsQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    
  });

  const [markAsReadApi] = useMarkNotificationAsReadMutation();
  const [markAllApi] = useMarkAllNotificationsAsReadMutation();

  // server → merge
  useEffect(() => {
    if (!data?.data) return;

    setNotifications(prev => {
      const map = new Map(prev.map(n => [n.id, n]));
      data.data.forEach(n => map.set(n.id, n));
      return Array.from(map.values());
    });

    setHasMore(data.hasNextPage);
  }, [data]);

  // realtime → prepend
  const { isConnected } =
  useSignalRNotifications({
    userId,
    enableToast: true,
    onMessage: (n) => {
      setNotifications(prev => {
        if (prev.some(x => x.id === n.id)) return prev;
        return [{ ...n, isRead: false }, ...prev];
      });
    },

  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage(p => p + 1);
    }
  };

  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

    try {
      await markAsReadApi(id).unwrap();
    } catch {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: false } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    const snapshot = notifications;

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await markAllApi().unwrap();
    } catch {
      setNotifications(snapshot);
    }
  };
    const handleNotificationClick = async (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification || notification.isRead) return;
    markAsRead(notificationId);
  };


  return {
    notifications,
    unreadCount,
    loadMore,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    isFetching,
    isLoading, 
    refetch,
    isConnected,
    hasMore,
  };
};




  export const isNewNotification = (createdAt) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffMinutes = (now - notificationDate) / (1000 * 60);
    return diffMinutes < 5; 
  };
  